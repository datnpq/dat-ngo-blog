export function calculateReadingTime(body: string): number {
  const trimmed = body.trim();
  if (!trimmed) return 1;
  const wordCount = trimmed.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

export function truncateExcerpt(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}
