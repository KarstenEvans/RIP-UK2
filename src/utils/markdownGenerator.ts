import { TributeNotice, IntakeFormData } from "../types";

export function generateAletheiaMarkdown(notice: TributeNotice | IntakeFormData): string {
  const birthYear = notice.birthYear || "1945";
  const passingYear = notice.passingYear || new Date().getFullYear().toString();
  const yearsText =
    birthYear && passingYear
      ? `**${birthYear} – ${passingYear}**`
      : notice.date_of_passing
      ? `**Passed on ${notice.date_of_passing}**`
      : "";

  const verification =
    "verification_status" in notice && notice.verification_status
      ? notice.verification_status
      : notice.truth_anchor_url
      ? `Verified via ${notice.truth_anchor_url}`
      : "Verified via family record & funeral arrangement";

  const funeralDateTime = [
    notice.funeral_date || "Date to be announced",
    notice.funeral_time ? `at ${notice.funeral_time}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `---
title: "${notice.title.replace(/"/g, '\\"')}"
type: "${notice.type}"
date_of_passing: "${notice.date_of_passing || "Unknown"}"
location: "${notice.location || ""}"
funeral_date: "${notice.funeral_date || ""}"
charity: "${notice.charity.replace(/"/g, '\\"')}"
verification_status: "${verification.replace(/"/g, '\\"')}"
affiliate_trigger_postcode: "${notice.affiliate_trigger_postcode || ""}"
---

# In Loving Memory of ${notice.title}
${yearsText}

${notice.bio || "Forever in our hearts and dearly remembered by all family and friends."}

## Funeral Arrangements
- **Location:** ${notice.funeral_location || "Private Family Service"}
- **Date & Time:** ${funeralDateTime}
${notice.funeral_notes ? `- **Notes:** ${notice.funeral_notes}` : ""}

## Donations
In lieu of flowers, the family requests donations to ${notice.charity || "the designated charity"}${
    notice.charity_link ? ` (${notice.charity_link})` : ""
  }.

---
*Local Resources:* 
<!-- The site generator will use the affiliate_trigger_postcode here to pull local florists, wakes, and solicitors from the Aletheia A2Z directory -->
`;
}

export function generateSocialPost(notice: TributeNotice | IntakeFormData, appUrl: string = "https://uknotices.rip"): string {
  const memorialUrl = `${appUrl}/memorial/${"slug" in notice ? notice.slug : "notice"}`;
  const venue = notice.funeral_location || "the chapel";
  const date = notice.funeral_date
    ? `${notice.funeral_date}${notice.funeral_time ? ` at ${notice.funeral_time}` : ""}`
    : "a date to be confirmed";

  if (notice.type === "pet") {
    return `It is with heavy hearts that we share the passing of our cherished pet, ${notice.title}. 
They brought endless unconditional love, joy, and tail wags into our home and will be forever missed across the Rainbow Bridge.

${notice.charity ? `In lieu of gifts, we are supporting ${notice.charity}.\n\n` : ""}Full tribute and memorial details: ${memorialUrl}`;
  }

  return `It is with profound sadness that we announce the passing of ${notice.title}. They brought so much joy, kindness, and light to our lives and will be deeply missed by all who knew them.

The funeral service will be held on ${date} at ${venue}.
${
  notice.charity
    ? `Instead of flowers, the family warmly requests donations to ${notice.charity}.\n\n`
    : ""
}You can find full details, leave a message of condolence, or arrange local flowers via their memorial page here: ${memorialUrl}`;
}

export function downloadMarkdownFile(notice: TributeNotice | IntakeFormData): void {
  const content = generateAletheiaMarkdown(notice);
  const rawSlug = notice.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const filename = `${rawSlug || "notice"}-${notice.date_of_passing || "date"}.md`;

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
