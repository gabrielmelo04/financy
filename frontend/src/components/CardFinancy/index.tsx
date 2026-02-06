import { Card, CardContent, CardHeader } from "../ui/card";
import { formatCurrencyBRL } from "@/lib/format";

type CardFinancyProps = {
  title: string;
  amount: number;
  icon: React.ReactNode;
};

export function CardFinancy({ title, amount, icon }: CardFinancyProps) {
  return (
    <Card className="flex flex-col gap-4 bg-white shadow-sm ">
      <CardHeader className="flex flex-row items-center justify-start">
        {icon}
        <h3 className="font-medium text-gray-500 text-xs">
          {title.toUpperCase()}
        </h3>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold text-gray-800">
          {formatCurrencyBRL(amount)}
        </h1>
      </CardContent>
    </Card>
  );
}
