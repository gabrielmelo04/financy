import {
  PiggyBank,
  ShoppingCart,
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  Ticket,
  ToolCase,
  PawPrint,
  House,
  Utensils,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  PiggyBank,
  ShoppingCart,
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  Ticket,
  ToolCase,
  House,
  PawPrint,
  Utensils,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
};

export const getIcon = (iconName?: string): LucideIcon => {
  return iconMap[iconName as string] || PiggyBank;
};
