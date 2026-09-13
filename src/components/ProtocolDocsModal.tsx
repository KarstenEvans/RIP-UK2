import React, { useState } from "react";
import {
  X,
  BookOpen,
  ShieldCheck,
  Globe,
  Coins,
  Cpu,
  FileCode2,
  Share2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Download,
} from "lucide-react";

interface ProtocolDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolDocsModal: React.FC<ProtocolDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"strategy" | "tech" | "aletheia_spec" | "domains">("strategy");
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!isOpen) return null;

  const rawAletheiaMd = `# Aletheia Tribute & RIP App Specification
**File:** \`aletheia-tribute-app.md\`  
**Status:** Active Protocol Specification & Executable Prompt  
**Version:** 1.0.0  
**License:** Open Memorial Protocol (England, Wales, Scotland & UK)  
**Repository Pattern:** Git-backed Markdown (\`/notices/*.md\`) + Cloudflare Pages / Static Site Generator  
**Purpose:** Collect, verify, and generate portable, permanent Markdown death notices and pet memorials to be statically hosted via GitHub and Cloudflare Pages, completely free to grieving families, monetised ethically via the local A2Z affiliate directory.

---

## 1. System Architecture & The \`rip.ie\` UK Disruption

### 1.1 The Market Failure in the UK
In Ireland, \`rip.ie\` is a national cultural institution generating millions of monthly visits because viewing notices and attending services is a cornerstone of community life. In the UK, however:
- Legacy local newspaper monopolies and commercial portals (such as \`funeral-notices.co.uk\`) charge grieving families between **£80 and £350+** just to post a single announcement.
- Many notices are trapped behind paywalls, intrusive cookie walls, or cluttered with generic pop-up advertisements.
- Families without hundreds of pounds to spare are excluded from announcing funeral details to their wider community.

### 1.2 The Aletheia Alternative
1. **100% Free to Post Forever:** No family is ever charged to post, edit, or maintain a memorial for a person or pet.
2. **Zero Commercial Ads on Tributes:** No intrusive banner ads or pop-ups.
3. **Funded by the A2Z Local Affiliate Directory:** High-intent local traffic is connected directly to accredited local florists, discreet wake reception venues, accredited probate solicitors, and bereavement therapists via \`affiliate_trigger_postcode\`. Verified local providers pay standard referral commissions that comfortably cover hosting and maintenance costs.
4. **Git-Backed Static Markdown Storage:** Notices are saved as human-readable, portable \`.md\` files with strict YAML frontmatter. No proprietary SQL lock-in, zero risk of mass database leaks, and near-zero server infrastructure costs via Cloudflare Pages edge delivery.
5. **The Truth Anchor Protocol:** Solves the challenge that the UK General Register Office (GRO) does not provide a real-time public death feed. To prevent fake or malicious notices, human notices require a verifiable Truth Anchor (link to a funeral director notice, cemetery schedule, or registered order of service).

---

## 2. AI Agent Loader Instructions (Odysseus / LLM Prompt)

\`\`\`text
[ALETHEIA_TRIBUTE_INIT]
VERSION: 1.0.0
MODE: TRIBUTE AND MEMORIAL INTAKE
TARGET_JURISDICTION: ENGLAND, WALES, SCOTLAND (UK)
PERMITTED_TYPES: [person, pet]
FEE_STRUCTURE: 100% FREE (NO PAYMENTS, NO SUBSCRIPTIONS)

BEHAVIOURAL GUIDELINES:
1. EMPATHY FIRST: Greet the user with sincere, gentle compassion. Acknowledge their loss without excessive formality or artificial pity.
2. CLASSIFICATION: Inquire gently whether the memorial is for a loved person or a cherished companion animal (Pet / Rainbow Bridge).
3. EDITABLE LIST INTAKE PATTERN: Collect essential details one step at a time so the user is never overwhelmed:
   - Full Name (and pet breed/species if applicable)
   - Lifespan (Birth year, passing date/year, age)
   - Location (Town, County, and Postcode for local florist matching)
   - Funeral / Memorial Arrangements (Date, time, venue/chapel, family notes)
   - Charity for donations in lieu of flowers (Name & donation link)
   - Compassionate biography or cherished memories
4. TRUTH ANCHOR REQUIREMENT (Humans only):
   - Explain gently: "To protect your family and our community from unauthorized or fraudulent notices, please share a link to your funeral director's notice, cemetery service list, or booking confirmation."
   - If not immediately available, flag the notice as "Awaiting Anchor Verification" prior to public indexing.
5. DELIVERABLES GENERATION:
   - Compile the official Aletheia Markdown document (\`.md\`) formatted strictly with YAML frontmatter.
   - Draft a sensitive, ready-to-copy social media announcement for Facebook and WhatsApp.
   - Inject the A2Z Local Affiliate Directory block based on the provided UK postcode.
[END_ALETHEIA_TRIBUTE_INIT]
\`\`\`

---

## 3. Aletheia Markdown Schema & Frontmatter Specification

Each memorial is saved as a single static file under \`/notices/{slug}.md\` adhering to this schema:

\`\`\`yaml
---
title: "Margaret 'Maggie' Eleanor Davies"
type: "person" # Allowed: "person" | "pet"
date_of_passing: "2026-09-08"
birthYear: "1941"
passingYear: "2026"
age: "85"
location: "Cardiff, South Wales"
county: "South Glamorgan"
funeral_date: "2026-09-24"
funeral_time: "11:30 AM"
funeral_location: "Wenallt Chapel, Thornhill Crematorium, Cardiff CF14 9UA"
funeral_notes: "Following the service, family and friends are warmly invited to The Manor House, Thornhill for light refreshments."
charity: "Marie Curie Hospice Penarth"
charity_link: "https://www.mariecurie.org.uk"
verification_status: "Verified via James Summers & Son Funeral Directors (Ref #CF-8821)"
truth_anchor_url: "https://www.funeraldirectors.co.uk/notices/margaret-davies"
truth_anchor_verified: true
affiliate_trigger_postcode: "CF14 9UA"
photo_url: "/photos/margaret-davies.jpg"
candles_lit: 42
created_at: "2026-09-09T09:15:00Z"
---

# In Loving Memory of Margaret 'Maggie' Eleanor Davies
**1941 – 2026 (Aged 85)**

Margaret "Maggie" Davies passed away peacefully on 8th September 2026 surrounded by her family at the University Hospital of Wales. Beloved wife of the late Gwilym, devoted mother to Rhian and Gareth, and treasured "Nain" to her four grandchildren. A dedicated community nurse in Whitchurch for over thirty years, Maggie will be remembered for her boundless warmth, dry wit, and legendary Welsh cakes.

## Funeral Arrangements
- **Location:** Wenallt Chapel, Thornhill Crematorium, Cardiff CF14 9UA
- **Date & Time:** Thursday, 24th September 2026 at 11:30 AM
- **Reception:** The Manor House, Thornhill following the service

## Donations in Lieu of Flowers
In lieu of flowers, donations are gratefully received for **Marie Curie Hospice Penarth** in recognition of their compassionate palliative care: [Make a Donation Online](https://www.mariecurie.org.uk).

---

## Local Resources & Memorial Services (A2Z Directory)
<!-- The site generator automatically renders accredited local partners matching postcode CF14 9UA -->
- **Local Sympathy Florist:** Wildflower & Willow (High St & Delivery) · *Offer: 10% off with code ALETHEIA10*
- **Wake Reception Venue:** The Manor House & Garden Pavilion (Thornhill Rd)
- **Probate & Estate Administration:** Pemberton & Cross Solicitors (Cardiff Chambers)
- **Bereavement Support:** Cruse Bereavement Support (Free National Helpline: 0808 808 1677)
\`\`\`

---

## 4. Pet Memorial Markdown Schema (\`type: "pet"\`)

Pet notices follow the same portable structure under \`/notices/pets/{slug}.md\`:

\`\`\`yaml
---
title: "Barnaby"
type: "pet"
pet_breed: "Golden Retriever"
date_of_passing: "2026-09-02"
birthYear: "2014"
passingYear: "2026"
age: "12"
location: "Bath, Somerset"
county: "Somerset"
charity: "Dogs Trust UK (Bath Branch)"
charity_link: "https://www.dogstrust.org.uk"
verification_status: "Family registered pet memorial"
truth_anchor_verified: true
affiliate_trigger_postcode: "BA2 5RP"
photo_url: "/photos/barnaby.jpg"
candles_lit: 31
created_at: "2026-09-03T14:20:00Z"
---

# In Loving Memory of Barnaby
**2014 – 2026 · Rainbow Bridge**

Barnaby was our faithful golden shadow, avid tennis ball retriever, and constant gentle companion for twelve joyful years across the Bath hills. He brought boundless unconditional love and sunshine to everyone who met him. Run free across the green fields of the Rainbow Bridge, Barnaby.

## Donations
In memory of Barnaby, donations may be directed to **Dogs Trust UK** to help other rescue dogs find their forever homes.

---

## Local Pet Memorial Services (A2Z Directory)
<!-- Auto-rendered for postcode BA2 5RP -->
- **Pet Cremation & Keepsakes:** Meadow Green Pet Crematorium & Memorial Urns
- **Pet Bereavement Support:** Blue Cross Pet Bereavement Support (Freephone: 0800 096 6606)
- **Memorial Trees & Plaques:** Somerset Living Memorial Woods
\`\`\`

---

## 5. The Truth Anchor Anti-Fraud Protocol

### 5.1 The UK Death Notice Verification Challenge
Unlike some international registries, the **General Register Office (GRO) for England and Wales does not maintain an open real-time API or daily public death bulletin**. Commercial scrapers cannot passively monitor deaths. Furthermore, malicious trolls or pranksters occasionally post fabricated death notices of living people on unverified noticeboards.

### 5.2 The 3 Truth Anchor Verification Tiers
Aletheia enforces a 3-tier validation standard:

1. **Tier 1 — Funeral Director Service Verification (Gold Standard):**
   - User supplies a direct URL to the official service announcement on the accredited funeral director's portal (e.g. Dignity, Co-op Funeralcare, NAFD member portal).
   - Validated automatically or through agent lookup. Notice receives the verified emerald shield badge.
2. **Tier 2 — Arrangement Reference Number & Venue Schedule:**
   - User enters the funeral home branch and arrangement reference number (e.g. \`JS-8821\`).
   - Cross-referenced against published municipal crematorium or cemetery daily chapel schedules.
3. **Tier 3 — Self-Declared & Pet Tributes:**
   - Pets are automatically verified under self-declared status.
   - Human notices awaiting confirmation are watermarked with "Pending Verification" and excluded from search engine site maps until authenticated.

---

## 6. The A2Z Local Affiliate Directory Engine

### 6.1 Monetisation Without Exploitation
- Posting a death notice or pet tribute is **always 100% free**.
- Notice readers have natural, immediate local needs:
  1. **Sympathy Flowers & Wreaths** (Ordered for delivery to the funeral home or family)
  2. **Wake Catering & Private Gathering Venues**
  3. **Probate Solicitors & Letters of Administration**
  4. **Memorial Stonemasons & Headstone Inscriptions**
  5. **Bereavement Therapy & Counseling**
- The site generator maps the notice's \`affiliate_trigger_postcode\` to local A2Z partners.
- Verified local businesses pay an affiliate commission or directory placement subscription (e.g., 5–10% per floral tribute order; standard qualified lead fees for probate inquiries).
- This creates a self-sustaining local loop where revenue is generated from commerce rather than grief.

---

## 7. Cloudflare Pages & GitHub CI/CD Deployment Flow

1. **Intake:** The notice is created via the web application or Odysseus AI interview.
2. **Commit:** The \`.md\` file is committed to \`/notices/{year}/{slug}.md\`.
3. **Static Generation:** Cloudflare Pages rebuilds the static HTML pages in under 15 seconds.
4. **Permanent URL:** Available forever at \`https://uknotices.rip/memorial/{slug}\` with full OpenGraph social cards.
5. **Portability:** If the family ever wishes to migrate, they own the clean, human-readable Markdown file.

---

## 8. Domain & Branding Strategy

| Domain Target | Category | Purpose | Status / Estimated Cost |
| :--- | :--- | :--- | :--- |
| \`uknotices.rip\` | Primary People Hub | The authoritative UK alternative to \`rip.ie\` | Available (~$25/yr) |
| \`uk.rip\` | Short People URL | High-prestige short domain for link sharing | Premium / Secondary |
| \`tributes.uk\` | Alternative Brand | Gentle, warm brand for English & Welsh families | Registerable (<£10/yr) |
| \`rip.pet\` / \`pets.rip\` | Rainbow Bridge Hub | Dedicated domain for dog, cat, and pet memorials | Available (~$15/yr) |
| \`rainbowbridge.pet\` | Pet Brand | Warm memorial community for pet owners | Registerable |

---
*Specification maintained by the Aletheia Open Memorial Protocol Project.*`;

  const handleDownloadSpec = () => {
    const blob = new Blob([rawAletheiaMd], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "aletheia-tribute-app.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-950 px-5 sm:px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center border border-amber-700/60">
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-100">
                Aletheia Protocol & Architecture Blueprint
              </h2>
              <p className="text-[11px] text-stone-400">
                The UK Free-to-Post Death Notices & Local A2Z Affiliate Model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-950/60 px-5 sm:px-6 py-2.5 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("strategy")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "strategy"
                ? "bg-amber-600 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200 bg-stone-900"
            }`}
          >
            1. Strategy & rip.ie Model
          </button>
          <button
            onClick={() => setActiveTab("tech")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "tech"
                ? "bg-amber-600 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200 bg-stone-900"
            }`}
          >
            2. Tech: Markdown + Cloudflare
          </button>
          <button
            onClick={() => setActiveTab("aletheia_spec")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "aletheia_spec"
                ? "bg-amber-600 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200 bg-stone-900"
            }`}
          >
            3. Aletheia App Specification (.md)
          </button>
          <button
            onClick={() => setActiveTab("domains")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "domains"
                ? "bg-amber-600 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200 bg-stone-900"
            }`}
          >
            4. Domains & Next Steps
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-stone-200 text-xs sm:text-sm leading-relaxed space-y-6">
          {activeTab === "strategy" && (
            <div className="space-y-5">
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
                <h3 className="font-serif font-bold text-amber-200 text-base mb-1">
                  Why `rip.ie` is a Phenomenon & How We Undercut UK Competitors
                </h3>
                <p className="text-stone-300 text-xs leading-relaxed">
                  In Ireland, <code className="bg-stone-900 px-1.5 py-0.5 rounded text-amber-300">rip.ie</code> gets millions of page visits every month because attending funerals and expressing sympathy is deeply woven into community life. In the UK, paid competitors like <code className="bg-stone-900 px-1.5 py-0.5 rounded text-stone-300">funeral-notices.co.uk</code> or local regional newspapers charge families £80 to £300+ per obituary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <Coins className="w-4 h-4" />
                    <span>How rip.ie Actually Monetises</span>
                  </div>
                  <p className="text-stone-400 text-xs">
                    Their true revenue engine is <strong>local advertising and business directories</strong>. With massive daily visitor traffic, local florists, wake caterers, memorial stonemasons, and probate solicitors pay top rates to appear alongside notices.
                  </p>
                  <p className="text-stone-300 text-xs font-medium">
                    Aletheia makes posting 100% free for families forever, monetising purely through local A2Z affiliate referrals.
                  </p>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>The "Truth Anchor" Solution</span>
                  </div>
                  <p className="text-stone-400 text-xs">
                    The UK General Register Office (GRO) <strong>does not publish a public live feed of recent deaths</strong>. You cannot scrape the UK government for death notices.
                  </p>
                  <p className="text-stone-300 text-xs font-medium">
                    To prevent fake or troll submissions, Aletheia requires a <strong>Truth Anchor</strong> (link to a funeral director, news article, or official record) before public indexing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tech" && (
            <div className="space-y-5">
              <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-serif text-base">
                  <Cpu className="w-5 h-5" />
                  <span>The Tech Stack: Aletheia + Odysseus + Cloudflare Pages</span>
                </div>
                <p className="text-xs text-stone-300">
                  This architecture adheres strictly to the <strong>Markdown + Static Hosting philosophy</strong>. No expensive SQL databases to maintain or breach.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                    <span className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <strong className="text-stone-100 block text-xs">Static Hosting (Cloudflare Pages + GitHub):</strong>
                      <span className="text-stone-400 text-xs">Every tribute notice is stored as a single <code className="bg-stone-950 text-amber-300 px-1 py-0.5 rounded">.md</code> file in a GitHub repository. Cloudflare Pages automatically rebuilds the lightning-fast static HTML site upon commit.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                    <span className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <strong className="text-stone-100 block text-xs">Odysseus.dev Interoperability:</strong>
                      <span className="text-stone-400 text-xs">An AI agent communicates with the grieving family, gathers details gently, verifies the Truth Anchor, formats the standardized YAML frontmatter, and commits the markdown file directly to GitHub via API.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                    <span className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <strong className="text-stone-100 block text-xs">A2Z Directory Local Affiliate Injection:</strong>
                      <span className="text-stone-400 text-xs">When the page renders, it inspects <code className="bg-stone-950 text-amber-300 px-1 py-0.5 rounded">affiliate_trigger_postcode</code> and pulls local florists, wake caterers, and probate solicitors from the A2Z directory.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                    <span className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <div>
                      <strong className="text-stone-100 block text-xs">Facebook & Social Media Deliverables:</strong>
                      <span className="text-stone-400 text-xs">Provides the user with a ready-to-copy, dignified social announcement post and a downloadable tribute card image to share with friends and family.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "aletheia_spec" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-xs font-mono font-semibold text-stone-200 block">
                      aletheia-tribute-app.md
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Full Protocol Specification & AI Agent Loader Prompt
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSpec}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-3 py-1.5 rounded text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md File</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawAletheiaMd);
                      setCopiedRaw(true);
                      setTimeout(() => setCopiedRaw(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRaw ? "Copied" : "Copy Full Markdown"}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto whitespace-pre-wrap max-h-[440px] leading-relaxed select-all">
                  {rawAletheiaMd}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "domains" && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <h4 className="font-serif font-bold text-stone-100 text-base">
                  Recommended Domain Availability & Roadmap
                </h4>
                <p className="text-xs text-stone-400">
                  While <code className="text-amber-300">rip.co.uk</code> is parked, viable and affordable alternatives are ready to register:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                    <span className="text-xs font-semibold text-amber-300 block mb-1">
                      For People (England, Wales & UK):
                    </span>
                    <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                      <li><strong className="text-stone-100">uknotices.rip</strong> or <strong className="text-stone-100">uk.rip</strong> (~$25/yr)</li>
                      <li><strong className="text-stone-100">tributes.uk</strong> (Under £10/yr)</li>
                      <li><strong className="text-stone-100">farewell.uk</strong></li>
                      <li><strong className="text-stone-100">uk-rip.co.uk</strong></li>
                    </ul>
                  </div>

                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                    <span className="text-xs font-semibold text-amber-300 block mb-1">
                      For Pets (Rainbow Bridge):
                    </span>
                    <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                      <li><strong className="text-stone-100">rip.pet</strong> or <strong className="text-stone-100">pets.rip</strong> (~$15/yr)</li>
                      <li><strong className="text-stone-100">rainbowbridge.pet</strong></li>
                      <li><strong className="text-stone-100">ukpet.rip</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                <h4 className="font-serif font-bold text-stone-100 text-sm mb-2">
                  5-Step Deployment Roadmap
                </h4>
                <ol className="text-xs text-stone-300 space-y-1.5 list-decimal list-inside">
                  <li><strong>Register Domain:</strong> Pick `uknotices.rip` or `tributes.uk`.</li>
                  <li><strong>Repo Setup:</strong> Create `aletheia-tributes` on GitHub hooked into Cloudflare Pages.</li>
                  <li><strong>Odysseus Integration:</strong> Route incoming memorial requests via Odysseus AI agent.</li>
                  <li><strong>Publish Markdown:</strong> Commit `.md` notices directly; static HTML renders in seconds.</li>
                  <li><strong>A2Z Directory Links:</strong> Inject local florist, caterer, and probate affiliate triggers automatically.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-5 sm:px-6 py-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
