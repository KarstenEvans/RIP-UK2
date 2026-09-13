import React, { useState, useMemo, useEffect } from "react";
import { TributeNotice, CondolenceMessage } from "./types";
import { SEED_NOTICES } from "./data/seedNotices";
import { Header } from "./components/Header";
import { NoticeCard } from "./components/NoticeCard";
import { MemorialDetail } from "./components/MemorialDetail";
import { AletheiaIntakeModal } from "./components/AletheiaIntakeModal";
import { ProtocolDocsModal } from "./components/ProtocolDocsModal";
import { SocialCardPreviewModal } from "./components/SocialCardPreviewModal";
import {
  Search,
  MapPin,
  Filter,
  PlusCircle,
  Flame,
  Heart,
  ShieldCheck,
  BookOpen,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  PawPrint,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  // Load notices from localStorage if available, or fall back to SEED_NOTICES
  const [notices, setNotices] = useState<TributeNotice[]>(() => {
    try {
      const saved = localStorage.getItem("aletheia_notices");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse stored notices", e);
    }
    return SEED_NOTICES;
  });

  // Navigation & filter states
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "person" | "pet">("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "candles" | "alphabetical">("recent");

  // Modals state
  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [socialNotice, setSocialNotice] = useState<TributeNotice | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aletheia_notices", JSON.stringify(notices));
    } catch (e) {
      console.error("Could not save to localStorage", e);
    }
  }, [notices]);

  // Selected notice object
  const activeNotice = useMemo(() => {
    if (!selectedNoticeId) return null;
    return notices.find((n) => n.id === selectedNoticeId) || null;
  }, [selectedNoticeId, notices]);

  // Filtered & Sorted Notices
  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        // Category filter
        if (categoryFilter !== "all" && n.type !== categoryFilter) {
          return false;
        }

        // County / Region filter
        if (selectedCounty !== "all" && n.county !== selectedCounty) {
          return false;
        }

        // Search query (title, location, charity, notes)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = n.title.toLowerCase().includes(q);
          const matchLoc = n.location.toLowerCase().includes(q);
          const matchCharity = n.charity.toLowerCase().includes(q);
          const matchPostcode = n.affiliate_trigger_postcode.toLowerCase().includes(q);
          return matchTitle || matchLoc || matchCharity || matchPostcode;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "candles") {
          return b.candles_lit - a.candles_lit;
        }
        if (sortBy === "alphabetical") {
          return a.title.localeCompare(b.title);
        }
        // default recent
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [notices, categoryFilter, selectedCounty, searchQuery, sortBy]);

  // Counties list for dropdown
  const countiesList = useMemo(() => {
    const list = Array.from(new Set(notices.map((n) => n.county).filter(Boolean)));
    return list as string[];
  }, [notices]);

  // Light candle handler
  const handleLightCandle = (e: React.MouseEvent | null, noticeId: string) => {
    if (e) e.stopPropagation();
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, candles_lit: n.candles_lit + 1 } : n))
    );
  };

  // Add condolence handler
  const handleAddCondolence = (
    noticeId: string,
    condolenceData: Omit<CondolenceMessage, "id" | "timestamp">
  ) => {
    const newCondolence: CondolenceMessage = {
      id: `c-${Date.now()}`,
      author: condolenceData.author,
      relation: condolenceData.relation,
      message: condolenceData.message,
      hasCandle: condolenceData.hasCandle,
      timestamp: new Date().toISOString(),
    };

    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          return {
            ...n,
            candles_lit: condolenceData.hasCandle ? n.candles_lit + 1 : n.candles_lit,
            condolences: [newCondolence, ...n.condolences],
          };
        }
        return n;
      })
    );
  };

  // Publish new notice from intake modal
  const handlePublishNotice = (newNotice: TributeNotice) => {
    setNotices((prev) => [newNotice, ...prev]);
    setSelectedNoticeId(newNotice.id);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Top Header & Navigation */}
      <Header
        onOpenIntake={() => setIsIntakeOpen(true)}
        onOpenProtocolDocs={() => setIsDocsOpen(true)}
        onSelectCategory={(cat) => {
          setCategoryFilter(cat);
          setSelectedNoticeId(null);
        }}
        activeCategory={categoryFilter}
        totalNotices={notices.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeNotice ? (
          <MemorialDetail
            notice={activeNotice}
            onBack={() => setSelectedNoticeId(null)}
            onAddCondolence={handleAddCondolence}
            onLightCandle={(id) => handleLightCandle(null, id)}
          />
        ) : (
          <div>
            {/* Hero Search & Announcement Banner */}
            <section className="relative bg-gradient-to-b from-stone-900 via-stone-900/95 to-stone-950 border-b border-stone-800/80 px-4 py-8 sm:py-14 overflow-hidden">
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-stone-950/90 border border-stone-800 px-3.5 py-1 rounded-full text-xs text-amber-300 font-medium mb-4 shadow-inner">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free death notices & memorials for England, Wales & Scotland</span>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-100 tracking-tight mb-3">
                  Remembering with Dignity & Reverence
                </h2>
                <p className="text-xs sm:text-base text-stone-400 max-w-2xl mx-auto leading-relaxed mb-8">
                  Browse verified death notices, share heartfelt condolences, light virtual candles, and find accredited local florists and wake services.
                </p>

                {/* Primary Search Bar */}
                <div className="max-w-2xl mx-auto bg-stone-950/95 p-2 rounded-2xl border border-stone-800 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 w-full flex-1">
                    <Search className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by name, town (e.g. Cardiff, Bath), or postcode..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none w-full"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-stone-500 hover:text-stone-300 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto px-1 sm:px-0">
                    <button
                      onClick={() => setIsIntakeOpen(true)}
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post a Notice</span>
                    </button>
                  </div>
                </div>

                {/* Quick Filter Tags / Towns */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-stone-400">
                  <span className="text-stone-500">Popular regions:</span>
                  {["Cardiff", "Bath", "London", "York", "Bristol", "Cheltenham"].map((town) => (
                    <button
                      key={town}
                      onClick={() => setSearchQuery(town)}
                      className="hover:text-amber-300 bg-stone-950/80 hover:bg-stone-850 px-2.5 py-1 rounded-md border border-stone-800 transition-colors cursor-pointer text-[11px]"
                    >
                      {town}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Filter Bar & Sorting */}
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-800/80">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-serif font-bold text-stone-100">
                    {categoryFilter === "all"
                      ? "Recent Notices & Tributes"
                      : categoryFilter === "person"
                      ? "People Notices (England & Wales)"
                      : "Pet Memorials (Rainbow Bridge)"}
                  </h3>
                  <span className="text-xs text-amber-400 font-mono bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                    {filteredNotices.length} found
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs w-full sm:w-auto">
                  {/* Region selector */}
                  <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-300">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <select
                      value={selectedCounty}
                      onChange={(e) => setSelectedCounty(e.target.value)}
                      className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-stone-900 text-stone-200">
                        All Regions
                      </option>
                      {countiesList.map((c) => (
                        <option key={c} value={c} className="bg-stone-900 text-stone-200">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-300">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer"
                    >
                      <option value="recent" className="bg-stone-900 text-stone-200">
                        Most Recent
                      </option>
                      <option value="candles" className="bg-stone-900 text-stone-200">
                        Most Candles Lit
                      </option>
                      <option value="alphabetical" className="bg-stone-900 text-stone-200">
                        Alphabetical
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notices Cards Grid */}
              {filteredNotices.length === 0 ? (
                <div className="py-16 text-center text-stone-400 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-600">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-200">
                    No memorial notices found
                  </h4>
                  <p className="text-xs max-w-sm mx-auto">
                    We couldn't find any notices matching your criteria. Try adjusting your search query or location.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCounty("all");
                      setCategoryFilter("all");
                    }}
                    className="inline-block bg-stone-900 hover:bg-stone-800 text-xs px-3 py-1.5 rounded-lg border border-stone-800 text-stone-200 transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6">
                  {filteredNotices.map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onSelect={(n) => setSelectedNoticeId(n.id)}
                      onLightCandle={handleLightCandle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Sustainable Aletheia Model Callout Footer */}
      <footer className="bg-stone-950 border-t border-stone-800/80 text-xs text-stone-400 mt-12 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400" />
              <span className="text-stone-100 font-serif font-bold text-sm">
                Aletheia Memorial Protocol
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              A modern, open, and free-to-post alternative to traditional paid UK death notice portals. Designed to serve families across England, Wales, and Scotland without charging publishing fees.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setIsDocsOpen(true)}
                className="text-amber-400 hover:underline text-[11px] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Read rip.ie Research & Tech Blueprint</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-stone-200 font-semibold mb-2 font-serif">
              Why Notices are 100% Free
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Unlike legacy newspapers charging £80–£300 per notice, Aletheia is funded through the <strong>A2Z local directory</strong>. Verified florists, caterers, and probate solicitors pay referral commissions, keeping obituary notices completely free for families.
            </p>
          </div>

          <div>
            <h4 className="text-stone-200 font-semibold mb-2 font-serif">
              The Truth Anchor Protocol
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Because the UK General Register Office (GRO) does not provide a public feed of recent deaths, Aletheia protects communities from fraud by requiring a verified link to the funeral director or official service arrangement.
            </p>
          </div>

          <div>
            <h4 className="text-stone-200 font-semibold mb-2 font-serif">
              Aletheia Tech Stack
            </h4>
            <ul className="text-[11px] text-stone-400 space-y-1">
              <li>• Portable Markdown (.md) Storage</li>
              <li>• Cloudflare Pages Static Hosting</li>
              <li>• Odysseus.dev Agent Intake</li>
              <li>• Local A2Z Affiliate Directory</li>
              <li>• Social Media Announcement Kits</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>
            <span>© {new Date().getFullYear()} Aletheia Protocol · Free UK Death Notices & Pet Memorials</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Protocol Specs
            </button>
            <span>•</span>
            <button
              onClick={() => setIsIntakeOpen(true)}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Post Free Notice
            </button>
            <span>•</span>
            <span className="text-amber-400/80 font-mono">aletheia-tribute-app.md</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AletheiaIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onPublishNotice={handlePublishNotice}
      />

      <ProtocolDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <SocialCardPreviewModal
        notice={socialNotice}
        isOpen={Boolean(socialNotice)}
        onClose={() => setSocialNotice(null)}
      />
    </div>
  );
}
