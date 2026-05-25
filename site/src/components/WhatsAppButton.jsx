export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/351932992377?text=Ol%C3%A1!%20Usei%20o%20bot%C3%A3o%20r%C3%A1pido%20e%20gostaria%20de%20atendimento%20imediato%20sobre%20as%20viaturas."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar via WhatsApp"
      className="
        fixed bottom-7 right-7 z-50
        w-16 h-16 rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        focus:outline-none
      "
      style={{
        boxShadow: '0 0 0 0 rgba(37,211,102,0.4), 0 4px 20px rgba(37,211,102,0.35)',
        animation: 'whatsapp-pulse 2.5s infinite',
      }}
    >
      <style>{`
        @keyframes whatsapp-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.45), 0 4px 20px rgba(37,211,102,0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0),  0 4px 20px rgba(37,211,102,0.35); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0),     0 4px 20px rgba(37,211,102,0.35); }
        }
      `}</style>
      <img
        src="/assets/whatsapp-icon.png"
        alt="WhatsApp"
        className="w-16 h-16 object-contain rounded-full"
      />
    </a>
  )
}
