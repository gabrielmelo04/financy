import { format, isValid, parse, parseISO } from "date-fns";

export const toDateInputValue = (isoValue: string) => {
  if (isoValue.includes("T")) {
    return isoValue.slice(0, 10);
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
