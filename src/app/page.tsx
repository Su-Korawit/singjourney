"use client";

import { useRouter } from "next/navigation";
import { DistrictMap } from "@/components/home/DistrictMap";
import { PlaceImage } from "@/components/media/PlaceImage";

const featureCards = [
  {
    title: "Roadmap",
    eyebrow: "จัดเส้นทางให้อ่านง่าย",
    detail: "เลือกอำเภอแล้วต่อยอดเป็นเส้นทางเที่ยว พร้อมจุดแวะสำคัญของสิงห์บุรี",
    href: "/map",
  },
  {
    title: "AI วางแผน",
    eyebrow: "ให้ระบบช่วยคิดวันเที่ยว",
    detail: "ตอบคำถามสั้นๆ แล้วให้ AI ช่วยประกอบแผนที่เข้ากับเวลาและสไตล์ของคุณ",
    href: "/plan",
  },
  {
    title: "เก็บไอเทม",
    eyebrow: "เช็คอินแล้วมีรางวัล",
    detail: "เดินทางถึงสถานที่จริงเพื่อปลดล็อกของสะสม 3D และคูปองเดโมในเส้นทาง",
    href: "/watts-up",
  },
  {
    title: "อีเวนต์",
    eyebrow: "มางาน แล้วอยู่ต่อ",
    detail:
      "ปฏิทินงานเทศกาลทั้งปีของสิงห์บุรี กดวางแผนรอบงานแล้วต่อทริปวัด-ตลาด-ของกินใกล้งานได้ทันที",
    href: "/events",
  },
];

export default function Home() {
  const router = useRouter();

  function openDistrict(district: string) {
    router.push(`/map?district=${encodeURIComponent(district)}`);
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <p className="font-head text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            แผ่นดินวีรชนบางระจัน
          </p>
          <div className="space-y-4">
            <h1 className="font-display text-5xl leading-tight text-clay-deep sm:text-6xl lg:text-7xl">
              สิงห์บุรีไม่ใช่ทางผ่าน แต่คือปลายทางที่อยากให้คุณค้างคืน
            </h1>
            <p className="max-w-xl text-lg leading-8 text-clay-deep/75">
              จากสมรภูมิวีรชนบางระจัน สู่พระนอนองค์ใหญ่ ปลาแม่ลาริมเจ้าพระยา
              และงานบุญทั้งปี เราเชื่อมทุกจุดแข็งให้เป็นทริปเดียวที่ทำให้คุณอยากค้างคืน
              ไม่ใช่แค่ขับรถผ่าน
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/plan"
              className="rounded-full bg-clay px-5 py-3 font-head text-sm font-semibold text-rice shadow-lg shadow-clay/20 transition hover:-translate-y-0.5 hover:bg-clay-deep"
            >
              ให้ AI ช่วยวางแผน
            </a>
            <a
              href="/map"
              className="rounded-full border border-clay/25 px-5 py-3 font-head text-sm font-semibold text-clay-deep transition hover:-translate-y-0.5 hover:border-gold hover:bg-rice"
            >
              ดู Roadmap ทั้งหมด
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <DistrictMap onSelect={openDistrict} />
          <PlaceImage
            src="/images/hero-bangrachan.jpg"
            name="อนุสาวรีย์วีรชนค่ายบางระจัน"
            className="rounded-[2rem] border border-clay/15 shadow-2xl shadow-clay-deep/10"
            eyebrow="Bang Rachan"
          />
        </div>
      </section>

      <section
        aria-label="ฟีเจอร์หลัก"
        className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {featureCards.map((feature) => (
          <a
            key={feature.title}
            href={feature.href}
            className="group rounded-card border border-clay/10 bg-rice/80 p-5 shadow-sm shadow-clay-deep/5 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl hover:shadow-clay-deep/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <p className="font-head text-sm font-medium text-gold">
              {feature.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl text-clay-deep">
              {feature.title}
            </h2>
            <p className="mt-3 max-h-0 overflow-hidden text-sm leading-6 text-clay-deep/70 opacity-0 transition-all duration-300 group-hover:max-h-28 group-hover:opacity-100 group-focus-visible:max-h-28 group-focus-visible:opacity-100">
              {feature.detail}
            </p>
          </a>
        ))}
      </section>
    </main>
  );
}
