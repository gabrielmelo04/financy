import { useState } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { apolloClient } from "@/lib/graphql/apollo";
import { UPDATE_USER_MUTATION } from "@/lib/graphql/mutations/UpdateUser";

type UpdateUserMutationData = {
  updateUser: {
    name: string;
  };
};

export function Account() {
  const { user, logout, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, _] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apolloClient.mutate<UpdateUserMutationData, { name: string }>({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          name: fullName,
        },
      });

      updateUser({ name: fullName });
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar alterações!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-8">
      <div className="max-w-112.5 bg-white rounded-lg p-6 shadow-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 mb-4">
            {initials}
          </div>
          <h3 className="text-center text-xl font-bold text-gray-800">
            {user?.name || "Usuário"}
          </h3>
          <p className="text-center text-sm font-normal text-gray-600">
            {user?.email || "email@exemplo.com"}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSaveChanges}>
          <div>
            <Label
              htmlFor="fullName"
              className="text-gray-700 font-medium text-sm"
            >
              Nome completo
            </Label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="fullName"
                type="text"
                name="fullName"
                className="pl-10 h-10 placeholder:text-gray-400"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFullName(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-gray-700 font-medium text-sm"
            >
              E-mail
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                name="email"
                className="pl-10 h-10 placeholder:text-gray-400 bg-gray-50"
                placeholder="seu@email.com"
                value={email}
                disabled
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">
              O e-mail não pode ser alterado
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded-md mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>

        <Button
          onClick={handleLogout}
          className="w-full bg-transparent text-gray-700 mt-4 border border-gray-300 shadow-sm hover:bg-gray-100 font-medium py-2 px-4 rounded-md flex justify-center items-center cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
