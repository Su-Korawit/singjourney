type MaeLaFishProps = {
  className?: string;
  title?: string;
};

/**
 * ปลาแม่ลา — ลายเซ็นประจำจังหวัดสิงห์บุรี (เทศกาลกินปลา) วาดเป็นเส้น SVG เอง
 * ใช้ currentColor จึงรับสีจาก text-* ของ Tailwind ได้ และไม่ติดลิขสิทธิ์ภาพ
 * decorative โดยปริยาย (aria-hidden) เว้นแต่จะส่ง title เข้ามา
 */
export function MaeLaFish({ className, title }: MaeLaFishProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      {/* ลำตัว */}
      <path d="M14 30 C30 12 70 12 86 30 C70 48 30 48 14 30 Z" />
      {/* หางปลา */}
      <path d="M86 30 L108 16 L102 30 L108 44 Z" />
      {/* ครีบบน + ครีบล่าง */}
      <path d="M46 16 C52 9 62 9 66 15" />
      <path d="M46 44 C52 51 62 51 66 45" />
      {/* เหงือก */}
      <path d="M30 21 C26 27 26 33 30 39" />
      {/* ตา */}
      <circle cx="26" cy="29" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * แถบปลาแม่ลาว่ายเรียงกัน ใช้เป็นเส้นคั่น (divider) ระหว่าง section
 */
export function MaeLaSchool({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-6 text-gold/45 ${className ?? ""}`}
    >
      <MaeLaFish className="h-5 w-auto" />
      <MaeLaFish className="h-7 w-auto text-clay/40" />
      <MaeLaFish className="h-5 w-auto" />
    </div>
  );
}
