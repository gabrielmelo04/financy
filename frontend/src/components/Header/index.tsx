import { useAuthStore } from "@/stores/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo/Logo.svg";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const isTransactions = location.pathname === "/transactions";
  const isCategories = location.pathname === "/categories";

  const [nameArray, setNameArray] = useState<string[]>([]);

  useEffect(() => {
    setNameArray(user?.name?.split(" ") || []);
  }, [user]);

  return (
    <>
      {isAuthenticated && (
        <header className="w-full h-16 bg-white flex items-center justify-between px-12 shadow-md">
          <div>
            <img src={Logo} alt="Logo" className="w-25 h-25" />
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className={
                isDashboard
                  ? "text-brand-base font-medium text-md cursor-pointer"
                  : "text-gray-600 font-medium text-md cursor-pointer hover:text-brand-dark"
              }
              onClick={() => navigate("/")}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={
                isTransactions
                  ? "text-brand-base font-medium text-md cursor-pointer"
                  : "text-gray-600 font-medium text-md cursor-pointer hover:text-brand-dark"
              }
              onClick={() => navigate("/dashboard")}
            >
              Transações
            </Link>
            <Link
              to="/categories"
              className={
                isCategories
                  ? "text-brand-base font-medium text-md cursor-pointer"
                  : "text-gray-600 font-medium text-md cursor-pointer hover:text-brand-dark"
              }
              onClick={() => navigate("/categories")}
            >
              Categorias
            </Link>
          </div>
          <Avatar
            className="cursor-pointer bg-gray-300"
            onClick={() => navigate("/account")}
          >
            <AvatarFallback className="text-gray-800 bg-gray-300 font-bold text-sm">
              {nameArray.length > 0
                ? nameArray[0].charAt(0).toUpperCase() +
                  (nameArray[1] !== undefined
                    ? nameArray[1]?.charAt(0).toUpperCase()
                    : "")
                : "U"}
            </AvatarFallback>
          </Avatar>
        </header>
      )}
    </>
  );
}
