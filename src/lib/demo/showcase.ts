import { estimateCost } from "@/lib/cost/estimate";

export interface PlanStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  avg_price: number;
  description?: string;
}

export interface ShowcasePlan {
  id: string;
  title: string;
  summary: string;
  days: Array<{ stops: PlanStop[] }>;
  costRange: { low: number; high: number };
}

export interface MarketStatus {
  id: string;
  name: string;
  status: "open" | "closing" | "closed";
  description?: string;
}

export interface FestivalStatus {
  id: string;
  name: string;
  status: "open" | "closing" | "closed";
  description?: string;
}

// Real Singburi place data (sourced from places.ts coordinates)
const STOPS_FAMILY: PlanStop[] = [
  {
    id: "p1",
    name: "วัดพระนอนจักรสีห์วรวิหาร",
    lat: 14.9215,
    lng: 100.3548,
    avg_price: 0,
    description: "ไหว้พระนอนองค์ใหญ่ คู่บ้านคู่เมืองสิงห์บุรี",
  },
  {
    id: "p3",
    name: "อุทยานค่ายบางระจัน",
    lat: 14.9389,
    lng: 100.2589,
    avg_price: 0,
    description: "ชมอนุสาวรีย์วีรชน พิพิธภัณฑ์ประวัติศาสตร์",
  },
  {
    id: "p5",
    name: "อุทยานแม่ลามหาราชานุสรณ์",
    lat: 14.9020,
    lng: 100.2410,
    avg_price: 250,
    description: "ทานปลาแม่ลาสดริมน้ำ สัญลักษณ์ความอุดมสมบูรณ์",
  },
  {
    id: "p6",
    name: "ตลาดไทยย้อนยุคบ้านระจัน",
    lat: 14.9355,
    lng: 100.2620,
    avg_price: 120,
    description: "เดินตลาดย้อนยุค ชิมขนมไทย ซื้อของฝาก",
  },
];

const STOPS_HISTORY: PlanStop[] = [
  {
    id: "p3",
    name: "อุทยานค่ายบางระจัน",
    lat: 14.9389,
    lng: 100.2589,
    avg_price: 0,
    description: "สมรภูมิวีรชน พิพิธภัณฑ์และลานประวัติศาสตร์",
  },
  {
    id: "p4",
    name: "วัดโพธิ์เก้าต้น (วัดไม้แดง)",
    lat: 14.9461,
    lng: 100.2643,
    avg_price: 0,
    description: "ฐานที่มั่นชาวบ้านบางระจัน ต้นโพธิ์เก่าแก่",
  },
  {
    id: "p9",
    name: "พิพิธภัณฑสถานแห่งชาติ อินทร์บุรี",
    lat: 14.9905,
    lng: 100.3270,
    avg_price: 0,
    description: "โบราณวัตถุและเรื่องเล่าลุ่มเจ้าพระยา",
  },
];

const STOPS_FOODIE: PlanStop[] = [
  {
    id: "p5",
    name: "อุทยานแม่ลามหาราชานุสรณ์",
    lat: 14.9020,
    lng: 100.2410,
    avg_price: 250,
    description: "มื้อเช้า ปลาแม่ลาสด ต้มยำ ปิ้งย่าง",
  },
  {
    id: "p6",
    name: "ตลาดไทยย้อนยุคบ้านระจัน",
    lat: 14.9355,
    lng: 100.2620,
    avg_price: 120,
    description: "เที่ยง ชิมขนมไทย ข้าวหลามสด ของฝากชุมชน",
  },
  {
    id: "p2",
    name: "วัดสว่างอารมณ์ (หมู่บ้านช่างหล่อพระ)",
    lat: 14.8902,
    lng: 100.4015,
    avg_price: 0,
    description: "ชมช่างหล่อพระ เรียนรู้ภูมิปัญญาพื้นบ้าน",
  },
  {
    id: "p1",
    name: "วัดพระนอนจักรสีห์วรวิหาร",
    lat: 14.9215,
    lng: 100.3548,
    avg_price: 0,
    description: "ไหว้พระนอน รับพรเย็นก่อนกลับ",
  },
  {
    id: "p8",
    name: "หมู่บ้านไทยพวนบ้านแป้ง",
    lat: 14.7980,
    lng: 100.4630,
    avg_price: 0,
    description: "วันที่สอง วิถีชุมชนไทยพวน ผ้าทอมือ อาหารพวน",
  },
  {
    id: "p7",
    name: "วัดอัมพวัน",
    lat: 14.8190,
    lng: 100.4520,
    avg_price: 0,
    description: "วันที่สอง นั่งสมาธิ เดินจงกรม ก่อนกลับบ้าน",
  },
];

function makePlan(
  id: string,
  title: string,
  summary: string,
  days: Array<{ stops: PlanStop[] }>,
): ShowcasePlan {
  const allStops = days.flatMap((d) => d.stops);
  const costRange = estimateCost(allStops, 2, { days: days.length });
  return { id, title, summary, days, costRange };
}

const SHOWCASE_PLANS: ShowcasePlan[] = [
  makePlan(
    "plan-family",
    "ครอบครัวสายบุญ",
    "1 วัน ไหว้พระ ชมประวัติศาสตร์ ทานปลาแม่ลา เหมาะสำหรับครอบครัว 2-4 คน",
    [{ stops: STOPS_FAMILY }],
  ),
  makePlan(
    "plan-history",
    "สายประวัติศาสตร์ครึ่งวัน",
    "ครึ่งวัน ค่ายบางระจัน วัดโพธิ์เก้าต้น พิพิธภัณฑ์อินทร์บุรี เส้นทางวีรชน",
    [{ stops: STOPS_HISTORY }],
  ),
  makePlan(
    "plan-foodie",
    "สายกิน 2 วัน",
    "2 วัน 1 คืน ปลาแม่ลา ตลาดย้อนยุค หมู่บ้านไทยพวน วัดอัมพวัน ครบรส",
    [
      { stops: STOPS_FOODIE.slice(0, 4) },
      { stops: STOPS_FOODIE.slice(4) },
    ],
  ),
];

// Roadmap stops for map page (ordered route through Singburi)
const ROADMAP_STOPS: PlanStop[] = [
  {
    id: "p3",
    name: "อุทยานค่ายบางระจัน",
    lat: 14.9389,
    lng: 100.2589,
    avg_price: 0,
    description: "จุดเริ่มต้น หัวใจวีรชนสิงห์บุรี",
  },
  {
    id: "p4",
    name: "วัดโพธิ์เก้าต้น",
    lat: 14.9461,
    lng: 100.2643,
    avg_price: 0,
    description: "ฐานที่มั่นชาวบ้านบางระจัน",
  },
  {
    id: "p5",
    name: "อุทยานแม่ลามหาราชานุสรณ์",
    lat: 14.9020,
    lng: 100.2410,
    avg_price: 250,
    description: "ปลาแม่ลาริมน้ำ",
  },
  {
    id: "p6",
    name: "ตลาดไทยย้อนยุคบ้านระจัน",
    lat: 14.9355,
    lng: 100.2620,
    avg_price: 120,
    description: "ตลาดวัฒนธรรมย้อนยุค",
  },
  {
    id: "p1",
    name: "วัดพระนอนจักรสีห์วรวิหาร",
    lat: 14.9215,
    lng: 100.3548,
    avg_price: 0,
    description: "พระนอนองค์ใหญ่คู่เมือง",
  },
  {
    id: "p9",
    name: "พิพิธภัณฑสถานแห่งชาติ อินทร์บุรี",
    lat: 14.9905,
    lng: 100.3270,
    avg_price: 0,
    description: "โบราณวัตถุลุ่มเจ้าพระยา",
  },
  {
    id: "p10",
    name: "เมืองโบราณบ้านคูเมือง",
    lat: 15.0120,
    lng: 100.3480,
    avg_price: 0,
    description: "แหล่งโบราณคดีทวารวดี",
  },
];

const MARKET_STATUSES: MarketStatus[] = [
  {
    id: "market-wisetchaichan",
    name: "ตลาดวิเศษชัยชาญ",
    status: "open",
    description: "เปิดทุกวัน 06:00-12:00 น.",
  },
  {
    id: "market-banrachan",
    name: "ตลาดไทยย้อนยุคบ้านระจัน",
    status: "closing",
    description: "เปิดเสาร์-อาทิตย์เท่านั้น",
  },
  {
    id: "market-maela",
    name: "ตลาดปลาแม่ลา",
    status: "open",
    description: "เปิดทุกวัน ปลาสดจากแม่น้ำ",
  },
  {
    id: "market-singburi-city",
    name: "ตลาดสดเทศบาลเมืองสิงห์บุรี",
    status: "open",
    description: "เปิดทุกวัน 04:00-09:00 น.",
  },
  {
    id: "market-walking-street",
    name: "ถนนคนเดินสิงห์บุรี",
    status: "open",
    description: "เปิดศุกร์-อาทิตย์ 17:00-21:00 น.",
  },
];

const FESTIVAL_STATUSES: FestivalStatus[] = [
  {
    id: "e1",
    name: "งานรำลึกวีรชนค่ายบางระจัน",
    status: "closing",
    description: "ราวต้นกุมภาพันธ์ทุกปี",
  },
  {
    id: "e2",
    name: "เทศกาลกินปลาแม่ลา",
    status: "open",
    description: "ปลายธันวาคมถึงต้นมกราคม",
  },
  {
    id: "e3",
    name: "ประเพณีกำฟ้า ไทยพวน",
    status: "closing",
    description: "ขึ้น 3 ค่ำ เดือน 3 ราวกุมภาพันธ์",
  },
  {
    id: "e4",
    name: "งานนมัสการปิดทองหลวงพ่อแพ",
    status: "closed",
    description: "กลางมกราคมทุกปี",
  },
  {
    id: "e5",
    name: "สงกรานต์ริมเจ้าพระยา",
    status: "closed",
    description: "13-15 เมษายนทุกปี",
  },
  {
    id: "e6",
    name: "ตักบาตรเทโวโรหณะ อินทร์บุรี",
    status: "closed",
    description: "วันออกพรรษา ราวตุลาคม",
  },
];

// Maps ROADMAP_STOPS place_id to a live status derived from market/festival data
const PLACE_STATUS_MAP: Record<string, "open" | "closing" | "closed"> = {
  p5: MARKET_STATUSES.find((m) => m.id === "market-maela")?.status ?? "open",
  p6: MARKET_STATUSES.find((m) => m.id === "market-banrachan")?.status ?? "closing",
  p3: FESTIVAL_STATUSES.find((f) => f.id === "e1")?.status ?? "closing",
};

export function getShowcasePlans(): ShowcasePlan[] {
  return SHOWCASE_PLANS;
}

export function getShowcaseRoadmap(): PlanStop[] {
  return ROADMAP_STOPS;
}

export function getMarketStatuses(): MarketStatus[] {
  return MARKET_STATUSES;
}

export function getFestivalStatuses(): FestivalStatus[] {
  return FESTIVAL_STATUSES;
}

/** Returns the live status for a roadmap stop, or null if unknown. */
export function getPlaceStatus(
  placeId: string,
): "open" | "closing" | "closed" | null {
  return PLACE_STATUS_MAP[placeId] ?? null;
}
