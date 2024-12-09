import { NavLink } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-6 py-4 bg-white border-b shadow-sm">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-xl font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-gray-900'}`
        }
      >
        Inicio
      </NavLink>

      <nav className="flex items-center space-x-6">
        {[
          { to: '/projetos', label: 'Projetos' },
          { to: '/estudantes', label: 'Estudantes' },
          { to: '/cursos', label: 'Cursos' },
          { to: '/universidades', label: 'Universidades' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
          className={({ isActive }) =>
              `font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-gray-600 hover:text-gray-900'}`
          }
        >
            {label}
        </NavLink>
        ))}
        <Button 
          variant="destructive" 
          onClick={logout}
          className="ml-2"
        >
          Sair
        </Button>
      </nav>
    </header>
  );
}
