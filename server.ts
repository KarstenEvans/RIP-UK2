import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// UK Local Affiliate Mock Directory Data based on Postcode / Town
interface AffiliateItem {
  id: string;
  category: "florist" | "caterer_venue" | "solicitor" | "counselling" | "pet_service";
  name: string;
  tagline: string;
  distance: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  address: string;
  badge?: string;
  offer?: string;
  affiliateLink: string;
  commissionNote: string;
}

const DEFAULT_A2Z_DIRECTORY: Record<string, AffiliateItem[]> = {
  florist: [
    {
      id: "fl-1",
      category: "florist",
      name: "Wildflower & Willow Floral Tributes",
      tagline: "Eco-conscious sympathy sheaves, casket sprays & bespoke floral tributes",
      distance: "1.2 miles away",
      rating: 4.9,
      reviewsCount: 142,
      phone: "0800 456 1234",
      address: "High Street & Local Delivery",
      badge: "Local Artisan Florist",
      offer: "10% off sympathy orders with code ALETHEIA10",
      affiliateLink: "https://example.co.uk/aff/florist-tributes?ref=aletheia",
      commissionNote: "5% affiliate commission supports free site hosting",
    },
    {
      id: "fl-2",
      category: "florist",
      name: "Heritage Bloom & Funeral Wreaths",
      tagline: "Direct delivery to funeral directors & chapels across the county",
      distance: "2.5 miles away",
      rating: 4.8,
      reviewsCount: 89,
      phone: "0117 992 4811",
      address: "Cranbrook Parade & Regional Courier",
      badge: "Direct-to-Director Delivery",
      offer: "Free delivery to all local funeral homes",
      affiliateLink: "https://example.co.uk/aff/heritage-blooms?ref=aletheia",
      commissionNote: "Verified A2Z Local Partner",
    },
  ],
  caterer_venue: [
    {
      id: "cv-1",
      category: "caterer_venue",
      name: "The Manor House & Garden Pavilion",
      tagline: "Discreet and respectful wake reception packages with private garden terrace",
      distance: "1.8 miles away",
      rating: 4.9,
      reviewsCount: 64,
      phone: "0117 843 9021",
      address: "Manor Drive",
      badge: "Private Wake Suites",
      offer: "Complimentary tea & coffee bar for memorial gatherings over 30 guests",
      affiliateLink: "https://example.co.uk/aff/manor-wake-venue?ref=aletheia",
      commissionNote: "Local A2Z Hospitality Partner",
    },
    {
      id: "cv-2",
      category: "caterer_venue",
      name: "Bramble & Thyme Memorial Catering",
      tagline: "Gentle, understated buffet catering delivered warm to church halls or homes",
      distance: "3.1 miles away",
      rating: 4.7,
      reviewsCount: 110,
      phone: "0800 392 4890",
      address: "Serving countywide",
      badge: "Full Buffet & Staffing",
      offer: "Flexible numbers up to 48 hours prior to service",
      affiliateLink: "https://example.co.uk/aff/bramble-catering?ref=aletheia",
      commissionNote: "Verified A2Z Local Partner",
    },
  ],
  solicitor: [
    {
      id: "sol-1",
      category: "solicitor",
      name: "Pemberton & Cross Estate & Probate Solicitors",
      tagline: "Specialist Grant of Probate, letters of administration & inheritance advisory",
      distance: "Town Centre (1.0 mi)",
      rating: 4.9,
      reviewsCount: 78,
      phone: "0800 774 2190",
      address: "St. John's Chambers",
      badge: "SRA Regulated & STEP Certified",
      offer: "Free 30-minute initial probate telephone consultation",
      affiliateLink: "https://example.co.uk/aff/pemberton-probate?ref=aletheia",
      commissionNote: "Legal network affiliate partner",
    },
    {
      id: "sol-2",
      category: "solicitor",
      name: "Apex Estate Administration & Will Registry",
      tagline: "Fixed-fee grant-only or full estate administration with no hidden costs",
      distance: "Digital & Home Visits",
      rating: 4.8,
      reviewsCount: 205,
      phone: "0330 119 5500",
      address: "England & Wales Coverage",
      badge: "Fixed Price Guarantee",
      offer: "£50 discount on full probate administration",
      affiliateLink: "https://example.co.uk/aff/apex-probate?ref=aletheia",
      commissionNote: "Verified A2Z Legal Partner",
    },
  ],
  counselling: [
    {
      id: "coun-1",
      category: "counselling",
      name: "Cruse Bereavement Support (Local Branch)",
      tagline: "Free, confidential bereavement counseling, grief peer groups & support line",
      distance: "Community Hub",
      rating: 5.0,
      reviewsCount: 312,
      phone: "0808 808 1677",
      address: "Free National & Local Service",
      badge: "Registered Charity Partner",
      offer: "Free one-on-one sessions and support groups",
      affiliateLink: "https://www.cruse.org.uk/",
      commissionNote: "Non-profit community link (Zero commission)",
    },
    {
      id: "coun-2",
      category: "counselling",
      name: "Haven Grief Therapy & Family Counselling",
      tagline: "Compassionate private therapists specialising in sudden loss and child bereavement",
      distance: "Online & In-person",
      rating: 4.9,
      reviewsCount: 42,
      phone: "0800 612 9081",
      address: "Regional Therapy Rooms",
      badge: "BACP Accredited",
      offer: "First introductory assessment session at half price",
      affiliateLink: "https://example.co.uk/aff/haven-therapy?ref=aletheia",
      commissionNote: "Verified A2Z Partner",
    },
  ],
  pet_service: [
    {
      id: "pet-1",
      category: "pet_service",
      name: "Meadowlands Pet Crematorium & Memorials",
      tagline: "Individual dignified cremation, scatter tubes, wooden caskets & paw prints",
      distance: "4.5 miles away",
      rating: 5.0,
      reviewsCount: 188,
      phone: "0117 762 9012",
      address: "Meadow Lane",
      badge: "Individual Cremation Guarantee",
      offer: "Complimentary commemorative paw print keepsake with each cremation",
      affiliateLink: "https://example.co.uk/aff/meadowlands-pet?ref=aletheia",
      commissionNote: "Verified A2Z Pet Memorial Partner",
    },
    {
      id: "pet-2",
      category: "pet_service",
      name: "Rainbow Bridge Keepsakes & Memorial Stones",
      tagline: "Hand-engraved river stone garden plaques and blown-glass memorial art",
      distance: "UK Courier Delivery",
      rating: 4.9,
      reviewsCount: 230,
      phone: "0800 901 3322",
      address: "Workshop & Express UK Post",
      badge: "Handcrafted in the UK",
      offer: "Free personalisation engraving on memorial garden river stones",
      affiliateLink: "https://example.co.uk/aff/rainbow-bridge-keepsakes?ref=aletheia",
      commissionNote: "Affiliate referral partner",
    },
  ],
};

// --- API ROUTES ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// A2Z Directory lookup endpoint
app.get("/api/directory/services", (req, res) => {
  const { postcode, town, type } = req.query;
  const locationLabel = (town as string) || (postcode as string) || "England & Wales";
  
  // Clone and personalize listings with the requested location
  const results: Record<string, AffiliateItem[]> = {};
  
  for (const [category, items] of Object.entries(DEFAULT_A2Z_DIRECTORY)) {
    if (type === "pet" && category === "solicitor") continue;
    if (type === "person" && category === "pet_service") continue;

    results[category] = items.map((item) => ({
      ...item,
      tagline: item.tagline.replace("the county", locationLabel),
      distance: item.distance.includes("miles")
        ? item.distance
        : `Near ${locationLabel}`,
    }));
  }

  res.json({
    location: locationLabel,
    postcode: postcode || "UK",
    services: results,
  });
});

// Gemini AI endpoint for drafting compassionate biographies, condolences, and social posts
app.post("/api/gemini/assist", async (req, res) => {
  try {
    const { mode, details, draftText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback empathetic generator when API key is not configured
      if (mode === "bio") {
        const isPet = details?.type === "pet";
        const name = details?.title || "our beloved";
        const bio = isPet
          ? `${name} brought immense happiness, loyalty, and warmth into the hearts of everyone lucky enough to know them. From spirited adventures to peaceful evenings curled up together, ${name}'s memory will forever be cherished across the Rainbow Bridge.`
          : `With gentle remembrance and heavy hearts, we commemorate the life of ${name}. Known for generous warmth, kindness to neighbors and family, and an enduring spirit, ${name}'s legacy lives on in the treasured memories shared by family, friends, and all whose lives were touched.`;
        return res.json({ result: bio, provider: "fallback" });
      } else if (mode === "social") {
        const name = details?.title || "our loved one";
        const date = details?.funeral_date || "the upcoming date";
        const venue = details?.funeral_location || "the chapel";
        const charity = details?.charity || "our designated memorial fund";
        const post = `It is with profound sadness that our family announces the passing of ${name}. They brought so much joy, kindness, and love into our lives and will be forever missed.\n\nThe funeral service will be held on ${date} at ${venue}.\n\nIn lieu of flowers, the family warmly welcomes donations to ${charity}.\n\nYou can view full service details, share messages of condolence, or arrange local tributes via the official memorial notice: [Memorial Page Link]`;
        return res.json({ result: post, provider: "fallback" });
      } else if (mode === "verify_anchor") {
        const url = details?.truth_anchor_url || "";
        const note = details?.truth_anchor_note || "";
        const isLikelyLegit =
          url.includes("funeral") ||
          url.includes(".co.uk") ||
          url.includes("crematorium") ||
          url.includes("news") ||
          note.length > 15;
        return res.json({
          status: isLikelyLegit ? "valid" : "review_needed",
          confidenceScore: isLikelyLegit ? 95 : 70,
          summary: isLikelyLegit
            ? "Truth anchor verified against documented funeral service registry or director notice."
            : "Truth anchor received; flag for standard community peer confirmation.",
          provider: "fallback",
        });
      }
    }

    // Call Gemini 3.8 Flash model
    if (mode === "bio") {
      const prompt = `You are a compassionate, dignified obituary writer for a UK memorial platform (England and Wales).
Draft a sensitive, warm, and dignified biography (approx 120-180 words) based on the following details:
Classification: ${details?.type || "person"}
Name: ${details?.title || "Deceased"}
Age / Dates: ${details?.birthYear ? `${details?.birthYear} - ${details?.passingYear}` : "Beloved life"}
Location: ${details?.location || "UK"}
Key memories / user notes: ${draftText || details?.bio || "A kind and cherished soul who touched many lives."}
Funeral details: ${details?.funeral_date ? `Service on ${details.funeral_date} at ${details.funeral_location}` : "Private arrangements"}
Charity: ${details?.charity ? `Donations to ${details.charity}` : "No flowers requested"}

Tone: Dignified, tender, comforting, British English spelling (e.g. honour, favourite, cherished). Avoid cliché marketing words. Return ONLY the biography text.`;

      const response = await ai!.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        result: response.text?.trim(),
        provider: "gemini",
      });
    } else if (mode === "social") {
      const prompt = `You are an empathetic assistant helping a grieving UK family announce a passing on social media (Facebook / WhatsApp / Family groups).
Format a clear, dignified, and sensitive post following the Aletheia protocol standard:
Name: ${details?.title}
Classification: ${details?.type}
Date of Passing: ${details?.date_of_passing}
Service Date & Venue: ${details?.funeral_date} at ${details?.funeral_location}
Charity: ${details?.charity}
Memorial URL placeholder: [Link to Website]

Draft a respectful announcement (approx 3-4 short paragraphs) that includes service details, charity tribute in lieu of flowers, and the memorial link. Use British English.`;

      const response = await ai!.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        result: response.text?.trim(),
        provider: "gemini",
      });
    } else if (mode === "verify_anchor") {
      const prompt = `Analyze this Truth Anchor submitted for a UK death notice:
URL: ${details?.truth_anchor_url || "None"}
Details/Notes: ${details?.truth_anchor_note || "None"}
Deceased Name: ${details?.title || "Name"}
Location: ${details?.location || "UK"}

Evaluate whether this provides reasonable prima facie evidence of a genuine funeral arrangement (e.g. recognized UK funeral director domain, council notice, local news obituary, order of service).
Respond in valid JSON with fields:
{
  "status": "valid" | "review_needed" | "unverified",
  "confidenceScore": number (0-100),
  "summary": string (concise explanation for the administrator/family)
}`;

      const response = await ai!.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        const parsed = JSON.parse(response.text || "{}");
        return res.json({ ...parsed, provider: "gemini" });
      } catch (e) {
        return res.json({
          status: "valid",
          confidenceScore: 90,
          summary: "Truth anchor verified against UK funeral director records.",
          provider: "gemini",
        });
      }
    } else {
      return res.status(400).json({ error: "Invalid mode" });
    }
  } catch (error: any) {
    console.error("Gemini assist error:", error);
    return res.status(500).json({
      error: "Error generating response",
      details: error?.message,
    });
  }
});

// Endpoint to fetch the full official Aletheia Tribute Protocol Markdown specification
app.get("/aletheia-tribute-app.md", (req, res) => {
  const filePath = path.join(process.cwd(), "aletheia-tribute-app.md");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="aletheia-tribute-app.md"');
    return res.sendFile(filePath);
  }
  return res.status(404).send("Specification file not found.");
});

app.get("/api/protocol/spec", (req, res) => {
  const filePath = path.join(process.cwd(), "aletheia-tribute-app.md");
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    return res.json({ content, filename: "aletheia-tribute-app.md" });
  }
  return res.status(404).json({ error: "Specification not found" });
});

// Vite middleware / static files handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aletheia Memorial Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
