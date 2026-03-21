import Repository from "./_components/repository";

export default function Page() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#f5f7fb] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.1),_transparent_26%),radial-gradient(circle_at_85%_15%,_rgba(148,163,184,0.14),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(245,247,251,0.98))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Repository />
      </div>
    </div>
  );
}
