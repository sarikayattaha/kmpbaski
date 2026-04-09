"use client";

export default function WhatsAppButton() {
  const phone = "905541630031";
  const message = encodeURIComponent(
    "Merhaba, kmpbaski.com üzerinden ulaşıyorum, bir konu hakkında bilgi alabilir miyim?"
  );
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        .wa-badge {
          animation: wa-pulse 1.8s ease-in-out infinite;
        }
      `}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-6 w-6 shrink-0 fill-white"
          aria-hidden="true"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.65 4.826 1.785 6.854L2 30l7.338-1.763A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 25.5a11.45 11.45 0 0 1-5.835-1.597l-.418-.248-4.352 1.046 1.078-4.24-.272-.434A11.466 11.466 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5Zm6.29-8.558c-.345-.172-2.04-1.006-2.355-1.12-.316-.115-.547-.172-.777.172-.23.345-.892 1.12-1.093 1.35-.2.23-.402.258-.747.086-.345-.172-1.456-.537-2.774-1.712-1.025-.916-1.717-2.047-1.918-2.392-.2-.345-.021-.531.15-.703.155-.154.345-.402.517-.603.172-.2.23-.345.345-.574.115-.23.057-.431-.029-.603-.086-.172-.777-1.873-1.064-2.564-.28-.673-.564-.582-.777-.593l-.661-.011c-.23 0-.603.086-.919.431s-1.207 1.179-1.207 2.875 1.236 3.336 1.408 3.566c.172.23 2.433 3.714 5.896 5.209.823.355 1.466.567 1.968.726.826.263 1.578.226 2.172.137.663-.099 2.04-.834 2.327-1.638.287-.804.287-1.493.2-1.638-.086-.144-.316-.23-.661-.402Z" />
        </svg>

        {/* Label — hidden on small screens */}
        <span className="hidden text-sm font-semibold text-white sm:inline">
          Bize Yazın
        </span>

        {/* Notification badge */}
        <span
          className="wa-badge absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white"
          aria-label="1 bildirim"
        >
          1
        </span>
      </a>
    </>
  );
}
