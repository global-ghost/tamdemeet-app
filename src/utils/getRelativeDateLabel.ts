export function getRelativeDateLabel(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    return 'in the future';
  }

  const diffMinutes = diffMs / (1000 * 60);
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;
  const diffMonths = diffDays / 30;

  const isSameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 30) {
    return 'a few minutes ago';
  }

  if (diffMinutes < 60) {
    return 'less than an hour ago';
  }

  if (diffMinutes < 120) {
    return 'an hour ago';
  }
  if (isSameDay) {
    return 'today';
  }
  if (isYesterday) {
    return 'yesterday';
  }
  if (diffDays < 7) {
    return 'this week';
  }
  if (
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    return 'this month';
  }
  if (
    date.getMonth() === now.getMonth() - 1 &&
    date.getFullYear() === now.getFullYear()
  ) {
    return 'a month ago';
  }
  if (diffMonths < 6) {
    return 'few months ago';
  }
  return 'long time ago';
}
