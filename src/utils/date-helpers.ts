export const formatDate = (
  dateString: string | null,
  locale: string = "pt-BR",
  options?: Intl.DateTimeFormatOptions
) => {
  if (!dateString) return "Nunca";
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  
  return new Date(dateString).toLocaleDateString(locale, options || defaultOptions);
};

export const formatDateLocalized = (
  dateString: string | Date | null | undefined,
  language: string = "pt-BR"
) => {
  if (!dateString) return "N/A";
  
  const locale = language === "en" ? "en-US" : "pt-BR";
  return new Date(dateString).toLocaleDateString(locale);
};

export const formatDateShort = (
  dateString: string | Date | null,
  locale: string = "pt-BR"
) => {
  if (!dateString) return "N/A";
  
  return new Date(dateString).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getDaysInactive = (lastLoginAt: string | null, createdAt: string) => {
  const referenceDate = lastLoginAt
    ? new Date(lastLoginAt)
    : new Date(createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - referenceDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
