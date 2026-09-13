import React from "react";
import { TributeNotice } from "../types";
import {
  Calendar,
  MapPin,
  Flame,
  Heart,
  ShieldCheck,
  PawPrint,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface NoticeCardProps {
  notice: TributeNotice;
  onSelect: (notice: TributeNotice) => void;
  onLightCandle: (e: React.MouseEvent, noticeId: string) => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  onSelect,
  onLightCandle,
}) => {
  const isPet = notice.type === "pet";

  const yearsDisplay =
    notice.birthYear && notice.passingYear
      ? `${notice.birthYear} – ${notice.passingYear}`
      : notice.date_of_passing
      ? `Passed ${notice.date_of_passing}`
      : "";

  return (
    <div
      onClick={() => onSelect(notice)}
      className="group bg-stone-900/95 hover:bg-stone-850 border border-stone-800 hover:border-amber-700/60 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-amber-950/20 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Header Media / Photo Banner */}
        <div className="relative h-44 sm:h-48 w-full bg-stone-950 overflow-hidden">
          {notice.photo_url ? (
            <img
              src={notice.photo_url}
              alt={notice.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 filter brightness-95 contrast-95"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-stone-900 to-stone-950 text-stone-600">
              {isPet ? (
                <PawPrint className="w-12 h-12 text-stone-700" />
              ) : (
                <Flame className="w-12 h-12 text-amber-500/40 animate-pulse" />
              )}
              <span className="text-xs font-serif mt-2 text-stone-400">In Loving Memory</span>
            </div>
          )}

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

          {/* Category & Verification Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border ${
                isPet
                  ? "bg-amber-950/90 text-amber-300 border-amber-700/60"
                  : "bg-stone-900/90 text-stone-200 border-stone-700/60"
              }`}
            >
              {isPet ? "Pet Memorial" : "Death Notice"}
            </span>

            {notice.truth_anchor_verified && (
              <span
                title={notice.verification_status}
                className="bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Bottom Banner inside Image: Postcode Affiliate trigger badge */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300">
            <span className="flex items-center gap-1 font-medium drop-shadow-md">
              <MapPin className="w-3 h-3 text-amber-400" />
              {notice.location}
            </span>
            <span className="text-[10px] text-amber-300/80 bg-stone-950/80 px-2 py-0.5 rounded border border-stone-800 font-mono">
              {notice.affiliate_trigger_postcode}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-1">
              {notice.title}
            </h3>
          </div>

          {yearsDisplay && (
            <p className="text-xs text-amber-400/90 font-medium mb-2.5 font-sans tracking-wide">
              {yearsDisplay} {notice.age ? `(Aged ${notice.age})` : ""}
            </p>
          )}

          <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed mb-4">
            {notice.bio}
          </p>

          {/* Funeral / Arrangement details */}
          {notice.funeral_date && (
            <div className="bg-stone-950/70 border border-stone-800/80 rounded-lg p-2.5 mb-3 text-xs text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-200 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Service: {notice.funeral_date} {notice.funeral_time ? `at ${notice.funeral_time}` : ""}</span>
              </div>
              {notice.funeral_location && (
                <p className="text-[11px] text-stone-400 truncate pl-5">
                  {notice.funeral_location}
                </p>
              )}
            </div>
          )}

          {/* Charity In Lieu of Flowers */}
          {notice.charity && (
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 truncate">
              <Heart className="w-3 h-3 text-rose-400 shrink-0 fill-rose-400/20" />
              <span className="text-stone-400">Donations:</span>
              <span className="text-stone-300 font-medium truncate">{notice.charity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Candle lighting & CTA */}
      <div className="px-4 py-3 bg-stone-950/80 border-t border-stone-800/80 flex items-center justify-between gap-2 text-xs">
        <button
          onClick={(e) => onLightCandle(e, notice.id)}
          className="inline-flex items-center gap-1.5 text-stone-300 hover:text-amber-300 bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded-md border border-stone-800 hover:border-amber-700/50 transition-colors cursor-pointer group/candle"
          title="Light a virtual memorial candle"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 group-hover/candle:animate-bounce" />
          <span className="font-medium text-[11px]">{notice.candles_lit} Candles</span>
        </button>

        <span className="text-stone-400 group-hover:text-amber-300 text-xs font-medium inline-flex items-center gap-1 transition-colors">
          <span>Read Tribute</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
