import React, { useState, useEffect } from "react";
import { AffiliateItem } from "../types";
import {
  Flower2,
  UtensilsCrossed,
  Scale,
  HeartHandshake,
  PawPrint,
  ExternalLink,
  Phone,
  Star,
  CheckCircle2,
  MapPin,
  Sparkles,
  Info,
  Search,
} from "lucide-react";

interface A2ZAffiliateDirectoryProps {
  postcode: string;
  town: string;
  type: "person" | "pet";
}

export const A2ZAffiliateDirectory: React.FC<A2ZAffiliateDirectoryProps> = ({
  postcode,
  town,
  type,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [customSearch, setCustomSearch] = useState<string>("");
  const [servicesData, setServicesData] = useState<Record<string, AffiliateItem[]>>({});

  const currentTown = customSearch.trim() || town || "Local Area";
  const currentPostcode = customSearch.trim() || postcode || "UK";

  useEffect(() => {
    fetchServices(currentPostcode, currentTown);
  }, [currentPostcode, currentTown, type]);

  const fetchServices = async (pc: string, tn: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/directory/services?postcode=${encodeURIComponent(
          pc
        )}&town=${encodeURIComponent(tn)}&type=${type}`
      );
      if (res.ok) {
        const data = await res.json();
        setServicesData(data.services || {});
      }
    } catch (err) {
      console.error("Directory lookup failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Flattened items for active category or all
  const categoriesConfig = [
    { id: "florist", label: `Florists near ${currentTown}`, icon: Flower2 },
    { id: "caterer_venue", label: `Catering & Wakes near ${currentTown}`, icon: UtensilsCrossed },
    ...(type === "person"
      ? [{ id: "solicitor", label: "Probate & Estate Assistance", icon: Scale }]
      : []),
    { id: "counselling", label: "Bereavement Support", icon: HeartHandshake },
    ...(type === "pet"
      ? [{ id: "pet_service", label: "Pet Memorials & Keepsakes", icon: PawPrint }]
      : []),
  ];

  const allItems: AffiliateItem[] = (Object.values(servicesData) as AffiliateItem[][]).flat();
  const displayedItems =
    activeCategory === "all"
      ? allItems
      : servicesData[activeCategory] || [];

  return (
    <section className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 sm:p-7 shadow-lg my-8">
      {/* Directory Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-950 text-amber-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-amber-800/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              A2Z Local Affiliate Directory
            </span>
            <span className="text-xs text-stone-400">
              Matched to Postcode <span className="font-mono text-amber-300">{postcode}</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
            Local Memorial & Support Resources near {currentTown}
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl">
            Because Aletheia notices are 100% free for families, our service is supported by verified local florists, caterers, and legal partners when you arrange services through this directory.
          </p>
        </div>

        {/* Postcode Switcher / Search bar */}
        <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-lg border border-stone-800">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Change Town / Postcode..."
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            className="bg-transparent text-xs text-stone-200 placeholder-stone-500 focus:outline-none w-36 sm:w-44"
          />
          {customSearch && (
            <button
              onClick={() => setCustomSearch("")}
              className="text-stone-400 hover:text-stone-200 text-xs px-1.5 py-0.5"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-3.5 no-scrollbar">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === "all"
              ? "bg-amber-600 text-stone-950 font-semibold"
              : "bg-stone-800/80 text-stone-300 hover:bg-stone-800"
          }`}
        >
          All Resources ({allItems.length})
        </button>
        {categoriesConfig.map((cat) => {
          const Icon = cat.icon;
          const count = servicesData[cat.id]?.length || 0;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-amber-600 text-stone-950 font-semibold"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className="opacity-75 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-12 text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span>Locating A2Z accredited partners near {currentTown}...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-stone-950/80 border border-stone-800/90 hover:border-amber-700/50 rounded-lg p-4 sm:p-5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 font-mono">
                        {item.category.replace("_", " ")}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] bg-stone-900 text-stone-300 px-2 py-0.5 rounded border border-stone-800 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                      <span className="text-stone-500 text-[10px]">({item.reviewsCount})</span>
                    </div>
                    <span className="text-[11px] text-stone-400 flex items-center justify-end gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      {item.distance}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed mb-3">
                  {item.tagline}
                </p>

                {item.offer && (
                  <div className="bg-amber-950/40 border border-amber-800/40 rounded-md px-3 py-1.5 mb-3 text-xs text-amber-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium text-[11px]">{item.offer}</span>
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`tel:${item.phone}`}
                  className="text-xs text-stone-300 hover:text-stone-100 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">{item.phone}</span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={item.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-3 py-1.5 rounded-md transition-all shadow-sm"
                  >
                    <span>Arrange / View Rates</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transparent Model Footnote */}
      <div className="mt-5 pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-stone-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
          <span>
            Aletheia Sustainable Business Model: Verified suppliers pay referral commissions, keeping obituary notices 100% free of charge for every family in England & Wales.
          </span>
        </div>
        <span className="text-stone-500 font-mono text-[10px]">A2Z Protocol v1.0</span>
      </div>
    </section>
  );
};
