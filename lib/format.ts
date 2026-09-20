const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatUtcTime(value: string) {
  const date = new Date(value);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes} UTC`;
}
