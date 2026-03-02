'use client';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRCodeDisplayProps {
    url: string;
    label?: string;
}

export default function QRCodeDisplay({ url, label = 'Scan to view Emergency ID' }: QRCodeDisplayProps) {

    const downloadQR = () => {
        // Convert SVG to canvas then download as PNG
        const svg = document.querySelector('#emergency-qr svg') as SVGElement;
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        canvas.width = 400;
        canvas.height = 400;
        img.onload = () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 400, 400);
            ctx.drawImage(img, 0, 0, 400, 400);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'lifevault-emergency-qr.png';
            a.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="section-card text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
                📷 Emergency QR Code
            </p>

            {/* QR Code */}
            <div id="emergency-qr" className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-2xl inline-block">
                    <QRCodeSVG
                        value={url}
                        size={200}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#0a0a0a"
                    />
                </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">{label}</p>
            <p className="text-xs text-gray-600 mb-5 break-all font-mono">{url}</p>

            {/* Download QR as image */}
            <button
                onClick={downloadQR}
                className="btn-secondary flex items-center justify-center gap-2 text-sm"
            >
                <Download size={16} />
                Download QR as Image
            </button>

            <p className="text-xs text-gray-600 mt-3">
                Set as lock screen wallpaper for instant access by first responders.
            </p>
        </div>
    );
}
