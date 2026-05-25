"use client";

import Image from "next/image";
import { CSSProperties, useRef } from "react";
import { FaFingerprint } from "react-icons/fa";
import { FiActivity, FiLock } from "react-icons/fi";

type ProfileHoloCardProps = {
  name: string;
  title: string;
  imageSrc: string;
  idCode: string;
  accessLabel?: string;
  patternIconUrl?: string;
  className?: string;
};

type CardStyle = CSSProperties & {
  "--card-pattern": string;
  "--card-pattern-size": string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const round = (value: number) => Math.round(value * 100) / 100;

const ProfileHoloCard = ({
  name,
  title,
  imageSrc,
  idCode,
  accessLabel = "Secure Access",
  patternIconUrl = "/earlybirdsPatternSparse.svg",
  className = "",
}: ProfileHoloCardProps) => {
  const shellRef = useRef<HTMLDivElement>(null);

  const setCardVariables = (clientX: number, clientY: number) => {
    const shell = shellRef.current;

    if (!shell) return;

    const rect = shell.getBoundingClientRect();
    const percentX = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const percentY = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
    const rotateX = round((50 - percentY) / 5.5);
    const rotateY = round((percentX - 50) / 4.8);
    const pointerDistance = clamp(
      Math.hypot(percentX - 50, percentY - 50) / 50,
      0,
      1,
    );

    shell.style.setProperty("--pointer-x", `${percentX}%`);
    shell.style.setProperty("--pointer-y", `${percentY}%`);
    shell.style.setProperty("--rotate-x", `${rotateX}deg`);
    shell.style.setProperty("--rotate-y", `${rotateY}deg`);
    shell.style.setProperty(
      "--glare-opacity",
      `${round(0.18 + pointerDistance * 0.36)}`,
    );
  };

  const resetCardVariables = () => {
    const shell = shellRef.current;

    if (!shell) return;

    shell.style.setProperty("--pointer-x", "50%");
    shell.style.setProperty("--pointer-y", "50%");
    shell.style.setProperty("--rotate-x", "0deg");
    shell.style.setProperty("--rotate-y", "0deg");
    shell.style.setProperty("--glare-opacity", "0.18");
  };

  const cardStyle: CardStyle = {
    "--card-pattern": `url("${patternIconUrl}")`,
    "--card-pattern-size": "600px",
  };

  return (
    <div
      ref={shellRef}
      className={`holo-profile-shell select-none ${className}`.trim()}
      style={cardStyle}
      onPointerMove={(event) => setCardVariables(event.clientX, event.clientY)}
      onPointerLeave={resetCardVariables}
      onPointerCancel={resetCardVariables}
      aria-label={`${name} profile trading card`}
    >
      <div className="holo-profile-card">
        <div className="holo-profile-card__photo">
          <Image
            src={imageSrc}
            alt={`${name} profile picture`}
            fill
            priority
            draggable={false}
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 380px"
            className="object-cover object-[58%_22%]"
          />
        </div>
        <div className="holo-profile-card__pattern" />
        <div className="holo-profile-card__grain" />
        <div className="holo-profile-card__shine" />

        <div className="relative z-[2] flex h-full flex-col px-5 py-5 text-white sm:px-6 sm:py-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
                <FiLock className="text-sm text-white/75" />
                <span>{accessLabel}</span>
              </div>
              <FiActivity className="mt-1 text-[1.4rem] text-white/80" />
            </div>
            <div className="h-px bg-white/15" />
          </div>

          <div className="flex flex-1 flex-col justify-end">
            <div className="mb-8 text-center">
              <h2 className="whitespace-nowrap text-[1.06rem] font-semibold uppercase leading-none tracking-[0.11em] text-white sm:text-[1.34rem]">
                {name}
              </h2>
              <p className="mt-3 text-[0.74rem] uppercase tracking-[0.34em] text-white/65 sm:text-[0.85rem]">
                {title}
              </p>
            </div>

            <div className="h-px bg-white/15" />

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.58rem] uppercase tracking-[0.32em] text-white/50">
                  ID Number
                </p>
                <p className="mt-2 font-mono text-[0.98rem] tracking-[0.16em] text-white/90 sm:text-[1.08rem]">
                  {idCode}
                </p>
              </div>
              <FaFingerprint className="text-[2.5rem] text-white/45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHoloCard;
