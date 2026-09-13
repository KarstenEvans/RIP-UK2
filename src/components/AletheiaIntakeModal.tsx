import React, { useState } from "react";
import { NoticeType, IntakeFormData, TributeNotice } from "../types";
import { generateAletheiaMarkdown, generateSocialPost, downloadMarkdownFile } from "../utils/markdownGenerator";
import {
  X,
  Heart,
  PawPrint,
  User,
  ShieldCheck,
  Sparkles,
  Calendar,
  MapPin,
  FileText,
  Share2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Flame,
} from "lucide-react";

interface AletheiaIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishNotice: (notice: TributeNotice) => void;
}

const DEFAULT_PERSON_PHOTOS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
];

const DEFAULT_PET_PHOTOS = [
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80",
];

export const AletheiaIntakeModal: React.FC<AletheiaIntakeModalProps> = ({
  isOpen,
  onClose,
  onPublishNotice,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<IntakeFormData>({
    type: "person",
    title: "",
    birthYear: "",
    passingYear: new Date().getFullYear().toString(),
    age: "",
    date_of_passing: new Date().toISOString().split("T")[0],
    location: "",
    county: "",
    affiliate_trigger_postcode: "",
    funeral_date: "",
    funeral_time: "",
    funeral_location: "",
    funeral_notes: "",
    charity: "",
    charity_link: "",
    bio: "",
    pet_breed: "",
    truth_anchor_url: "",
    truth_anchor_note: "",
    photo_url: "",
  });

  // AI loading and verification states
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isVerifyingAnchor, setIsVerifyingAnchor] = useState(false);
  const [anchorCheckResult, setAnchorCheckResult] = useState<{
    status: string;
    summary: string;
    confidenceScore: number;
  } | null>(null);

  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);
  const [activeTabDeliverable, setActiveTabDeliverable] = useState<"markdown" | "social" | "preview">("markdown");

  if (!isOpen) return null;

  const isPet = formData.type === "pet";

  // Step 1: Handle classification
  const handleSelectType = (selectedType: NoticeType) => {
    setFormData((prev) => ({
      ...prev,
      type: selectedType,
      photo_url: selectedType === "pet" ? DEFAULT_PET_PHOTOS[0] : DEFAULT_PERSON_PHOTOS[0],
    }));
    setStep(2);
  };

  // AI Biography Generation using Gemini 3.8 Flash via /api/gemini/assist
  const handleGenerateBioWithAI = async () => {
    if (!formData.title.trim()) {
      alert("Please enter the name first so the AI can personalize the tribute.");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const res = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "bio",
          details: formData,
          draftText: formData.bio,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setFormData((prev) => ({ ...prev, bio: data.result }));
        }
      }
    } catch (err) {
      console.error("Failed to generate bio with AI", err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // AI Truth Anchor Verification Check
  const handleVerifyTruthAnchor = async () => {
    if (!formData.truth_anchor_url && !formData.truth_anchor_note) {
      alert("Please provide a funeral director link or note to verify.");
      return;
    }
    setIsVerifyingAnchor(true);
    try {
      const res = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "verify_anchor",
          details: formData,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnchorCheckResult(data);
      }
    } catch (err) {
      console.error("Verification check failed", err);
    } finally {
      setIsVerifyingAnchor(false);
    }
  };

  // File Upload handler (Data URL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Final Publish handler
  const handlePublish = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newNotice: TributeNotice = {
      id: `not-${Date.now()}`,
      slug: slug || `notice-${Date.now()}`,
      title: formData.title || (isPet ? "Beloved Pet" : "Beloved Family Member"),
      type: formData.type,
      birthYear: formData.birthYear,
      passingYear: formData.passingYear,
      age: formData.age || undefined,
      date_of_passing: formData.date_of_passing,
      location: formData.location || "England & Wales",
      county: formData.county || "United Kingdom",
      funeral_date: formData.funeral_date,
      funeral_time: formData.funeral_time,
      funeral_location: formData.funeral_location,
      funeral_notes: formData.funeral_notes,
      charity: formData.charity || "Family Memorial Fund",
      charity_link: formData.charity_link,
      bio: formData.bio || "In loving and lasting memory.",
      verification_status:
        formData.truth_anchor_url
          ? `Verified via ${formData.truth_anchor_url}`
          : formData.truth_anchor_note
          ? `Verified via ${formData.truth_anchor_note}`
          : isPet
          ? "Self-declared Family Pet Tribute"
          : "Family verified notice",
      truth_anchor_url: formData.truth_anchor_url,
      truth_anchor_note: formData.truth_anchor_note,
      truth_anchor_verified: Boolean(formData.truth_anchor_url || formData.truth_anchor_note || isPet),
      affiliate_trigger_postcode: formData.affiliate_trigger_postcode || "SW1A 1AA",
      photo_url: formData.photo_url || (isPet ? DEFAULT_PET_PHOTOS[0] : DEFAULT_PERSON_PHOTOS[0]),
      pet_breed: formData.pet_breed,
      candles_lit: 1,
      created_at: new Date().toISOString(),
      condolences: [],
    };

    onPublishNotice(newNotice);
    setStep(5); // Deliverables screen
  };

  const currentGeneratedMd = generateAletheiaMarkdown(formData);
  const currentSocialPost = generateSocialPost(formData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-stone-950 px-5 sm:px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center border border-amber-700/60">
              <Heart className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-100">
                Aletheia Memorial Intake & Generator
              </h2>
              <p className="text-[11px] text-stone-400">
                Step {step} of 5 · 100% Free · Verified & Portable Markdown
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

        {/* Modal Body / Multi-step Wizard */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-stone-200">
          {/* STEP 1: Classification */}
          {step === 1 && (
            <div className="space-y-6 py-4">
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 sm:p-5 text-center">
                <p className="font-serif italic text-base sm:text-lg text-amber-200 mb-2">
                  "I am very sorry for your loss. Are we creating a tribute for a loved one or a beloved pet?"
                </p>
                <p className="text-xs text-stone-400 max-w-lg mx-auto">
                  Aletheia is an open, compassionate UK platform. Notices are free to post forever and provide verified, dignified memorial pages with local florist & support resources.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectType("person")}
                  className="group bg-stone-950 hover:bg-stone-850 border-2 border-stone-800 hover:border-amber-600 rounded-xl p-6 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 flex items-center justify-center border border-amber-700/40 mb-4 group-hover:scale-105 transition-transform">
                      <User className="w-6 h-6 text-amber-300" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-amber-200 mb-1">
                      A Loved Person
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      For a family member, spouse, friend, or colleague. Includes funeral service details, charity donations in lieu of flowers, and truth anchor verification.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <span>Create Person Tribute</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectType("pet")}
                  className="group bg-stone-950 hover:bg-stone-850 border-2 border-stone-800 hover:border-amber-600 rounded-xl p-6 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 flex items-center justify-center border border-amber-700/40 mb-4 group-hover:scale-105 transition-transform">
                      <PawPrint className="w-6 h-6 text-amber-300" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-amber-200 mb-1">
                      A Beloved Pet
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      For a cherished dog, cat, or animal companion. Registered across the Rainbow Bridge with keepsakes, animal rescue donation links, and tributes.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <span>Create Pet Memorial</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Details Intake (Editable list pattern) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-stone-800 pb-3 mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-100">
                    Step 2: Details Intake ({isPet ? "Pet Details" : "Deceased Details"})
                  </h3>
                  <p className="text-xs text-stone-400">
                    Fill in what you know; you can adjust or skip non-essential fields at any time.
                  </p>
                </div>
                <span className="text-xs text-amber-300 font-mono bg-stone-950 px-2 py-1 rounded border border-stone-800">
                  {isPet ? "Pet" : "Person"} Mode
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-300 font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isPet ? "e.g. Barnaby (or Luna)" : "e.g. Margaret 'Maggie' Eleanor Davies"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {isPet ? (
                  <div>
                    <label className="block text-xs text-stone-300 font-medium mb-1">
                      Pet Breed / Species
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Golden Retriever, Silver Tabby"
                      value={formData.pet_breed}
                      onChange={(e) => setFormData({ ...formData, pet_breed: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-stone-300 font-medium mb-1">
                      Birth Year / Age
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Birth (e.g. 1941)"
                        value={formData.birthYear}
                        onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                        className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                      />
                      <input
                        type="text"
                        placeholder="Age (e.g. 84)"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-stone-300 font-medium mb-1">
                    Date of Passing *
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_passing}
                    onChange={(e) => setFormData({ ...formData, date_of_passing: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 font-medium mb-1">
                    Location (Town / City / County) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiff, Bath, or York"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 font-medium mb-1">
                    Affiliate Trigger Postcode * (Used to match local florists & caterers)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CF14 9UA, BA2, W8"
                    value={formData.affiliate_trigger_postcode}
                    onChange={(e) => setFormData({ ...formData, affiliate_trigger_postcode: e.target.value.toUpperCase() })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono placeholder-stone-600 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Funeral / Service Arrangements */}
                <div className="sm:col-span-2 bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-3">
                  <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Funeral & Service Arrangements
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Service Date</label>
                      <input
                        type="date"
                        value={formData.funeral_date}
                        onChange={(e) => setFormData({ ...formData, funeral_date: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Service Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 11:30 AM"
                        value={formData.funeral_time}
                        onChange={(e) => setFormData({ ...formData, funeral_time: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-400 mb-1">Venue / Chapel / Crematorium</label>
                      <input
                        type="text"
                        placeholder="e.g. Wenallt Chapel, Thornhill Crematorium, Cardiff"
                        value={formData.funeral_location}
                        onChange={(e) => setFormData({ ...formData, funeral_location: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Charity In Lieu of Flowers */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-300 font-medium mb-1">
                    Charity for Donations (In lieu of flowers)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marie Curie Hospice Penarth, British Heart Foundation, Dogs Trust"
                    value={formData.charity}
                    onChange={(e) => setFormData({ ...formData, charity: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Short Bio with AI Generator */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-stone-300 font-medium">
                      Biography / Compassionate Message
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBioWithAI}
                      disabled={isGeneratingBio}
                      className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-xs bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingBio ? "Drafting with Gemini..." : "Draft / Polish with Gemini AI"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Share key life stories, hobbies, family members, or compassionate memories..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Verification ("Truth Anchor" for humans) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-stone-800 pb-3 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-serif font-bold text-stone-100">
                    Step 3: The Truth Anchor Verification {isPet ? "(Optional for Pets)" : "(Anti-Fraud Protection)"}
                  </h3>
                </div>
                <p className="text-xs text-stone-400">
                  To protect grieving families and communities from malicious or false notices (a known industry challenge), Aletheia requires an authentic "Truth Anchor" before public indexing.
                </p>
              </div>

              <div className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-4">
                <div>
                  <label className="block text-xs text-stone-200 font-medium mb-1">
                    Funeral Director Website Link or Published Notice URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.funeraldirectors.co.uk/notices/..."
                    value={formData.truth_anchor_url}
                    onChange={(e) => setFormData({ ...formData, truth_anchor_url: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    e.g. Link to the funeral director's confirmed service schedule or council cemetery register.
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-stone-200 font-medium mb-1">
                    Verification Note / Arrangement Reference
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Handled by James Summers & Son Roath Court, ref #JS-8821. Order of service provided."
                    value={formData.truth_anchor_note}
                    onChange={(e) => setFormData({ ...formData, truth_anchor_note: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-850">
                  <span className="text-[11px] text-stone-400 italic">
                    Your private records are never published publicly.
                  </span>
                  <button
                    type="button"
                    onClick={handleVerifyTruthAnchor}
                    disabled={isVerifyingAnchor}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3 py-1.5 rounded-lg border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isVerifyingAnchor ? "Validating Anchor..." : "Check Truth Anchor"}</span>
                  </button>
                </div>

                {anchorCheckResult && (
                  <div className={`p-3 rounded-lg border text-xs ${
                    anchorCheckResult.status === "valid"
                      ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                      : "bg-amber-950/40 border-amber-800/60 text-amber-300"
                  }`}>
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validation Status: {anchorCheckResult.status.toUpperCase()} (Confidence: {anchorCheckResult.confidenceScore}%)</span>
                    </div>
                    <p className="text-[11px]">{anchorCheckResult.summary}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Photo / Memorial Image */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-stone-800 pb-3 mb-2">
                <h3 className="text-base font-serif font-bold text-stone-100">
                  Step 4: Memorial Photograph
                </h3>
                <p className="text-xs text-stone-400">
                  Upload a photo of your loved one or pet, or select a dignified portrait.
                </p>
              </div>

              {/* Upload input */}
              <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 text-center">
                <label className="cursor-pointer inline-flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-800 hover:border-amber-600 rounded-xl w-full transition-colors">
                  <Upload className="w-8 h-8 text-stone-400 mb-2" />
                  <span className="text-xs font-semibold text-stone-200">
                    Click to upload a photograph from your device
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Supports JPG, PNG, WebP (processed locally)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset Selection Options */}
              <div>
                <span className="text-xs text-stone-400 block mb-2 font-medium">
                  Or select from standard dignified tribute presets:
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {(isPet ? DEFAULT_PET_PHOTOS : DEFAULT_PERSON_PHOTOS).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, photo_url: imgUrl })}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        formData.photo_url === imgUrl
                          ? "border-amber-500 scale-102 shadow-lg"
                          : "border-stone-800 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="Memorial preset"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Active preview */}
              {formData.photo_url && (
                <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <img
                    src={formData.photo_url}
                    alt="Selected"
                    className="w-12 h-12 rounded-full object-cover border border-amber-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">
                      Photograph Selected
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Will be included on the memorial notice and social card.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Final Deliverables (Markdown & Social Post) */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 text-emerald-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold block text-sm">
                      Tribute Notice Successfully Created!
                    </span>
                    <span>
                      Notice is live in the directory and ready to be committed to your Cloudflare/GitHub repository.
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab selector for Deliverables */}
              <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                <button
                  onClick={() => setActiveTabDeliverable("markdown")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTabDeliverable === "markdown"
                      ? "bg-amber-600 text-stone-950"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  1. Aletheia Markdown (.md)
                </button>
                <button
                  onClick={() => setActiveTabDeliverable("social")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTabDeliverable === "social"
                      ? "bg-amber-600 text-stone-950"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  2. Facebook & Social Share Post
                </button>
              </div>

              {activeTabDeliverable === "markdown" && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-amber-300">
                        {formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "notice"}.md
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Commit this file directly into your GitHub repository for Cloudflare Pages auto-build.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentGeneratedMd);
                          setCopiedMd(true);
                          setTimeout(() => setCopiedMd(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 px-2.5 py-1 rounded text-xs"
                      >
                        {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedMd ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={() => downloadMarkdownFile(formData)}
                        className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-2.5 py-1 rounded text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .md</span>
                      </button>
                    </div>
                  </div>
                  <pre className="bg-stone-900 p-3 rounded text-[11px] font-mono text-stone-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-stone-800">
                    {currentGeneratedMd}
                  </pre>
                </div>
              )}

              {activeTabDeliverable === "social" && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-200">
                      Facebook / WhatsApp Family Announcement Deliverable
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentSocialPost);
                        setCopiedSocial(true);
                        setTimeout(() => setCopiedSocial(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      {copiedSocial ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedSocial ? "Copied Post!" : "Copy Post Text"}</span>
                    </button>
                  </div>
                  <div className="bg-stone-900 p-4 rounded-lg border border-stone-800 text-xs text-stone-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {currentSocialPost}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="bg-stone-950 px-5 sm:px-6 py-4 border-t border-stone-800 flex items-center justify-between">
          <div>
            {step > 1 && step < 5 && (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-xs font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 2 && !formData.title.trim()) {
                    alert("Please enter the name of the deceased.");
                    return;
                  }
                  setStep(step + 1);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 4 ? (
              <button
                onClick={handlePublish}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Notice & Generate Deliverables</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close & View Directory
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
