import { PlaceImage } from "@/components/media/PlaceImage";
import { placeById } from "@/lib/data/places";
import { TEMPLES } from "@/lib/data/temples";
import { MyCollection } from "./MyCollection";

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
            รวมวัดมงคล เรื่องเล่าพระเกจิ
            และของสะสมจากการเช็คอินจริงทั่วสิงห์บุรี
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
              เช็กอินครบทุกวัดเพื่อปลดล็อกไอเทม 3D และรับคูปองร้านค้าชุมชน
              รอบเส้นทางสายมูสิงห์บุรี
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLES.map((temple) => {
          const place = placeById(temple.place_id);
          if (!place) return null;

          return (
            <article
              key={temple.place_id}
              className="group overflow-hidden rounded-card border border-gold/20 bg-rice shadow-[0_18px_48px_rgba(92,42,30,0.10)] transition hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_24px_64px_rgba(92,42,30,0.16)]"
            >
              <PlaceImage src={place.image_url} name={place.name} ratio="4/3" />
              <div className="p-5">
                <p className="font-head text-sm font-bold text-gold">
                  {place.district}
                </p>
                <h2 className="mt-1 font-display text-3xl text-clay-deep">
                  {place.name}
                </h2>
                <dl className="mt-3 space-y-2 text-sm leading-6 text-clay-deep/80">
                  <div>
                    <dt className="font-head font-bold text-clay">ประวัติ</dt>
                    <dd>{temple.history}</dd>
                  </div>
                  <div>
                    <dt className="font-head font-bold text-clay">
                      พระเกจิ/พระสำคัญ
                    </dt>
                    <dd>{temple.famous_monk}</dd>
                  </div>
                  <div>
                    <dt className="font-head font-bold text-clay">ทำบุญ/ขอพร</dt>
                    <dd>{temple.merit_info}</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </section>

      <MyCollection />
    </main>
  );
}
