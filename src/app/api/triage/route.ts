import { NextRequest, NextResponse } from 'next/server';

// ─── Rule-Based Triage Engine ───────────────────────────────────────────────
// Works 100% offline. Gemini API enhances it if GEMINI_API_KEY is set.

interface TriageResult {
    priority: 'critical' | 'moderate' | 'stable';
    summary: string;
    warnings: string[];
    safeFor: string[];
}

// Known allergy → drug class / treatment cross-reactions
const ALLERGY_RULES: Record<string, string[]> = {
    penicillin: ['AVOID Penicillin and all beta-lactam antibiotics (Amoxicillin, Ampicillin)', 'USE Azithromycin or Clindamycin as antibiotic alternative'],
    amoxicillin: ['AVOID Amoxicillin and all penicillins — documented allergy'],
    sulfa: ['AVOID Sulfonamides, Sulfamethoxazole, Trimethoprim-sulfamethoxazole (Bactrim)'],
    aspirin: ['AVOID Aspirin and NSAIDs (Ibuprofen, Naproxen) — risk of anaphylaxis', 'USE Paracetamol/Acetaminophen for pain management instead'],
    ibuprofen: ['AVOID all NSAIDs — documented NSAID hypersensitivity'],
    morphine: ['AVOID Morphine — USE Fentanyl or Hydromorphone as opioid alternative'],
    codeine: ['AVOID Codeine and Tramadol — opioid sensitivity noted'],
    latex: ['LATEX-FREE environment required — use non-latex gloves and equipment'],
    shellfish: ['AVOID Iodine-based contrast dye — shellfish allergy increases iodine contrast risk', 'NOTIFY radiologist before any CT scan with contrast'],
    iodine: ['AVOID Iodinated contrast media for CT/imaging — documented iodine allergy', 'PRE-MEDICATE with antihistamines if contrast unavoidable'],
    peanuts: ['High anaphylaxis risk — ensure epinephrine (EpiPen) is available', 'CHECK all IV medications for lipid/peanut oil carriers'],
    eggs: ['CHECK flu vaccine and certain anaesthetics (Propofol contains egg lecithin)'],
    contrast: ['AVOID IV contrast agents — document allergy before any imaging'],
    cephalosporin: ['AVOID cephalosporins and related beta-lactams — cross-reaction risk with penicillin allergy'],
};

// Chronic condition → clinical guidance
const CONDITION_RULES: Record<string, string> = {
    'type 1 diabetes': 'CHECK blood glucose immediately. Risk of hypoglycaemia under stress. Do not withhold glucose if BGL < 4 mmol/L.',
    'type 2 diabetes': 'Monitor blood glucose. Metformin may need to be held if contrast imaging or surgery planned.',
    'diabetes': 'CHECK blood glucose immediately — diabetic patient. Risk of hypo/hyperglycaemia.',
    'asthma': 'AVOID NSAIDs and beta-blockers — bronchospasm risk. Have nebulised salbutamol available.',
    'copd': 'CONTROLLED oxygen therapy — target SpO2 88–92%. Avoid high-flow O2 (hypercapnic risk).',
    'hypertension': 'Monitor BP closely. Avoid vasoconstrictors if possible. Check current antihypertensive medications.',
    'heart failure': 'Fluid restriction — avoid aggressive IV fluid resuscitation. Monitor for pulmonary oedema.',
    'epilepsy': 'If seizing: secure airway, do not restrain. Check current anticonvulsant medication and timing of last dose.',
    'seizure': 'Secure airway. Benzodiazepines for active seizure. Determine last seizure medication dose.',
    'kidney disease': 'ADJUST all drug doses for renal function. Avoid nephrotoxic agents (NSAIDs, contrast, aminoglycosides).',
    'ckd': 'Adjust drug dosing for renal impairment. Avoid NSAIDs and nephrotoxic agents.',
    'liver disease': 'Adjust doses of hepatically-metabolised drugs. Avoid hepatotoxic medications. Monitor coagulation.',
    'cirrhosis': 'High bleeding risk — check coagulation. Avoid NSAIDs. Portal hypertension risk.',
    'atrial fibrillation': 'Check anticoagulation status. Patient likely on Warfarin or DOAC — bleeding risk elevated.',
    'afib': 'Likely anticoagulated — elevated bleeding risk. Check INR if on Warfarin.',
    'hiv': 'Immunocompromised. Verify ART (antiretroviral) medication list. Opportunistic infection risk.',
    'pregnancy': 'AVOID X-rays/CT without shielding. Drug safety must be verified for pregnancy. Alert obstetrics team.',
    'anemia': 'Monitor Hb. May tolerate blood loss poorly. Consider transfusion threshold and blood group confirmation.',
    'hemophilia': 'Clotting factor replacement needed urgently. Avoid IM injections. Contact haematology.',
    'hypothyroid': 'Risk of myxoedema coma under anaesthesia or major stress. Consider thyroid hormone supplementation.',
    'hyperthyroid': 'Risk of thyroid storm if stressed/febrile. Monitor heart rate, avoid iodine contrast.',
};

// Medication → clinical context for first responders
const MEDICATION_RULES: Record<string, string> = {
    warfarin: 'On WARFARIN — elevated bleeding risk. Check INR urgently.',
    heparin: 'On anticoagulant therapy — increased bleeding risk.',
    rivaroxaban: 'On DOAC (Rivaroxaban) — bleeding risk, no rapid reversal available.',
    apixaban: 'On DOAC (Apixaban) — bleeding risk. Andexanet alfa reversal if available.',
    dabigatran: 'On DOAC (Dabigatran) — Idarucizumab reversal agent available.',
    aspirin: 'On daily aspirin — impaired platelet function, increased bleeding risk.',
    clopidogrel: 'On Clopidogrel (Plavix) — antiplatelet, significant bleeding risk.',
    insulin: 'On insulin — check blood glucose IMMEDIATELY. Hypoglycaemia risk especially if not eating.',
    metformin: 'On Metformin — hold if renal impairment or contrast imaging planned.',
    metoprolol: 'On beta-blocker (Metoprolol) — may mask tachycardia. Avoid epinephrine for anaphylaxis.',
    atenolol: 'On beta-blocker — may mask tachycardia response.',
    digoxin: 'On Digoxin — narrow therapeutic index. Check levels if altered mental status.',
    lithium: 'On Lithium — toxic in dehydration. Check lithium levels urgently.',
    phenytoin: 'On Phenytoin (anticonvulsant) — many drug interactions. Check level if seizure recurrence.',
    valproate: 'On Valproate — anticonvulsant. Hepatotoxic risk.',
    prednisone: 'On corticosteroids — adrenal suppression risk under severe stress. May need stress-dose steroids.',
    prednisolone: 'On corticosteroids — may need stress-dose steroids in major trauma/surgery.',
    immunosuppressant: 'On immunosuppressant therapy — elevated infection risk, impaired wound healing.',
    tacrolimus: 'On Tacrolimus (immunosuppressant) — transplant patient. Many drug interactions.',
    ciclosporin: 'On Ciclosporin (immunosuppressant) — transplant patient. Check drug interactions carefully.',
};

const LOCAL_SUMMARIES: Record<string, string> = {
    fr: "Sommaire clinique : {s}. {w} alertes de traitement identifiées.",
    es: "Resumen clínico: {s}. {w} alertas de tratamiento identificadas.",
    hi: "नैदानिक सारांश: {s}। {w} उपचार चेतावनियाँ पहचानी गईं।"
};

function ruleBased(input: { name: string; bloodGroup: string; allergies: string; conditions: string; medications: string; targetLang?: string }): TriageResult {
    const warnings: string[] = [];
    const safeFor: string[] = ['Standard vital signs monitoring', 'IV access (18G minimum)', 'Oxygen supplementation'];

    const allergiesLower = (input.allergies || '').toLowerCase();
    const conditionsLower = (input.conditions || '').toLowerCase();
    const medicationsLower = (input.medications || '').toLowerCase();

    // ── Blood group guidance ──
    const bgWarning: Record<string, string> = {
        'O-': 'UNIVERSAL DONOR — O- blood can be given to any patient in emergency. Confirm exact group before elective transfusion.',
        'O+': 'Blood group O+ — compatible with O, A, B, AB positive recipients. Confirm group before transfusion.',
        'AB+': 'UNIVERSAL RECIPIENT — can receive any blood type. Confirm before transfusion.',
        'AB-': 'Rare blood group AB- — request matched blood or use O- as emergency fallback.',
        'B-': 'Blood group B- is rare. Request matched blood. Emergency fallback: O-.',
        'A-': 'Blood group A- is uncommon. Request matched blood. Emergency fallback: O-.',
    };
    if (bgWarning[input.bloodGroup]) {
        warnings.push(`🩸 BLOOD GROUP ${input.bloodGroup} — ${bgWarning[input.bloodGroup]}`);
    }

    // ── Allergy warnings ──
    for (const [key, rules] of Object.entries(ALLERGY_RULES)) {
        if (allergiesLower.includes(key)) {
            rules.forEach(r => warnings.push(`⚠️ ALLERGY [${key.toUpperCase()}] — ${r}`));
        }
    }

    // ── Condition warnings ──
    let conditionPriority = false;
    for (const [key, guidance] of Object.entries(CONDITION_RULES)) {
        if (conditionsLower.includes(key)) {
            warnings.push(`🏥 CONDITION — ${guidance}`);
            if (['diabetes', 'epilepsy', 'heart failure', 'hemophilia', 'pregnancy'].some(c => key.includes(c))) {
                conditionPriority = true;
            }
        }
    }

    // ── Medication guidance ──
    let hasAnticoagulant = false;
    for (const [key, guidance] of Object.entries(MEDICATION_RULES)) {
        if (medicationsLower.includes(key)) {
            warnings.push(`💊 MEDICATION — ${guidance}`);
            if (['warfarin', 'heparin', 'rivaroxaban', 'apixaban', 'dabigatran', 'clopidogrel'].includes(key)) {
                hasAnticoagulant = true;
            }
        }
    }

    if (hasAnticoagulant) {
        safeFor.push('Direct pressure for wound haemostasis (avoid early tourniquet if possible)');
    } else {
        safeFor.push('Standard haemostasis and wound management');
    }

    // ── Priority scoring ──
    let priority: TriageResult['priority'] = 'stable';
    if (warnings.length >= 4 || conditionPriority || hasAnticoagulant) priority = 'critical';
    else if (warnings.length >= 2) priority = 'moderate';

    // ── Summary ──
    const allergySummary = input.allergies ? `allergies to ${input.allergies}` : '';
    const conditionSummary = input.conditions ? `history of ${input.conditions}` : '';
    const medSummary = input.medications ? `on ${input.medications}` : '';
    const details = [allergySummary, conditionSummary, medSummary].filter(Boolean).join(', ');

    let summary = warnings.length === 0
        ? `${input.name} (${input.bloodGroup}) has no flagged allergies, conditions, or high-risk medications. Proceed with standard emergency protocols.`
        : `${input.name} (${input.bloodGroup}) — ${details}. ${warnings.length} treatment consideration${warnings.length > 1 ? 's' : ''} flagged below. Review before administering drugs or procedures.`;

    // Localize summary if requested (Hackathon demo logic)
    if (input.targetLang && LOCAL_SUMMARIES[input.targetLang]) {
        const pattern = LOCAL_SUMMARIES[input.targetLang];
        summary = pattern.replace('{s}', details || 'No history').replace('{w}', warnings.length.toString());
    }

    return { priority, summary, warnings: warnings.slice(0, 6), safeFor };
}

// ─── Route Handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, bloodGroup, allergies, conditions, medications, targetLang = 'en' } = body;

        const apiKey = process.env.GEMINI_API_KEY;

        // Try Gemini if API key is set
        if (apiKey && apiKey !== 'your_gemini_api_key_here') {
            const prompt = `You are an emergency medical AI assistant analyzing a patient's profile to help first responders.
Respond in ${targetLang === 'en' ? 'English' : targetLang}.

Patient:
- Name: ${name}
- Blood Group: ${bloodGroup}
- Allergies: ${allergies || 'None documented'}
- Conditions: ${conditions || 'None documented'}
- Medications: ${medications || 'None documented'}

Return ONLY valid JSON (no markdown), with fields:
- "priority": "critical" | "moderate" | "stable"
- "summary": 1–2 sentence clinical summary for first responders (max 50 words)
- "warnings": array of 2-5 specific treatment warnings, each starting with a drug/action in CAPS
- "safeFor": array of 2-3 things that are generally safe given this profile`;

            try {
                const resp = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.1, maxOutputTokens: 512, responseMimeType: 'application/json' },
                        }),
                    }
                );
                if (resp.ok) {
                    const data = await resp.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const parsed = JSON.parse(text);
                        return NextResponse.json(parsed);
                    }
                }
            } catch {
                // Fall through to rule-based engine
            }
        }

        // ── Always-on rule-based fallback ──
        const result = ruleBased({ name, bloodGroup, allergies, conditions, medications, targetLang });
        return NextResponse.json(result);

    } catch (err) {
        console.error('Triage error:', err);
        return NextResponse.json({ error: 'Failed to generate triage' }, { status: 500 });
    }
}
