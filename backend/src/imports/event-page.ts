// Reads one event page on graf.cat and keeps only what we need:
// the event text (for Gemini) and the picture.
export interface EventPage {
  text: string;
  imageUrl?: string;
}

// Never throws: if the page fails, the import goes on with an empty text.
export async function fetchEventPage(link: string): Promise<EventPage> {
  try {
    const response = await fetch(link);
    if (!response.ok) {
      return { text: '' };
    }
    const html = await response.text();
    return { text: getEventText(html), imageUrl: getImageUrl(html) };
  } catch {
    return { text: '' };
  }
}

// WordPress writes some characters as codes, e.g. "&#8217;" instead of "’"
export function decodeHtml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_match, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

// "og:image" is the picture that social networks show when a link is shared
function getImageUrl(html: string): string | undefined {
  const match = html.match(/<meta property="og:image" content="([^"]+)"/);
  return match ? match[1] : undefined;
}

// Turns the HTML into plain text and keeps only the event part,
// which goes from "Lloc:" (place) to "veure també" (see also).
function getEventText(html: string): string {
  const withoutCode = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ');
  const withoutTags = withoutCode.replace(/<[^>]+>/g, ' ');
  const text = decodeHtml(withoutTags).replace(/\s+/g, ' ');

  const start = text.indexOf('Lloc:');
  const end = text.indexOf('veure també');
  if (start === -1 || end === -1) {
    return text.slice(0, 3000); // unknown layout: send a piece of the page
  }
  return text.slice(start, end).trim();
}
