import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { colorMap } from "@/lib/colors";
import { iconMap } from "@/lib/icons";
import { Button } from "../ui/button";
import { useMutation } from "@apollo/client/react";
import { CREATE_CATEGORY_MUTATION } from "@/lib/graphql/mutations/CreateCategory";
import { toast } from "sonner";

type CreateCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreateCategoryModal({
  open,
  onOpenChange,
  onCreated,
}: CreateCategoryModalProps) {
  const iconOptions = Object.keys(iconMap);
  const colorOptions = Object.keys(colorMap);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(iconOptions[0] ?? "");
  const [color, setColor] = useState(colorOptions[0] ?? "");
  const getCssVarFromText = (textClass: string) =>
    `var(--${textClass.replace(/^text-/, "")})`;

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY_MUTATION, {
    onCompleted: () => {
      toast.success("Categoria criada com sucesso!");
      onOpenChange(false);
      onCreated?.();
      setTitle("");
      setDescription("");
      setIcon(iconOptions[0] ?? "");
      setColor(colorOptions[0] ?? "");
    },

    onError: (error) => {
      toast.error("Erro ao criar categoria!");
      console.error("Erro ao criar categoria: ", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory({
      variables: {
        data: {
          name: title,
          description,
          icon,
          color,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label htmlFor="title" className="text-gray-700">
              Título
            </Label>
            <Input
              id="title"
              placeholder="Ex: Alimentação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-12"
              disabled={loading}
              required
            />
          </div>

          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label htmlFor="description" className="text-gray-700">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Descrição da categoria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-12"
              disabled={loading}
              required
            />
            <p className="text-sm text-gray-500 -mt-1">Opicional</p>
          </div>

          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label className="text-gray-700">Ícone</Label>
            <ToggleGroup
              type="single"
              value={icon}
              onValueChange={(value) => value && setIcon(value)}
              className="flex flex-wrap"
              spacing={2}
              variant="outline"
              size="sm"
            >
              {iconOptions.map((iconName) => {
                const Icon = iconMap[iconName];
                return (
                  <ToggleGroupItem
                    key={iconName}
                    value={iconName}
                    aria-label={`Selecionar ícone ${iconName}`}
                    className="h-12 w-12 p-0 rounded-lg border-2 border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 data-[state=on]:border-green-600 data-[state=on]:text-green-700 data-[state=on]:bg-white cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>

          <div className="w-full flex flex-col gap-3 pt-2 pb-6">
            <Label className="text-gray-700">Cor</Label>
            <ToggleGroup
              type="single"
              value={color}
              onValueChange={(value) => value && setColor(value)}
              className="flex flex-wrap"
              spacing={2}
              variant="outline"
              size="sm"
            >
              {colorOptions.map((colorName) => (
                <ToggleGroupItem
                  key={colorName}
                  value={colorName}
                  aria-label={`Selecionar cor ${colorName}`}
                  className="h-8 w-14 p-0 rounded-lg border-2 border-gray-300 bg-white data-[state=on]:border-green-600 data-[state=on]:bg-white cursor-pointer"
                >
                  <span
                    className="h-6 w-12 rounded-md border border-black/10"
                    style={{
                      backgroundColor: getCssVarFromText(
                        colorMap[colorName].text,
                      ),
                    }}
                  />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <Button
            type="submit"
            className="w-full min-h-10 bg-brand-base hover:bg-brand-dark text-gray-100 cursor-pointer"
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
