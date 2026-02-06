import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SquarePen,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, Transaction } from "@/types";
import { useQuery } from "@apollo/client/react";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/ListCategories";
import { LIST_TRANSACTIONS_QUERY } from "@/lib/graphql/queries/ListTransactions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getColor } from "@/lib/colors";
import { getIcon } from "@/lib/icons";
import { CreateTransactionModal } from "@/components/Modal/CreateTransactionModal";
import { UpdateTransactionModal } from "@/components/Modal/UpdateTransactionModal";
import { DeleteTransactionModal } from "@/components/Modal/DeleteTransactionModal";
import { formatCurrencyBRL, toSafeDateFromIso } from "@/lib/format";

export function TransactionPage() {
  const { data: dataListCategories } = useQuery<{
    listCategories: Category[];
  }>(LIST_CATEGORIES_QUERY, {
    fetchPolicy: "network-only",
  });

  const { data: dataListTransactions, refetch: refetchTransactions } =
    useQuery<{
      listTransactions: Transaction[];
    }>(LIST_TRANSACTIONS_QUERY, {
      fetchPolicy: "network-only",
    });

  const categories = dataListCategories?.listCategories || [];
  const transactions = dataListTransactions?.listTransactions || [];

  const toSafeDate = (dateValue?: string) => toSafeDateFromIso(dateValue);

  // Generate period options from transactions
  const periodMap = new Map<string, string>();
  transactions.forEach((transaction) => {
    const safeDate = toSafeDate(transaction.date);
    if (!safeDate) return;
    const key = format(safeDate, "yyyy-MM");
    const label = format(safeDate, "MMMM / yyyy", { locale: ptBR });
    const prettyLabel = label.charAt(0).toUpperCase() + label.slice(1);
    periodMap.set(key, prettyLabel);
  });

  const periodOptions = Array.from(periodMap.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, label]) => ({ key, label }));

  const formatDate = (dateValue?: string) => {
    const safeDate = toSafeDate(dateValue);
    if (!safeDate) return "-";
    return format(safeDate, "dd/MM/yy");
  };

  const getPeriodKey = (dateValue?: string) => {
    const safeDate = toSafeDate(dateValue);
    if (!safeDate) return "";
    return format(safeDate, "yyyy-MM");
  };

  const formatCurrency = (value: number) => formatCurrencyBRL(value);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [periodFilter, setPeriodFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesSearch =
        !normalizedSearch ||
        transaction.title.toLowerCase().includes(normalizedSearch) ||
        (transaction.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesType =
        typeFilter === "todos" ||
        (typeFilter === "input"
          ? transaction.type === "INPUT"
          : transaction.type === "OUTPUT");

      const matchesCategory =
        categoryFilter === "todas" ||
        transaction.category?.id === categoryFilter;

      const matchesPeriod =
        periodFilter === "todos" ||
        getPeriodKey(transaction.date) === periodFilter;

      return matchesSearch && matchesType && matchesCategory && matchesPeriod;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter, periodFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    typeFilter,
    categoryFilter,
    periodFilter,
    transactions.length,
  ]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex,
  );

  return (
    <div>
      <div className="w-full flex items-center justify-between mt-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <h2 className="text-base text-gray-600">
            Gerencie todas as suas transações financeiras
          </h2>
        </div>
        <Button
          onClick={() => setOpenCreateDialog(true)}
          className="bg-brand-base px-5 py-5 cursor-pointer hover:bg-brand-dark text-gray-100 flex items-center justify-center"
        >
          <Plus className="mr-1 text-gray-100 " size={16} />
          Nova Transação
        </Button>
      </div>

      <div>
        <Card className="flex flex-col gap-6 bg-white shadow-sm hover:shadow-md mt-8">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 text-sm">Buscar</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por descrição"
                  className="pl-10 h-10 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 text-sm">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full mt-2 h-10 py-1 data-[size=default]:h-10 data-[size=default]:py-1">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="input">Entrada</SelectItem>
                    <SelectItem value="output">Saída</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 text-sm">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full mt-2 h-10 py-1 data-[size=default]:h-10 data-[size=default]:py-1">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todas">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >{`${category.name}`}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 text-sm">Período</Label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full mt-2 h-10 py-1 data-[size=default]:h-10 data-[size=default]:py-1">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todos">Todos</SelectItem>
                    {periodOptions.map((period) => (
                      <SelectItem key={period.key} value={period.key}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-white shadow-sm hover:shadow-md mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white">
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase">
                    Descrição
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase">
                    Data
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase">
                    Categoria
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase">
                    Tipo
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase text-right">
                    Valor
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase text-center">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => {
                  const categoryColor = getColor(
                    transaction.category?.color ?? undefined,
                  );
                  const IconComponent = getIcon(
                    transaction.category?.icon ?? undefined,
                  );
                  const isInput = transaction.type === "INPUT";
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`${categoryColor.bg} rounded-md p-2 flex items-center justify-center w-9 h-9`}
                          >
                            <IconComponent
                              size={16}
                              className={categoryColor.text}
                            />
                          </div>
                          <span className="text-base font-medium text-gray-800">
                            {transaction.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <span
                          className={`${categoryColor.bg} ${categoryColor.text} rounded-full px-3 py-1 text-xs font-medium`}
                        >
                          {transaction.category?.name ?? "Sem categoria"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {isInput ? (
                            <ArrowUpCircle
                              size={16}
                              className="text-brand-base"
                            />
                          ) : (
                            <ArrowDownCircle
                              size={16}
                              className="text-red-base"
                            />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              isInput ? "text-brand-base" : "text-red-base"
                            }`}
                          >
                            {isInput ? "Entrada" : "Saída"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right text-sm font-semibold text-gray-800">
                        {isInput ? "+" : "-"}{" "}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-200 cursor-pointer"
                            type="button"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Trash size={14} className="text-red-base" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-200 cursor-pointer"
                            type="button"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setOpenUpdateDialog(true);
                            }}
                          >
                            <SquarePen size={14} className="text-gray-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
              <span>
                {totalItems === 0
                  ? "0 resultados"
                  : `${startIndex + 1} a ${endIndex} | ${totalItems} resultados`}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-200"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  <ChevronLeft size={16} />
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={
                        isActive
                          ? "h-8 w-8 p-0 bg-brand-base text-white hover:bg-brand-dark"
                          : "h-8 w-8 p-0 border-gray-200"
                      }
                      variant={isActive ? "default" : "outline"}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-200 "
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateTransactionModal
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onCreated={() => refetchTransactions()}
        categories={categories}
      />

      <UpdateTransactionModal
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
        onUpdated={() => refetchTransactions()}
        categories={categories}
        transaction={selectedTransaction}
      />

      <DeleteTransactionModal
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onDeleted={() => refetchTransactions()}
        transaction={selectedTransaction}
      />
    </div>
  );
}
