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
import Courses from "./pages/Courses.tsx"
import CoursesHomePage from "./pages/CoursesHome.tsx"
import CoursesDetailPage from "./pages/CoursesDetail.tsx"
import UniversitiesPage from "./pages/Universities.tsx"
import UniversitiesHomePage from "./pages/UniversitiesHome.tsx"
import PartnersPage from "./pages/Partners.tsx"
import PartnersHomePage from "./pages/PartnersHome.tsx"
import { AuthProvider } from "./contexts/auth-context.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="horas" element={<Hours />} />
          </Route>

          <Route path="projetos" element={<Projects />} >
            <Route index element={<ProjectsHome />} />
            <Route path=":pslug" element={<DetailProject />} />
          </Route>

          <Route path="cursos" element={<Courses />} >
            <Route index element={<CoursesHomePage />} />
            <Route path=":cslug" element={<CoursesDetailPage />} />
          </Route>

          <Route path="parceiros" element={<PartnersPage />} >
            <Route index element={<PartnersHomePage />} />
          </Route>

          <Route path="universidades" element={<UniversitiesPage />} >
            <Route index element={<UniversitiesHomePage />} />
          </Route>
        </Routes>

        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
)
