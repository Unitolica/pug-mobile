import { useState } from "react"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { SkeletonTable } from "@/components/skeleton-table"
import { Inbox } from "lucide-react"
import { Teacher, ProjetStatus, ProjetStatusLabel, Project, Course } from "@/types"

async function fetchCourses() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
  return new Array(5).fill("").map((_, index) => {
    const course: Course = {
      slug: `curso-${index}`,
      name: `Curso ${index}`
    }

    return course
  })
}

async function fetchProjects() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

  const data = new Array(5).fill("").map((_, index) => {
    const project: Project = {
      name: `Projeto ${index}`,
      slug: `projeto-${index}`,
      hours: 40,
      status: Math.random() * 10 > 5 ? ProjetStatus.active : ProjetStatus.disabled,
      partner: {
        name: `Parceiro ${index}`,
        id: `id-projeto-${index}`,
      },
      courses: new Array(Math.floor(Math.random() * 10)).fill("").map((_, cIndex) => {
        const course: Course = {
          name: `Curso ${cIndex}`,
          slug: `curso-${cIndex}`
        }

        return course
      }),
      responsibles: new Array(Math.floor(Math.random() * 10)).fill("").map((_, cIndex) => {
        const teacher: Teacher = {
          name: `Resonavel ${cIndex}`,
          email: `responsavel-${cIndex}@catolicasc.edu.br`
        }

        return teacher
      }),
    }

    return project
  })

  return data
}

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams()

  const [selectedCourse, setSelectedCourse] = useState<string>(params.get("curso") ?? "")

  const { isLoading: isLoadingCourses, data: courses } = useQuery({
    queryFn: () => fetchCourses(),
    queryKey: ["courses-filter-options"],
    initialData: []
  })

  const { isLoading: isLoadingProjects, data: projects } = useQuery({
    queryFn: () => fetchProjects(),
    queryKey: ["projects"],

  })

  function selectCourse(newVal: string) {
    setSelectedCourse(newVal)
    params.set("curso", newVal)

    if (newVal === "*")
      params.delete("curso")

    setParams(params)
  }

  return (
    <section className="mt-10 p-5">
      <header className="flex flex-col item-center">
        <h2 className="text-md py-3 font-bold">Projetos</h2>

        <Select value={selectedCourse} onValueChange={selectCourse}>
          <SelectTrigger>
            <SelectValue placeholder={isLoadingCourses ? "Carregando..." : "Filtrar por curso"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"*"}>Todos</SelectItem>
            {
              courses.map(course => (
                <SelectItem key={`course-filter-option-${course.slug}`} value={course.slug}>{course.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </header>

      <main className="mt-5">
        <ProjectsTable data={projects} isLoading={isLoadingProjects} />
      </main>
    </section>
  )
}

function ProjectsTable({ data, isLoading }: { data?: Project[], isLoading: boolean }) {
  if (isLoading) return <SkeletonTable columns={4} />

  if (!data || data?.length <= 0) {
    return (
      <div className="overflow-x-auto flex flex-col items-center justify-center p-20 min-w-full rounded border border-zinc-600">
        <Inbox />
        <p className="text-center">
          Nenhum projeto cadastrado
        </p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded border border-zinc-600">
      <Table className="min-w-full bg-white rounded">
        <TableCaption className="p-4 mt-0">
          Listagem de projetos
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="px-2 py-1 w-1/3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Nome</p>
            </TableHead>

            <TableHead className="px-2 py-1 w-1/4 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Horas</p>
            </TableHead>

            <TableHead className="px-2 py-1 w-1/4 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Status</p>
            </TableHead>

            <TableHead className="px-2 py-1 w-1/3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Acoes</p>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.slug}>
              <TableCell className="px-2 py-2 w-1/3 text-center whitespace-no-wrap border-b border-gray-200">
                {item.name}
              </TableCell>

              <TableCell className="px-2 py-2 w-1/4 text-center whitespace-no-wrap border-b border-gray-200">
                {item.hours}
              </TableCell>

              <TableCell className="px-2 py-2 w-1/4 text-center whitespace-no-wrap border-b border-gray-200">
                {item?.status === ProjetStatus.active ? ProjetStatusLabel.active : ProjetStatusLabel.disabled}
              </TableCell>

              <TableCell className="px-2 py-2 w-1/3 text-center whitespace-no-wrap border-b border-gray-200 underline">
                <Link to={`/projetos/${item.slug}`}>
                  Detalhar
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
