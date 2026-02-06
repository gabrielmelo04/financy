import type { Category, Transaction } from "@/types";
import { formatCurrencyBRL } from "@/lib/format";
import { getColor } from "@/lib/colors";

interface CardCategoryProps {
  category: Category;
  transactions?: Transaction[];
}

export function CardCategory({
  category,
  transactions = [],
}: CardCategoryProps) {
  const categoryColor = getColor(category.color);

  const itemsCategory = transactions.filter(
    (t) => t.category.id === category.id,
  );

  const totalItems = itemsCategory.reduce((acc, _) => {
    return acc + 1;
  }, 0);

  const totalValue = itemsCategory.reduce((acc, t) => {
    return acc + t.amount;
  }, 0);

  return (
    <div className="w-full flex items-center justify-between">
      <h2
        className={`rounded-full px-4 py-2  text-sm ${categoryColor.bg} ${categoryColor.text}`}
      >
        {category.name}
      </h2>
      <div className="flex gap-12">
        <h3 className="text-gray-600 text-sm font-medium">
          {totalItems >= 1 ? `${totalItems} itens` : `${totalItems} item`}
        </h3>
        <h2 className="text-gray-800 text-sm font-semibold">
          {formatCurrencyBRL(totalValue)}
        </h2>
      </div>
    </div>
  );
}
