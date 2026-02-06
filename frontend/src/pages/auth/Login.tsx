import { useEffect, useState } from "react";
import Logo from "../../assets/Logo/Logo.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Eye, EyeClosed, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const stored = localStorage.getItem("remembered-credentials");
    if (!stored) return;

    try {
      const data = JSON.parse(stored) as {
        email?: string;
        password?: string;
      };

      if (data.email) setEmail(data.email);
      if (data.password) setPassword(data.password);
      setRememberMe(Boolean(data.email || data.password));
    } catch {
      localStorage.removeItem("remembered-credentials");
    }
  }, []);

  useEffect(() => {
    if (!rememberMe) {
      localStorage.removeItem("remembered-credentials");
      return;
    }

    localStorage.setItem(
      "remembered-credentials",
      JSON.stringify({ email, password }),
    );
  }, [rememberMe, email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginMutate = await login({
        email,
        password,
      });
      if (loginMutate) {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      const apolloError = error as {
        graphQLErrors?: { message?: string }[];
        networkError?: { message?: string };
        message?: string;
      };
      const message =
        apolloError?.graphQLErrors?.[0]?.message ||
        apolloError?.networkError?.message ||
        apolloError?.message ||
        "Falha no login. Verifique email e senha.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <img src={Logo} alt="Logo" className="w-32 h-32" />
      </div>

      <div className="max-w-112.5 max-h-145 bg-white rounded-lg p-6 shadow-md w-full border border-gray-200">
        <h3 className="text-center text-xl font-bold text-gray-800">
          Fazer login
        </h3>
        <h4 className="text-center text-base font-normal text-gray-600 mt-2">
          Entre na sua conta para continuar
        </h4>

        <div className="flex flex-col gap-4 mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
                  className="pl-10  h-10 placeholder:text-gray-400"
                  placeholder="seu@email.com"
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
                  placeholder="sua senha"
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
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-gray-600 text-sm cursor-pointer"
                  >
                    Lembrar-me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-brand-base hover:text-brand-dark text-sm font-medium"
                >
                  Recuperar senha
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-base hover:bg-brand-dark text-white font-medium py-2 px-4 rounded-md mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Entrar
            </Button>
          </form>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm font-medium">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="text-center justify-center items-center mt-2 w-full">
            <p className="text-gray-600 font-medium text-sm">
              Ainda não tem uma conta?
            </p>

            <Button className="w-full bg-transparent text-gray-700 mt-2 border border-gray-300 shadow-sm hover:bg-gray-100 font-medium py-2 px-4 rounded-md flex justify-center items-center cursor-pointer">
              <Link
                to="/register"
                className="flex gap-2 w-full items-center justify-center"
              >
                <UserRoundPlus className="w-4 h-4" />
                Cadastrar-se
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
