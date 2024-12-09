import { useQuery } from "@tanstack/react-query"
import { CheckIcon, LoaderIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/services/api"

async function fetchProject(slug: string) {
  const { data } = await api.get(`/project/${slug}`)
  return data
}

export default function DetailProjectPage() {
  const { pslug } = useParams()
  const { toast } = useToast()

  if (!pslug)
    throw new Error("pslug param is requried")

  const { isLoading, data: project } = useQuery({
    queryFn: () => fetchProject(pslug),
    queryKey: ["project", pslug]
  })

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <LoaderIcon className="animate-spin" />
      </main>
    )
  }

  if (!project) {
    return (
      <main className="flex items-center justify-center h-full w-full">
        <h1>Nao encontramos esse projeto</h1>
        <p>volte para a listagem</p>
        <Link to="/projetos">Voltar</Link>
      </main>
    )
  }

  return (
    <section className="p-4 flex flex-col w-full h-full md:w-3/4 md:mx-auto">
      <h1>Detalhe do projeto {project.name}</h1>

        <Label htmlFor="name" className="text-left mt-4 font-bold">Nome</Label>
        <Input
          id="name"
          value={project.name}
          className="mt-2"
          readOnly
        />

        <Label htmlFor="description" className="text-left mt-4 font-bold">Descrição</Label>
        <Textarea
          id="description"
          value={project.description}
          className="mt-2 resize-none"
          readOnly
        />

        <Label htmlFor="internalobs" className="text-left mt-4 font-bold">Observação interna</Label>
        <Textarea
          id="internalobs"
          value={project.internalobs}
          className="mt-2 resize-none"
          readOnly
        />

        <Label htmlFor="hours" className="text-left mt-4 font-bold">Quantidade de horas</Label>
        <Input
          id="hours"
          value={project.hours}
          className="mt-2"
          readOnly
        />

        <Label className="text-left mt-4 font-bold">Cursos</Label>
        {
          project?.CoursesOnProjects.map(({ course }) => {
          return (
            <div key={`${project.slug}-course-${course.slug}`} className="flex items-center">
              <Input
                className="mt-2"
                defaultValue={`${course.name} - ${course.university.name}`}
                readOnly
              />
            </div>
          )
        })
        }

        <Label className="text-left mt-4 font-bold">Estudantes</Label>
        {
          project?.UsersOnProjects.map(({ user }) => {
          return (
            <div key={`${project.slug}-${user.id}`} className="flex items-center">
              <Input
                className="mt-2"
                defaultValue={`${user.name} - ${user.registration}`}
                readOnly
              />
            </div>
          )
        })
        }

      <footer className="flex flex-1 mt-5 justify-end">
        <Button
          onClick={() => console.info(changes)}
          className="bg-green-600"
         >
          Salvar
        </Button>
      </footer>
    </section>
  )
}
