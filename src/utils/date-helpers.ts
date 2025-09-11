export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Nunca";
  return new Date(dateString).toLocaleDateString("pt-BR", {
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
