import { Header } from "@/components/header"
import { Outlet } from "react-router-dom"

export default function DashboardPage () {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
