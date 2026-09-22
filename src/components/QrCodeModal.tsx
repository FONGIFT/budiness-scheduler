import React from 'react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingUrl: string;
  onShowToast: (msg: string) => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  bookingUrl,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    onShowToast('Storefront QR flyer downloaded!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${bookingUrl}`);
    onShowToast('Booking link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border-subtle">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
          </div>

          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Storefront QR Code
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-center leading-relaxed">
            Place on your salon mirror or front desk for effortless walk-in self-booking.
          </p>

          {/* Scalable Stylized QR Vector Representation */}
          <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-inner mt-4 border border-border-subtle/80 flex flex-col items-center">
            <svg
              className="w-44 h-44 text-on-surface"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              {/* Corner 1 */}
              <rect height="24" rx="3" width="24" x="10" y="10" />
              <rect fill="white" height="16" width="16" x="14" y="14" />
              <rect height="8" width="8" x="18" y="18" />

              {/* Corner 2 */}
              <rect height="24" rx="3" width="24" x="66" y="10" />
              <rect fill="white" height="16" width="16" x="70" y="14" />
              <rect height="8" width="8" x="74" y="18" />

              {/* Corner 3 */}
              <rect height="24" rx="3" width="24" x="10" y="66" />
              <rect fill="white" height="16" width="16" x="14" y="70" />
              <rect height="8" width="8" x="18" y="74" />

              {/* Stylized QR data blocks */}
              <rect height="6" width="6" x="42" y="12" />
              <rect height="14" width="6" x="52" y="12" />
              <rect height="10" width="6" x="42" y="24" />
              <rect height="6" width="10" x="12" y="42" />
              <rect height="16" width="6" x="28" y="42" />
              <rect className="text-primary" fill="#4648d4" height="20" rx="4" width="20" x="40" y="40" />
              <rect height="6" width="12" x="66" y="42" />
              <rect height="12" width="8" x="82" y="42" />
              <rect height="14" width="8" x="66" y="56" />
              <rect height="6" width="10" x="80" y="62" />
              <rect height="12" width="6" x="42" y="68" />
              <rect height="8" width="6" x="54" y="66" />
              <rect height="6" width="12" x="52" y="80" />
              <rect height="12" width="12" x="68" y="78" />
            </svg>
            <button
              onClick={handleCopy}
              className="mt-2.5 font-caption text-caption text-primary hover:underline font-mono flex items-center gap-1"
            >
              <span>{bookingUrl}</span>
              <span className="material-symbols-outlined text-[13px]">content_copy</span>
            </button>
          </div>

          <div className="flex gap-2.5 w-full mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
            >
              Done
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:opacity-95 shadow-sm transition-opacity flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
