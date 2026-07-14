export const formatDate = (
  date,
  options = { day: "2-digit", month: "short", year: "numeric" },
  locale = "en-IN",
) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, options).format(parsedDate);
};
