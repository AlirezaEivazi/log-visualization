import dayjs from 'dayjs';

/** "2026-09-09T10:15:00Z" -> "09 Sep 2026, 10:15:00" */
export function formatDateTime(iso: string): string {
  return dayjs(iso).format('DD MMM YYYY, HH:mm:ss');
}

/** "2026-09-09T10:15:00Z" -> "10:15:00" */
export function formatTime(iso: string): string {
  return dayjs(iso).format('HH:mm:ss');
}

/** Relative-ish helper for small "last updated" labels. */
export function formatRelativeShort(iso: string): string {
  const diffSec = Math.max(0, dayjs().diff(dayjs(iso), 'second'));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${Math.floor(diffHour / 24)}d ago`;
}
