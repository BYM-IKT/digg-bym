export const toDateString = (
  dateString: string | null | undefined,
  showTime?: boolean
): string => {
  if (!dateString) return "";

  if (showTime)
    return new Date(dateString).toLocaleTimeString("no", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      minute: "numeric",
      hour: "numeric",
    });

  return new Date(dateString).toLocaleDateString("no", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
