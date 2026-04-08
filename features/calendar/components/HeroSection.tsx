import Image from "next/image";

type HeroSectionProps = {
  monthLabel: string;
  year: number;
  imageUrl: string;
  themeName: string;
  ribbonFrom: string;
  ribbonTo: string;
};

export default function HeroSection({
  monthLabel,
  year,
  imageUrl,
  themeName,
  ribbonFrom,
  ribbonTo,
}: HeroSectionProps) {
  return (
    <header
      className="relative h-[clamp(9rem,28vw,13rem)] overflow-hidden"
      aria-label="Calendar hero image and month"
    >
      <Image
        src={imageUrl}
        alt="Mountain climber on a slope"
        fill
        sizes="100vw"
        className="h-full w-full object-cover"
        style={{ animation: "hero-kenburns 14s ease-in-out infinite alternate" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" aria-hidden="true" />

      <div
        className="absolute bottom-0 left-[-1px] h-[clamp(3.75rem,9vw,5.5rem)] w-[54%] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] [clip-path:polygon(0_100%,100%_100%,100%_26%)]"
        style={{ backgroundImage: `linear-gradient(135deg, ${ribbonFrom}, ${ribbonTo})` }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-[-1px] h-[clamp(3.75rem,9vw,5.5rem)] w-[54%] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] [clip-path:polygon(0_100%,0_26%,100%_100%)]"
        style={{ backgroundImage: `linear-gradient(135deg, ${ribbonFrom}, ${ribbonTo})` }}
        aria-hidden="true"
      />

      <div className="absolute bottom-[clamp(0.55rem,1.9vw,1rem)] right-[clamp(0.7rem,2.6vw,1.4rem)] rounded-xl bg-black/20 px-3 py-2 text-right uppercase text-white backdrop-blur-[2px] transition-all duration-300 hover:bg-black/30">
        <p className="m-0 text-[0.72rem] tracking-[0.09em] opacity-95 sm:text-[0.8rem]">{year}</p>
        <h1 className="m-0 mt-[0.05rem] text-[clamp(0.95rem,1.8vw,1.25rem)] font-semibold leading-none tracking-[0.1em]">
          {monthLabel}
        </h1>
      </div>

      <p className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-slate-700 backdrop-blur-sm">
        {themeName}
      </p>
    </header>
  );
}
