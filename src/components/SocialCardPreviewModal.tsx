import React, { useRef, useState } from "react";
import { TributeNotice } from "../types";
import { X, Download, Share2, Copy, Check, Flame, Heart, MapPin, Calendar, PawPrint } from "lucide-react";
import { generateSocialPost } from "../utils/markdownGenerator";

interface SocialCardPreviewModalProps {
  notice: TributeNotice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialCardPreviewModal: React.FC<SocialCardPreviewModalProps> = ({
  notice,
  isOpen,
  onClose,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !notice) return null;

  const isPet = notice.type === "pet";
  const socialPost = generateSocialPost(notice);

  const handleCopyPost = () => {
    navigator.clipboard.writeText(socialPost);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-300" />
            <h3 className="text-base font-serif font-bold text-stone-100">
              Social Media Deliverable & Tribute Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Card Visual Graphic */}
          <div>
            <span className="text-xs text-stone-400 block mb-2 font-medium">
              Tribute Card Image (Optimized for Facebook, Instagram & WhatsApp)
            </span>
            <div
              ref={cardRef}
              className="relative w-full aspect-[16/9] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-xl border border-stone-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Subtle background embellishment */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-300/80 text-[11px] font-serif tracking-widest uppercase">
                  {isPet ? (
                    <PawPrint className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>In Loving Memory</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  uknotices.rip
                </span>
              </div>

              <div className="relative z-10 flex items-center gap-5 sm:gap-6 my-auto">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-600/50 shrink-0 bg-stone-900 shadow-md">
                  {notice.photo_url ? (
                    <img
                      src={notice.photo_url}
                      alt={notice.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-700">
                      <Heart className="w-8 h-8 text-amber-500/30" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg sm:text-2xl font-serif font-bold text-stone-100 mb-0.5 leading-tight">
                    {notice.title}
                  </h4>
                  {notice.birthYear && notice.passingYear && (
                    <p className="text-xs sm:text-sm text-amber-300/90 font-serif italic mb-2">
                      {notice.birthYear} – {notice.passingYear}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    {notice.location}
                  </p>
                  {notice.funeral_date && (
                    <p className="text-[11px] text-stone-300 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      Service: {notice.funeral_date}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                <span className="truncate max-w-xs">
                  {notice.charity ? `Donations: ${notice.charity}` : "Forever in our hearts"}
                </span>
                <span className="text-amber-400/90 font-medium">Leave Condolences Online</span>
              </div>
            </div>
          </div>

          {/* Social Media Text Post */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-300 font-medium">
                Accompanying Announcement Post Text
              </span>
              <button
                onClick={handleCopyPost}
                className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? "Copied" : "Copy Text"}</span>
              </button>
            </div>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 font-sans leading-relaxed whitespace-pre-wrap">
              {socialPost}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-5 py-3 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Aletheia Social Kit v1.0
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPost}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {copiedText ? "Post Copied to Clipboard!" : "Copy Post to Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
