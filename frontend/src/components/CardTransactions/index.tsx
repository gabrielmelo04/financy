import type { Transaction } from "@/types";
import { format } from "date-fns";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { getColor } from "@/lib/colors";
import { formatCurrencyBRL, toSafeDateFromIso } from "@/lib/format";

interface CardTransactionsProps {
  transaction: Transaction;
}

export function CardTransactions({ transaction }: CardTransactionsProps) {
  const dateLabel = transaction.date || "";
  const isIncome = transaction.type === "INPUT";

  const categoryColor = getColor(transaction.category.color);

  const IconComponent = getIcon(transaction.category.icon);

  return (
    <div className="w-full flex items-center justify-between py-4">
      <div className="w-full flex gap-4 items-center">
        <div
          className={`${categoryColor.bg} rounded-md p-2 flex items-center justify-center h-full`}
        >
          <IconComponent size={24} className={categoryColor.text} />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-base text-gray-800">{transaction.title}</h1>
          <h2 className="text-sm text-gray-600">
            {(() => {
              const safeDate = toSafeDateFromIso(dateLabel);
              return safeDate ? format(safeDate, "dd/MM/yy") : "-";
            })()}
          </h2>
        </div>
      </div>

      <div className="w-full flex gap-16 items-center justify-end">
        <h1
          className={`${categoryColor.bg} ${categoryColor.text} rounded-full px-4 py-2 font-medium text-sm`}
        >
          {transaction.category.name}
        </h1>
        <div className="flex gap-4 items-center">
          <h2 className="text-gray-800 font-semibold text-sm">
            {isIncome ? "+" : "-"} {formatCurrencyBRL(transaction.amount)}
          </h2>
          {isIncome ? (
            <CircleArrowUp size={20} className="text-brand-base" />
          ) : (
            <CircleArrowDown size={20} className="text-red-base" />
          )}
        </div>
      </div>
    </div>
  );
}
