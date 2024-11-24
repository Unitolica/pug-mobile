import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"

import Dashboard from "./pages/Dashboard.tsx"
import DashboardHome from "./pages/DashboardHome.tsx"
import Hours from "./pages/Hours.tsx"
import Login from "./pages/Login.tsx"
import Projects from "./pages/Projects.tsx"
import ProjectsHome from "./pages/ProjectsHome.tsx"
import DetailProject from "./pages/DetailProject.tsx"
import { Toaster } from "@/components/ui/toaster.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="horas" element={<Hours />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="projetos" element={<Projects />} >
          <Route index element={<ProjectsHome />}/>
          <Route path=":pslug" element={<DetailProject />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  </QueryClientProvider>
)
