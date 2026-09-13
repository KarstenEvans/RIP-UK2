import React from "react";
import { PlusCircle, FileText, Heart, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface HeaderProps {
  onOpenIntake: () => void;
  onOpenProtocolDocs: () => void;
  onSelectCategory: (cat: "all" | "person" | "pet") => void;
  activeCategory: "all" | "person" | "pet";
  totalNotices: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIntake,
  onOpenProtocolDocs,
  onSelectCategory,
  activeCategory,
  totalNotices,
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner Notice: Why Free & rip.ie context */}
      <div className="bg-stone-950/80 border-b border-stone-800/80 px-4 py-1.5 text-xs text-stone-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              The Aletheia Protocol
            </span>
            <span className="text-stone-400 hidden sm:inline">•</span>
            <span className="text-stone-300 hidden sm:inline">
              100% Free UK alternative to paid notices — zero cost to grieving families
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <button
              onClick={onOpenProtocolDocs}
              className="hover:text-amber-300 text-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              <span>How it works (rip.ie & Cloudflare Model)</span>
            </button>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-stone-400">
              Monetised via A2Z local florist & legal directory
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700/80 to-amber-500/40 flex items-center justify-center border border-amber-500/30 shadow-inner">
              <Heart className="w-5 h-5 text-amber-200 fill-amber-200/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-100">
                  Aletheia <span className="text-amber-300/90 font-light">Memorial</span>
                </h1>
                <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full">
                  England & Wales
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans mt-0.5">
                Modern, open & dignified UK death notices · Free forever
              </p>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenIntake}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Free</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="inline-flex bg-stone-950/80 p-1 rounded-lg border border-stone-800 text-xs font-medium">
            <button
              onClick={() => onSelectCategory("all")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-stone-800 text-stone-100 shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              All Notices ({totalNotices})
            </button>
            <button
              onClick={() => onSelectCategory("person")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeCategory === "person"
                  ? "bg-stone-800 text-stone-100 shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              People
            </button>
            <button
              onClick={() => onSelectCategory("pet")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeCategory === "pet"
                  ? "bg-amber-900/60 text-amber-200 border border-amber-700/40 shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Pets (Rainbow Bridge)
            </button>
          </div>

          <button
            onClick={onOpenProtocolDocs}
            title="Read Aletheia Protocol, Odysseus prompt and download aletheia-tribute-app.md"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-700/50 bg-stone-950/60 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Aletheia Protocol &amp; .md Spec</span>
          </button>

          <button
            onClick={onOpenIntake}
            className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-900/20 active:scale-98 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish a Free Notice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
