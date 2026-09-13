export type NoticeType = "person" | "pet";

export interface CondolenceMessage {
  id: string;
  author: string;
  relation?: string;
  message: string;
  hasCandle: boolean;
  timestamp: string;
}

export interface TributeNotice {
  id: string;
  slug: string;
  title: string;
  type: NoticeType;
  birthYear?: string;
  passingYear?: string;
  age?: number | string;
  date_of_passing: string;
  location: string;
  county?: string;
  funeral_date?: string;
  funeral_time?: string;
  funeral_location?: string;
  funeral_notes?: string;
  charity: string;
  charity_link?: string;
  bio: string;
  verification_status: string;
  truth_anchor_url?: string;
  truth_anchor_note?: string;
  truth_anchor_verified?: boolean;
  affiliate_trigger_postcode: string;
  photo_url?: string;
  pet_breed?: string;
  condolences: CondolenceMessage[];
  candles_lit: number;
  created_at: string;
  facebook_post?: string;
}

export interface AffiliateItem {
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

export interface IntakeFormData {
  type: NoticeType;
  title: string;
  birthYear: string;
  passingYear: string;
  age: string;
  date_of_passing: string;
  location: string;
  county: string;
  affiliate_trigger_postcode: string;
  funeral_date: string;
  funeral_time: string;
  funeral_location: string;
  funeral_notes: string;
  charity: string;
  charity_link: string;
  bio: string;
  pet_breed: string;
  truth_anchor_url: string;
  truth_anchor_note: string;
  photo_url: string;
}
