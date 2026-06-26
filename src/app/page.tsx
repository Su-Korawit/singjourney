export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Sing Journey</h1>
      <p className="text-lg text-gray-600">ผู้ช่วยวางแผนเที่ยวสิงห์บุรีด้วย AI</p>
      <div className="mt-4 flex gap-4">
        <a href="/plan" className="rounded bg-orange-600 px-4 py-2 text-white">
          เริ่มวางแผน
        </a>
        <a href="/map" className="rounded border px-4 py-2">
          ดู Roadmap
        </a>
      </div>
    </main>
  );
}
