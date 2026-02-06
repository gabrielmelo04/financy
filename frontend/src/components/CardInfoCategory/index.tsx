import { Card, CardContent, CardHeader } from "../ui/card";

type CardInfoCategoryProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function CardInfoCategory({
  title,
  description,
  icon,
}: CardInfoCategoryProps) {
  return (
    <Card className="flex flex-col gap-4 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-start">
        {icon}
        <h1 className="text-3xl font-bold text-gray-800">{description}</h1>
      </CardHeader>
      <CardContent className="ml-12.25">
        <h3 className="font-medium text-gray-500 text-xs">
          {title.toUpperCase()}
        </h3>
      </CardContent>
    </Card>
  );
}
