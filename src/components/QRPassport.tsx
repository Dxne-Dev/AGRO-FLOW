import { QRCodeSVG } from 'qrcode.react';

export function QRPassport({ url }: { url: string }) {
  return (
    <div className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
      <QRCodeSVG value={url} size={160} />
      <p className="break-all text-sm text-stone-700">{url}</p>
      <p className="text-xs italic text-stone-500">Traceability: verified journey</p>
    </div>
  );
}
