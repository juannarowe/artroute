export interface EventPage {
  text: string;
  imageUrl?: string;
}

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

export function decodeHtml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_match, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function getImageUrl(html: string): string | undefined {
  const match = html.match(/<meta property="og:image" content="([^"]+)"/);
  return match ? match[1] : undefined;
}

function getEventText(html: string): string {
  const withoutCode = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ');
  const withoutTags = withoutCode.replace(/<[^>]+>/g, ' ');
  const text = decodeHtml(withoutTags).replace(/\s+/g, ' ');

  const start = text.indexOf('Lloc:');
  const end = text.indexOf('veure també');
  if (start === -1 || end === -1) {
    return text.slice(0, 3000);
  }
  return text.slice(start, end).trim();
}
