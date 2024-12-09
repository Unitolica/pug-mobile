import { NavLink } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="flex bg-primary justify-between items-center w-full bg-zinc-200 border-b border-b-black py-4 px-3">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-lg font-bold underline" : "text-lg"
        }
      >
        Inicio
      </NavLink>

      <nav className="flex gap-2 md:gap-4 text-md items-center">
        <NavLink
          to="/projetos"
          className={({ isActive }) =>
            isActive ? "font-bold underline" : ""
          }
        >
          Projetos
        </NavLink>

        <NavLink
          to="/estudantes"
          className={({ isActive }) =>
            isActive ? "font-bold underline" : ""
          }
        >
          Estudantes
        </NavLink>

        <NavLink
          to="/cursos"
          className={({ isActive }) =>
            isActive ? "font-bold underline" : ""
          }
        >
          Cursos
        </NavLink>

        <NavLink
          to="/universidades"
          className={({ isActive }) =>
            isActive ? "font-bold underline" : ""
          }
        >
          Universidades
        </NavLink>

        <Button variant="destructive" onClick={logout}>
          Sair
        </Button>
      </nav>
    </header>
  );
}
