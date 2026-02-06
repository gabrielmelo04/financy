import { format, isValid, parse, parseISO } from "date-fns";

export const toDateInputValue = (isoValue: string) => {
  if (isoValue.includes("T")) {
    return isoValue.slice(0, 10);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(isoValue)) {
    return isoValue;
  }

  const parsedDate = parseISO(isoValue);
  if (!isValid(parsedDate)) return "";
  return format(parsedDate, "yyyy-MM-dd");
};

export const toUtcIsoDate = (value: string) => {
  const parsedDate = parse(value, "yyyy-MM-dd", new Date());
  if (!isValid(parsedDate)) return null;

  return new Date(
    Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    ),
  ).toISOString();
};

export const toSafeDateFromIso = (isoValue?: string) => {
  if (!isoValue) return null;
  const parsed = parseISO(isoValue);
  if (!isValid(parsed)) return null;

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
      12,
    ),
  );
};

export const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const getMonthKeyFromIso = (isoValue?: string) => {
  if (!isoValue) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoValue)) return isoValue.slice(0, 7);

  if (isoValue.includes("T")) {
    const timePart = isoValue.split("T")[1] ?? "";
    const isUtcMidnight = timePart.startsWith("00:00:00");
    if (isUtcMidnight) return isoValue.slice(0, 7);

    const parsedLocal = parseISO(isoValue);
    return isValid(parsedLocal) ? format(parsedLocal, "yyyy-MM") : "";
  }

  const parsed = parseISO(isoValue);
  return isValid(parsed) ? format(parsed, "yyyy-MM") : "";
};
