import type { Category } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { getIcon } from "@/lib/icons";
import { getColor } from "@/lib/colors";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { UpdateCategoryModal } from "../Modal/UpdateCategoryModal";
import { DeleteCategoryModal } from "../Modal/DeleteCategoryModal";

type CardItemCategoryProps = {
  category: Category;
  refetch: () => void;
};

export function CardItemCategory({ category, refetch }: CardItemCategoryProps) {
  const IconComponent = getIcon(category.icon);
  const categoryColor = getColor(category.color);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <Card className="flex flex-col gap-6 bg-white shadow-sm hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div
          className={`${categoryColor.bg} rounded-md p-2 flex items-center justify-center w-12 h-12`}
        >
          <IconComponent size={16} className={categoryColor.text} />
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-transparent border-2 border-gray-300 outline-0 hover:bg-gray-300 cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)}
            type="button"
          >
            <Trash size={16} className="text-danger" />
          </Button>
          <Button
            className="bg-transparent border-2 border-gray-300 outline-0 hover:bg-gray-300 cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            <SquarePen size={16} className="text-gray-700" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="">
        <h1 className="text-base text-gray-800 font-semibold">
          {category.name}
        </h1>
        <h3 className="text-sm text-gray-600">{category.description}</h3>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <h2
          className={`${categoryColor.bg} ${categoryColor.text} rounded-full px-4 py-2 font-medium text-sm`}
        >
          {category.name}
        </h2>
        <h2 className="text-sm text-gray-600">
          {category.transactionCount > 0
            ? category.transactionCount + " itens"
            : 0 + " item"}
        </h2>
      </CardFooter>
      <UpdateCategoryModal
        open={openDialog}
        onOpenChange={setOpenDialog}
        onUpdated={() => refetch()}
        category={category}
      />
      <DeleteCategoryModal
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onDeleted={() => refetch()}
        category={category}
      />
    </Card>
  );
}
