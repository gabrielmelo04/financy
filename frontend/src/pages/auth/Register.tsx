import { useState } from "react";
import Logo from "../../assets/Logo/Logo.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Eye, EyeClosed, UserRound, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await register({
        name,
        email,
        password,
      });

      if (success) {
        // Redirecionar para dashboard ou home
        window.location.href = "/";
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <img src={Logo} alt="Logo" className="w-32 h-32" />
      </div>

      <div className="max-w-112.5 bg-white rounded-lg p-6 shadow-md w-full">
        <h3 className="text-center text-xl font-bold text-gray-800">
          Criar conta
        </h3>
        <h4 className="text-center text-base font-normal text-gray-600 mt-2">
          Comece a controlar suas finanças ainda hoje
        </h4>

        <div className="flex flex-col gap-4 mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 font-medium text-sm"
              >
                Nome completo
              </Label>
              <div className="relative mt-2">
                <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  name="name"
                  className="pl-10 h-10 placeholder:text-gray-400"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  className="pl-10 h-10 placeholder:text-gray-400"
                  placeholder="mail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-gray-700 font-medium text-sm"
              >
                Senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="pl-10 pr-10 h-10 placeholder:text-gray-400"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeClosed className="w-4 h-4 text-gray-400 cursor-pointer" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand-base hover:bg-brand-dark text-white font-medium py-2 px-4 rounded-md mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm font-medium">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="text-center justify-center items-center mt-2 w-full">
            <p className="text-gray-600 font-medium text-sm">
              Já tem uma conta?
            </p>

            <Button className="w-full bg-transparent text-gray-700 mt-2 border border-gray-300 shadow-sm hover:bg-gray-100 font-medium py-2 px-4 rounded-md flex justify-center items-center cursor-pointer">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full"
              >
                <LogIn className="w-4 h-4" />
                Fazer login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
