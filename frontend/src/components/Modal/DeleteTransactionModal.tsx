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
import type { Transaction } from "@/types";
import { DELETE_TRANSACTION_MUTATION } from "@/lib/graphql/mutations/DeletedTransaction";

type DeleteTransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
  transaction: Transaction | null;
};

export function DeleteTransactionModal({
  open,
  onOpenChange,
  onDeleted,
  transaction,
}: DeleteTransactionModalProps) {
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    onCompleted: () => {
      toast.success("Transação excluída com sucesso!");
      onOpenChange(false);
      onDeleted?.();
    },
    onError: (error) => {
      toast.error("Erro ao excluir transação!");
      console.error("Erro ao excluir transação: ", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction?.id) {
      toast.error("Transação não encontrada.");
      return;
    }

    deleteTransaction({
      variables: {
        id: transaction.id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir essa transação:{" "}
            <span className="font-bold text-red-base">
              {transaction?.title}
            </span>
            ?
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
