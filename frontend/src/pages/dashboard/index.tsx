import { CardCategory } from "@/components/CardCategory";
import { CardFinancy } from "@/components/CardFinancy";
import { CardTransactions } from "@/components/CardTransactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LIST_TRANSACTIONS_QUERY } from "@/lib/graphql/queries/ListTransactions";
import { useQuery } from "@apollo/client/react";
import type { Category, Transaction } from "@/types";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/ListCategories";
import { useEffect, useState } from "react";
import { toDateInputValue } from "@/lib/format";
import { format } from "date-fns";
import { CreateTransactionModal } from "@/components/Modal/CreateTransactionModal";

export function Dashboard() {
  const { data: dataListTransactions, refetch: refetchTransactions } =
    useQuery<{
      listTransactions: Transaction[];
    }>(LIST_TRANSACTIONS_QUERY, {
      fetchPolicy: "network-only",
    });

  const { data: dataListCategories, refetch: refetchCategories } = useQuery<{
    listCategories: Category[];
  }>(LIST_CATEGORIES_QUERY, {
    fetchPolicy: "network-only",
  });

  const transactions = dataListTransactions?.listTransactions || [];
  const categories = dataListCategories?.listCategories || [];
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  useEffect(() => {
    refetchTransactions();
    refetchCategories();
  }, [location.key, refetchTransactions, refetchCategories]);
  const currentMonthKey = format(new Date(), "yyyy-MM");

  const isCurrentMonth = (dateValue?: string) => {
    if (!dateValue) return false;
    const normalized = toDateInputValue(dateValue);
    return normalized.startsWith(currentMonthKey);
  };

  const transactionsInput = transactions.filter(
    (t) => t.type === "INPUT" && isCurrentMonth(t.date),
  );
  const amountInput = transactionsInput.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  const transactionsOutput = transactions.filter(
    (t) => t.type === "OUTPUT" && isCurrentMonth(t.date),
  );
  const amountOutput = transactionsOutput.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  const totalAmount = amountInput - amountOutput;
  const recentTransactions = transactions.slice(0, 6);
  const recentCategories = categories.slice(0, 6);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <CardFinancy
          key={"Total"}
          title="Saldo Total"
          amount={totalAmount}
          icon={<Wallet size={20} className="mr-2 text-purple-base" />}
        />

        <CardFinancy
          key={"Receita"}
          title="Receitas Do Mês"
          amount={amountInput}
          icon={<CircleArrowUp size={20} className="mr-2 text-brand-base" />}
        />

        <CardFinancy
          key={"Despesa"}
          title="Despesas Do Mês"
          amount={amountOutput ? -amountOutput : 0}
          icon={<CircleArrowDown size={20} className="mr-2 text-red-base" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 items-start">
        <Card className="bg-white shadow-sm md:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500 text-xs uppercase">
              Transações Recentes
            </h3>
            <Link
              to="/transactions"
              className="flex items-center justify-center gap-2 text-brand-base font-medium text-sm cursor-pointer hover:text-brand-dark"
            >
              Ver todas
              <ChevronRight className="w-6 h-6" />
            </Link>
          </CardHeader>
          <hr className="border-gray-300" />
          <CardContent className="-mt-6.25">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <>
                  <CardTransactions
                    key={transaction.id}
                    transaction={transaction}
                  />
                  <hr className="border-gray-300" />
                </>
              ))
            ) : (
              <p className="text-center text-base text-gray-600">
                Nenhuma transação encontrada.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button
              className="w-full h-auto bg-transparent flex items-center justify-center gap-2 text-sm outline-none hover:bg-transparent text-brand-base hover:text-brand-dark cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              <Plus className="w-8 h-8" />
              Nova Transação
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white shadow-sm md:col-span-1">
          <CardHeader className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500 text-xs uppercase">
              Categorias
            </h3>
            <Link
              to="/categories"
              className="flex items-center justify-center gap-2 text-brand-base font-medium text-sm cursor-pointer hover:text-brand-dark"
            >
              Gerenciar
              <ChevronRight className="w-6 h-6" />
            </Link>
          </CardHeader>
          <hr className="border-gray-300" />

          <CardContent className="flex flex-col gap-6">
            {recentCategories.length > 0 ? (
              recentCategories.map((category) => (
                <>
                  <CardCategory
                    key={category.id}
                    category={category}
                    transactions={transactions}
                  />
                  <hr className="border-gray-300" />
                </>
              ))
            ) : (
              <p className="text-center text-base text-gray-600">
                Nenhuma categoria encontrada.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <CreateTransactionModal
        open={openModal}
        onOpenChange={setOpenModal}
        categories={categories}
        onCreated={() => refetchTransactions()}
      />
    </div>
  );
}
