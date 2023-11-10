export const formatCurrency = (name: string, amount: number | string) => {
  const digit = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: name.toUpperCase(),
  }).format(digit);
};
