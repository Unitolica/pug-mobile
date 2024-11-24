import { NavLink, Link } from "react-router";

export function Header() {
  return (
    <header className="flex bg-primary justify-between items-center w-full bg-zinc-200 border-b border-b-black p-4">
      <h1 className="text-lg font-bold">Administrativo</h1>
      <nav className="flex gap-3 text-md">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Inicio
        </NavLink>

        <Link to="/projetos">Projetos</Link>
      </nav>
    </header>
  );
}
