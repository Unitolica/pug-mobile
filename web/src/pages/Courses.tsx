import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Outlet } from "react-router-dom"

export default function CoursesPage () {
  return (
    <ProtectedRoute>
      <Header />
      <Outlet />
    </ProtectedRoute>
  )
}
