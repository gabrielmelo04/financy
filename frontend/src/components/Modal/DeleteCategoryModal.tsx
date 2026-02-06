import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { DELETE_CATEGORY_MUTATION } from "@/lib/graphql/mutations/DeletedCategory";

type DeleteCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
  category: Category;
};

export function DeleteCategoryModal({
  open,
  onOpenChange,
  onDeleted,
  category,
}: DeleteCategoryModalProps) {
  const [deletedCategory] = useMutation(DELETE_CATEGORY_MUTATION, {
    onCompleted: () => {
      toast.success("Categoria excluída com sucesso!");
      onOpenChange(false);
      onDeleted?.();
    },

    onError: (error) => {
      toast.error("Erro ao excluir categoria!");
      console.error("Erro ao excluir categoria: ", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deletedCategory({
      variables: {
        deleteCategoryId: category.id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir categoria</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir essa categoria:{" "}
            <span className="font-bold text-red-base">{category.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex gap-4 mt-4 items-center justify-end"
        >
          <Button
            type="submit"
            className="min-w-20 min-h-10 bg-red-base hover:bg-red-dark text-gray-100 cursor-pointer"
          >
            Sim
          </Button>

          <Button
            type="button"
            className="min-w-20 min-h-10 bg-brand-base hover:bg-brand-dark text-gray-100 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Não
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
