import React, { useState } from "react";
import { TributeNotice, CondolenceMessage } from "../types";
import { A2ZAffiliateDirectory } from "./A2ZAffiliateDirectory";
import { generateAletheiaMarkdown, generateSocialPost, downloadMarkdownFile } from "../utils/markdownGenerator";
import {
  ArrowLeft,
  Flame,
  Calendar,
  MapPin,
  Heart,
  Share2,
  FileDown,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  PawPrint,
  Send,
} from "lucide-react";

interface MemorialDetailProps {
  notice: TributeNotice;
  onBack: () => void;
  onAddCondolence: (noticeId: string, condolence: Omit<CondolenceMessage, "id" | "timestamp">) => void;
  onLightCandle: (noticeId: string) => void;
}

export const MemorialDetail: React.FC<MemorialDetailProps> = ({
  notice,
  onBack,
  onAddCondolence,
  onLightCandle,
}) => {
  const isPet = notice.type === "pet";
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);
  const [showMarkdownDrawer, setShowMarkdownDrawer] = useState(false);

  // Condolence form state
  const [authorName, setAuthorName] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [withCandle, setWithCandle] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const markdownText = generateAletheiaMarkdown(notice);
  const socialText = generateSocialPost(notice);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopySocial = () => {
    navigator.clipboard.writeText(socialText);
    setCopiedSocial(true);
    setTimeout(() => setCopiedSocial(false), 2000);
  };

  const handleCondolenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    onAddCondolence(notice.id, {
      author: authorName.trim(),
      relation: relation.trim() || undefined,
      message: message.trim(),
      hasCandle: withCandle,
    });

    setAuthorName("");
    setRelation("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Generate .ics calendar download for funeral service
  const handleAddToCalendar = () => {
    if (!notice.funeral_date) return;
    const cleanDate = notice.funeral_date.replace(/-/g, "");
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aletheia UK//Memorial Calendar//EN
BEGIN:VEVENT
SUMMARY:Funeral Service for ${notice.title}
DESCRIPTION:Service arrangements for ${notice.title}. Charity donations: ${notice.charity}
LOCATION:${notice.funeral_location || "Service Location"}
DTSTART:${cleanDate}T110000Z
DTEND:${cleanDate}T123000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `service-${notice.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notices</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMarkdownDrawer(!showMarkdownDrawer)}
            className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{showMarkdownDrawer ? "Hide Markdown" : "View Aletheia .md"}</span>
          </button>

          <button
            onClick={() => downloadMarkdownFile(notice)}
            className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Download static markdown for GitHub/Cloudflare Pages"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export .md</span>
          </button>

          <button
            onClick={handleCopySocial}
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {copiedSocial ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSocial ? "Copied Post!" : "Copy Facebook Notice"}</span>
          </button>
        </div>
      </div>

      {/* Expandable Markdown Blueprint Inspector Drawer */}
      {showMarkdownDrawer && (
        <div className="bg-stone-950 border border-amber-900/40 rounded-xl p-4 sm:p-6 mb-8 text-xs text-stone-300">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-800 mb-3">
            <div>
              <span className="font-semibold text-amber-300">Aletheia Static Markdown Representation</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Saved as a single portable file in your GitHub repo · Static HTML automatically rendered by Cloudflare Pages
              </p>
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 px-2.5 py-1 rounded text-[11px]"
            >
              {copiedMd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMd ? "Copied" : "Copy Markdown"}</span>
            </button>
          </div>
          <pre className="bg-stone-900/90 p-4 rounded-lg overflow-x-auto text-[11px] font-mono text-stone-300 border border-stone-800/80 leading-relaxed whitespace-pre-wrap">
            {markdownText}
          </pre>
        </div>
      )}

      {/* Main Memorial Header Card */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Memorial Photo & Candle Column */}
          <div className="md:col-span-5 relative bg-stone-950 flex flex-col items-center justify-center p-6 sm:p-8 border-b md:border-b-0 md:border-r border-stone-800">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-amber-900/40 shadow-xl mb-4 bg-stone-900">
              {notice.photo_url ? (
                <img
                  src={notice.photo_url}
                  alt={notice.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-600">
                  {isPet ? <PawPrint className="w-16 h-16" /> : <Flame className="w-16 h-16 text-amber-500/40" />}
                </div>
              )}
            </div>

            {/* Quick Interactive Candle Button */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => onLightCandle(notice.id)}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold px-4 py-2 rounded-full shadow-lg shadow-amber-950/40 transition-all active:scale-95 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform" />
                <span>Light a Memorial Candle</span>
              </button>
              <span className="text-xs text-stone-400 mt-2 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <strong className="text-stone-200">{notice.candles_lit}</strong> candles lit in gentle memory
              </span>
            </div>
          </div>

          {/* Deceased Info Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Verified Status */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-stone-950 text-amber-300 border border-amber-800/40">
                  {isPet ? "Pet Memorial · Rainbow Bridge" : "England & Wales Notice"}
                </span>

                {notice.truth_anchor_verified && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full"
                    title={notice.verification_status}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Truth Anchor Verified</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 mb-1 leading-tight">
                {notice.title}
              </h1>

              {notice.birthYear && notice.passingYear && (
                <p className="text-sm sm:text-base font-serif italic text-amber-300/90 mb-3">
                  {notice.birthYear} – {notice.passingYear} {notice.age ? `(Aged ${notice.age})` : ""}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {notice.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  Passed {notice.date_of_passing}
                </span>
              </div>

              {/* Biography / Obituary */}
              <div className="prose prose-invert max-w-none text-stone-300 text-sm leading-relaxed mb-6 font-sans">
                <p>{notice.bio}</p>
              </div>
            </div>

            {/* Verification Detail Box */}
            <div className="bg-stone-950/70 border border-stone-800/80 rounded-lg p-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-300 font-medium">Verification Reference: </span>
                  <span>{notice.verification_status}</span>
                  {notice.truth_anchor_url && (
                    <div className="mt-1">
                      <a
                        href={notice.truth_anchor_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>View Funeral Director Registry Notice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrangements & In Lieu of Flowers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Funeral Arrangements */}
        <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950 flex items-center justify-center border border-amber-800/60">
                <Calendar className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Service Arrangements
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300">
              <div>
                <span className="text-stone-500 block text-xs">Date & Time:</span>
                <span className="font-semibold text-stone-200">
                  {notice.funeral_date || "Date to be announced"} {notice.funeral_time ? `at ${notice.funeral_time}` : ""}
                </span>
              </div>

              <div>
                <span className="text-stone-500 block text-xs">Location / Chapel:</span>
                <span className="font-semibold text-stone-200">
                  {notice.funeral_location || "Private family service"}
                </span>
              </div>

              {notice.funeral_notes && (
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-xs text-stone-400">
                  <span className="text-amber-400 font-medium block mb-1">Family Notes:</span>
                  <p>{notice.funeral_notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-800 flex items-center gap-3">
            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Calendar</span>
            </button>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                notice.funeral_location || notice.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>Directions</span>
            </a>
          </div>
        </div>

        {/* Charity In Lieu of Flowers */}
        <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 flex items-center justify-center border border-rose-800/60">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Donations in Lieu of Flowers
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
              In loving memory of {notice.title}, the family requests that in place of floral arrangements, donations be directed to support this chosen cause:
            </p>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-500 uppercase tracking-wider block mb-1">
                Designated Charity
              </span>
              <p className="text-base font-serif font-bold text-amber-200">
                {notice.charity || "Charity of Choice"}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-800">
            {notice.charity_link ? (
              <a
                href={notice.charity_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-rose-700/80 hover:bg-rose-600 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <span>Make a Donation in Memory</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="text-xs text-stone-400 text-center">
                Donations can be given via the funeral director or directly to the charity.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Condolence Book & Messages Wall */}
      <section className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 sm:p-7 shadow-lg mb-8">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-800 mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-serif font-bold text-stone-100">
              Condolences & Memories ({notice.condolences.length})
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            Book of Remembrance
          </span>
        </div>

        {/* Leave a message form */}
        <form onSubmit={handleCondolenceSubmit} className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 mb-6">
          <h4 className="text-sm font-serif font-semibold text-stone-200 mb-3">
            Leave a Message for the Family
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. David Jenkins"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Relationship / Association</label>
              <input
                type="text"
                placeholder="e.g. Lifelong Friend, Colleague, Neighbour"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-[11px] text-stone-400 mb-1">Your Message or Memory *</label>
            <textarea
              required
              rows={3}
              placeholder="Share a cherished memory, tribute, or words of comfort for the family..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={withCandle}
                onChange={(e) => setWithCandle(e.target.checked)}
                className="rounded border-stone-700 bg-stone-900 text-amber-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Light a memorial candle with my message
              </span>
            </label>

            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Condolence</span>
            </button>
          </div>

          {submitted && (
            <p className="text-xs text-emerald-400 mt-2">
              ✓ Your message and memorial candle have been respectfully recorded.
            </p>
          )}
        </form>

        {/* Existing Condolences List */}
        <div className="space-y-3">
          {notice.condolences.length === 0 ? (
            <p className="text-xs text-stone-500 italic text-center py-6">
              Be the first to share a warm memory or message of sympathy.
            </p>
          ) : (
            notice.condolences.map((c) => (
              <div
                key={c.id}
                className="bg-stone-950/70 border border-stone-800/80 rounded-lg p-4 text-xs text-stone-300"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-100">{c.author}</span>
                    {c.relation && (
                      <span className="text-[11px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                        {c.relation}
                      </span>
                    )}
                  </div>
                  {c.hasCandle && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                      <span>Candle lit</span>
                    </span>
                  )}
                </div>
                <p className="text-stone-300 leading-relaxed font-sans mt-1">
                  "{c.message}"
                </p>
                <span className="text-[10px] text-stone-500 block mt-2">
                  {new Date(c.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* A2Z Local Affiliate Directory Integration for Postcode/Town */}
      <A2ZAffiliateDirectory
        postcode={notice.affiliate_trigger_postcode}
        town={notice.location}
        type={notice.type}
      />
    </article>
  );
};
