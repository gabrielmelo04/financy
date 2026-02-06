import { CardInfoCategory } from "@/components/CardInfoCategory";
import { CardItemCategory } from "@/components/CardItemCategory";
import { CreateCategoryModal } from "@/components/Modal/CreateCategoryModal";
import { Button } from "@/components/ui/button";
import { getColor } from "@/lib/colors";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/ListCategories";
import { getIcon } from "@/lib/icons";
import type { Category } from "@/types";
import { useQuery } from "@apollo/client/react";
import { ArrowUpDown, Plus, Tag } from "lucide-react";
import { useState } from "react";

export function CategoryPage() {
  const { data: dataListCategories, refetch } = useQuery<{
    listCategories: Category[];
  }>(LIST_CATEGORIES_QUERY, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const categories = dataListCategories?.listCategories || [];

  const totalCategories = categories.length;
  const totalTransactions = categories.reduce(
    (acc, category) => acc + category.transactionCount,
    0,
  );
  const categoryMostUsed = categories.length
    ? categories.reduce((mostUsed, category) => {
        return category.transactionCount > mostUsed.transactionCount
          ? category
          : mostUsed;
      }, categories[0])
    : null;

  const IconComponent = categoryMostUsed ? getIcon(categoryMostUsed.icon) : Tag;
  const categoryColor = categoryMostUsed
    ? getColor(categoryMostUsed.color)
    : { bg: "bg-gray-200", text: "text-gray-700" };

  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div>
      <div className="w-full flex items-center justify-between mt-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <h2 className="text-base text-gray-600">
            Organize suas transações por categorias
          </h2>
        </div>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-brand-base px-5 py-5 cursor-pointer hover:bg-brand-dark text-gray-100 flex items-center justify-center"
        >
          <Plus className="mr-1 text-gray-100 " size={16} />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <CardInfoCategory
          title="Total de categorias"
          description={totalCategories.toString()}
          icon={<Tag size={32} className="mr-2 text-gray-700" />}
        />

        <CardInfoCategory
          title="Total de transações"
          description={totalTransactions.toString()}
          icon={<ArrowUpDown size={32} className="mr-2 text-purple-base" />}
        />

        <CardInfoCategory
          title="Categoria mais utilizada"
          description={categoryMostUsed?.name ?? "Nenhuma categoria"}
          icon={
            <IconComponent size={32} className={`${categoryColor.text} mr-2`} />
          }
        />
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {categories.map((category) => (
            <CardItemCategory
              key={category.id}
              category={category}
              refetch={refetch}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-600">
          Nenhuma categoria encontrada.
        </div>
      )}
      <CreateCategoryModal
        open={openDialog}
        onOpenChange={setOpenDialog}
        onCreated={() => refetch()}
      />
    </div>
  );
}
