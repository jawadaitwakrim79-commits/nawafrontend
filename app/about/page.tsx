import type { Metadata } from "next";
import Image from "next/image";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "حكاية نوا",
  description: "نوا للبيت طلعت من مجالس الرياض.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-5 py-20">
      <div className="band">
        <div className="copy flex flex-col justify-center gap-6">
          <h1 className="text-ink">{copy.about.title}</h1>
          {copy.about.paragraphs.map((para, i) => (
            <p key={i} className="text-muted text-base leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        <div className="media relative rounded-[20px] overflow-hidden bg-sand" style={{ minHeight: "400px" }}>
          <Image
            src="/images/about-room.webp"
            alt="غرفة نوا للبيت"
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 560px"
          />
        </div>
      </div>
    </div>
  );
}
