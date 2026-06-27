type TempleCard = {
  name: string;
  district: string;
  merit: string;
  imageUrl: string | null;
};

const templeCards: TempleCard[] = [
  {
    name: "วัดพระนอนจักรสีห์",
    district: "อำเภอเมืองสิงห์บุรี",
    merit: "ไหว้พระนอนองค์ใหญ่ ขอพรเรื่องความสงบใจ",
    imageUrl: null,
  },
  {
    name: "วัดพิกุลทอง",
    district: "อำเภอท่าช้าง",
    merit: "ทำบุญพระใหญ่ และเดินชมลานธรรมสีทอง",
    imageUrl: null,
  },
  {
    name: "วัดม่วงชุม",
    district: "อำเภออินทร์บุรี",
    merit: "แวะเติมแต้มบุญในเส้นทางริมเจ้าพระยา",
    imageUrl: null,
  },
];

export default function WattsUpPage() {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-gold/25 bg-rice p-5 shadow-[0_30px_90px_rgba(92,42,30,0.14)] sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="relative z-10 flex flex-col justify-center">
          <p className="font-head text-sm font-bold uppercase tracking-[0.32em] text-gold">
            Content Theme · ทำบุญไหว้วัด
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-clay-deep sm:text-6xl lg:text-7xl">
            Watt&apos;s Up!
            <span className="block text-gold">ธีมทอง</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-clay-deep/75">
            โครงหน้า Phase 4 สำหรับรวมวัด จุดทำบุญ และเรื่องเล่ามงคลของสิงห์บุรี
            วางบรรยากาศทอง-ครีมให้พร้อมต่อยอดเป็นคอนเทนต์เต็ม
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/map"
              className="rounded-full bg-gold px-5 py-3 font-head text-sm font-bold text-clay-deep shadow-[0_16px_36px_rgba(200,150,47,0.28)] transition hover:-translate-y-0.5 hover:bg-gold/90"
            >
              ไปเช็คอินบน Roadmap
            </a>
            <a
              href="/plan"
              className="rounded-full border border-clay/20 bg-paper/60 px-5 py-3 font-head text-sm font-bold text-clay-deep transition hover:-translate-y-0.5 hover:border-gold hover:bg-rice"
            >
              วางแผนสายบุญ
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-gold/25 bg-[radial-gradient(circle_at_24%_18%,rgba(200,150,47,0.36),transparent_28%),linear-gradient(135deg,rgba(251,247,239,0.92),rgba(244,236,224,0.7))] p-5">
          <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gold/25 blur-3xl" />
          <div className="absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-clay/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-6 rounded-[1.35rem] border border-rice/80 bg-rice/55 p-5 backdrop-blur">
            <p className="font-head text-sm font-bold text-gold">
              Golden Route Preview
            </p>
            <div className="space-y-4">
              {["ไหว้พระ", "สะสมไอเทม 3D", "ใช้คูปอง"].map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-full border border-gold/20 bg-paper/70 p-2 pr-4"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold font-head text-sm font-bold text-clay-deep">
                    {index + 1}
                  </span>
                  <span className="font-head font-bold text-clay-deep">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-clay-deep/70">
              ภาพถ่ายจริงจะสลับเข้าจาก Swap-Point ในรอบต่อไป ระหว่างนี้ fallback
              ยังรักษาสัดส่วนการ์ดให้คงที่
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        {templeCards.map((temple) => (
          <article
            key={temple.name}
            className="group overflow-hidden rounded-card border border-gold/20 bg-rice shadow-[0_18px_48px_rgba(92,42,30,0.10)] transition hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_24px_64px_rgba(92,42,30,0.16)]"
          >
            <div
              className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(200,150,47,0.42),transparent_30%),linear-gradient(135deg,rgba(251,247,239,0.95),rgba(200,150,47,0.2))] bg-cover bg-center"
              style={
                temple.imageUrl
                  ? { backgroundImage: `url(${temple.imageUrl})` }
                  : undefined
              }
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(92,42,30,0.04)_25%,transparent_25%,transparent_50%,rgba(92,42,30,0.04)_50%,rgba(92,42,30,0.04)_75%,transparent_75%,transparent)] bg-[length:24px_24px]" />
              <div className="relative rounded-full border border-gold/30 bg-rice/80 px-4 py-2 text-center backdrop-blur">
                <p className="font-head text-xs font-bold uppercase tracking-[0.24em] text-gold">
                  Swap-Point
                </p>
                <p className="mt-1 max-w-44 font-head font-bold text-clay-deep">
                  {temple.name}
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="font-head text-sm font-bold text-gold">
                {temple.district}
              </p>
              <h2 className="mt-2 font-display text-3xl text-clay-deep">
                {temple.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-clay-deep/75">
                {temple.merit}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
