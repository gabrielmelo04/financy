import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { CREATE_TRANSACTION_MUTATION } from "@/lib/graphql/mutations/CreateTransaction";
import { useAuthStore } from "@/stores/auth";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toUtcIsoDate } from "@/lib/format";

type CreateTransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  categories: Category[];
};

export function CreateTransactionModal({
  open,
  onOpenChange,
  onCreated,
  categories,
}: CreateTransactionModalProps) {
  const { user } = useAuthStore();
  const [type, setType] = useState<"OUTPUT" | "INPUT">("OUTPUT");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }),
    [],
  );

  const formatAmount = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    const cents = Number(digits || "0");
    return formatCurrency.format(cents / 100);
  };

  const parseAmount = (formattedValue: string) => {
    const digits = formattedValue.replace(/\D/g, "");
    const cents = Number(digits || "0");
    return cents / 100;
  };

  const [createTransaction, { loading }] = useMutation(
    CREATE_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success("Transação criada com sucesso!");
        onOpenChange(false);
        onCreated?.();
        setTitle("");
        setDate("");
        setAmount("");
        setCategoryId("");
        setType("OUTPUT");
      },
      onError: (error) => {
        const apolloError = error as {
          graphQLErrors?: { message?: string }[];
          message?: string;
        };
        const message =
          apolloError.graphQLErrors?.[0]?.message ||
          apolloError.message ||
          "Erro ao criar transação!";
        toast.error(message);
        console.error("Erro ao criar transação: ", error);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (!title.trim() || !amount || !categoryId || !date) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const parsedAmount = parseAmount(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    const normalizedDate = toUtcIsoDate(date);
    if (!normalizedDate) {
      toast.error("Data inválida.");
      return;
    }

    createTransaction({
      variables: {
        data: {
          title: title.trim(),
          amount: parsedAmount,
          type,
          categoryId,
          date: normalizedDate,
          userId: user.id,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label className="text-gray-700">Tipo</Label>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(value) =>
                setType(value === "INPUT" ? "INPUT" : "OUTPUT")
              }
              className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-1 bg-white w-full"
            >
              <ToggleGroupItem
                value="OUTPUT"
                className="min-h-12 rounded-md border border-transparent bg-white text-gray-600 data-[state=on]:border-red-500 data-[state=on]:text-red-600"
              >
                <ArrowDownCircle size={16} className="mr-2" />
                Despesa
              </ToggleGroupItem>
              <ToggleGroupItem
                value="INPUT"
                className="min-h-12 rounded-md border border-transparent bg-white text-gray-600 data-[state=on]:border-green-500 data-[state=on]:text-green-600"
              >
                <ArrowUpCircle size={16} className="mr-2" />
                Receita
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label className="text-gray-700">Descrição</Label>
            <Input
              placeholder="Ex. Almoço no restaurante"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
              required
              className="w-full min-h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 pb-6">
            <div className="flex flex-col gap-3">
              <Label className="text-gray-700">Data</Label>
              <Input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={loading}
                required
                className="w-full min-h-12"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label className="text-gray-700">Valor</Label>
              <Input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(event) =>
                  setAmount(formatAmount(event.target.value))
                }
                disabled={loading}
                required
                className="w-full min-h-12"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label className="text-gray-700">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full min-h-12">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full min-h-12 bg-brand-base hover:bg-brand-dark text-gray-100 cursor-pointer"
            disabled={loading}
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
