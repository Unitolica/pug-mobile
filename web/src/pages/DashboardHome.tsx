import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardHome () {
  const { logout, user } = useAuth()
  return (
    <main className="p-4">
      <header className="flex justify-between items-center">
        <h1 className="font-bold">Oi, {user!.name}</h1>
        <Button variant="destructive" onClick={logout}>
          Sair
        </Button>
      </header>

      <section className="flex flex-col"></section>
    </main>
  )
}
