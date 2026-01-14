"use client";

import Image from "next/image";

interface HackathonSectionProps {
  id: string;
  title: string;
  profiles: {
    name: string;
    role: string;
    image: string;
    icon?: string;
  }[];
  resultImage: string;
  resultLabel: string;
  headline: string;
  body: string;
  demoImage?: string;
  demoVideo?: string;
}

export function HackathonSection({
  id,
  title,
  profiles,
  resultImage,
  resultLabel,
  headline,
  body,
  demoImage,
  demoVideo,
}: HackathonSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-8">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>

      {/* Equation: Profile + Profile = Result */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 py-6">
        {/* Profiles with plus sign */}
        <div className="flex items-center gap-4">
          {profiles.map((profile, index) => (
            <div key={profile.name} className="flex items-center gap-4">
              {index > 0 && (
                <span className="text-4xl font-light text-[var(--foreground)] self-center mb-[52px]">+</span>
              )}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-[100px] h-[100px] rounded-full border-4 border-[rgba(0,0,0,0.1)] overflow-hidden">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {profile.icon && (
                    <div className="absolute bottom-0 right-[-8px] w-10 h-12">
                      <Image
                        src={profile.icon}
                        alt=""
                        width={40}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xl text-[var(--foreground)]">{profile.name}</p>
                  <p className="text-sm text-[var(--foreground)]">{profile.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Equals sign */}
        <span className="text-4xl font-light text-[var(--foreground)] self-center mb-[52px]">=</span>

        {/* Result */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[250px] md:w-[346px] aspect-[346/196] border-[5px] border-[rgba(0,0,0,0.5)] overflow-hidden">
            <Image
              src={resultImage}
              alt={resultLabel}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xl text-[var(--foreground)]">{resultLabel}</p>
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-4 pt-8">
        <p className="text-[28px] leading-[1.4] tracking-[-0.28px] text-[var(--foreground)]">
          {headline}
        </p>
        <p className="text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)]">
          {body}
        </p>
      </div>

      {/* Demo video */}
      {demoVideo && (
        <div className="flex flex-col gap-2 mt-4">
          <div className="w-full aspect-[2704/1724] relative rounded-lg overflow-hidden">
            <video
              src={demoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-sm text-[var(--foreground)]/60 text-center">
            A rough prototype of Verifier from the Hack Day
          </p>
        </div>
      )}

      {/* Demo image (fallback) */}
      {demoImage && !demoVideo && (
        <div className="w-full aspect-[2704/1724] relative mt-4 rounded overflow-hidden">
          <Image
            src={demoImage}
            alt="Hackathon demo"
            fill
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
}
