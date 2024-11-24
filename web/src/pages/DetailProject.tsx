import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { CheckIcon, LoaderIcon, TrashIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Course, Project, ProjetStatus, Teacher } from "@/types"
import { useToast } from "@/hooks/use-toast"

async function fetchProject(slug: string) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = Math.floor(Math.random() * 10)
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
}

async function updateProject(changes: ProjectChanges) {
  console.info("changes", changes)
}


type ProjectChanges = {
  hours: number | undefined
  status: string | undefined
  addedCourses: Course[]
  removedCourses: Course[]
  addedResponsibles: Teacher[]
  removedResponsibles: Teacher[]
}
export default function DetailProjectPage() {

  const { pslug } = useParams()
  const { toast } = useToast()


  const [changes, setChanges] = useState<ProjectChanges>({
    status: undefined,
    hours: undefined  ,
    addedCourses: [],
    removedCourses: [],
    addedResponsibles: [],
    removedResponsibles: [],
  })
  const [confirmText, setConfirmText] = useState("")

  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [showResponsibleDialog, setShowResponsibleDialog] = useState(false)

  const [responsible, setResponsible] = useState<Teacher>({
    email: "",
    name: "",
  })


  if (!pslug)
    throw new Error("pslug param is requried")

  const { isLoading, data: project } = useQuery({
    queryFn: () => fetchProject(pslug),
    queryKey: ["project", pslug]
  })

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });
      setChanges({
        hours: undefined,
        status: undefined,
        addedCourses: [],
        removedCourses: [],
        addedResponsibles: [],
        removedResponsibles: []
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message ?? "Ocorreu um erro ao tentar atualizar o projeto. Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  function handleTextChange (
    field: 'hours' | 'status',
    value: string | number
  ) {
    if (project?.[field] === value) {
      const newChanges = { ...changes };
      delete newChanges[field];
      setChanges(newChanges);
    } else {
      setChanges(prev => ({ ...prev, [field]: value }));
    }
  };


  function handleCourseChange(course: Course, isAdding: boolean) {
    setChanges(prev => {
      const newChanges = { ...prev };

      if (isAdding) {
        if (newChanges.removedCourses.map(c => c.slug).includes(course.slug)) {
          newChanges.removedCourses = newChanges.removedCourses.filter(c => c.slug !== course.slug);
        } else {
          const wasOriginallyInProject = project?.courses.some(c => c.slug === course.slug);
          if (!wasOriginallyInProject && !newChanges.addedCourses.map(c => c.slug).includes(course.slug)) {
            newChanges.addedCourses.push(course);
          }
        }
      } else {
        if (newChanges.addedCourses.map(c => c.slug).includes(course.slug)) {
          newChanges.addedCourses = newChanges.addedCourses.filter(c => c.slug !== course.slug);
        } else {
          const wasOriginallyInProject = project?.courses.some(c => c.slug === course.slug);
          if (wasOriginallyInProject && !newChanges.removedCourses.map(c => c.slug).includes(course.slug)) {
            newChanges.removedCourses.push(course);
          }
        }
      }

      return newChanges;
    });

    setConfirmText("")
    setShowCourseDialog(false)
  }

  function handleResponsibleChange(responsible: Teacher, isAdding: boolean) {
    setChanges(prev => {
      const newChanges = { ...prev };

      if (isAdding) {
        if (newChanges.removedResponsibles.map(r => r.email).includes(responsible.email)) {
          newChanges.removedResponsibles = newChanges.removedResponsibles.filter(
            r => r.email !== responsible.email
          );
        } else {
          const wasOriginallyInProject = project?.responsibles.some(
            r => r.email === responsible.email
          );
          if (!wasOriginallyInProject && !newChanges.addedResponsibles.map(r => r.email).includes(responsible.email)) {
            newChanges.addedResponsibles.push(responsible);
          }
        }

        setResponsible({ email: "", name: "" })
      } else {
        if (newChanges.addedResponsibles.map(r => r.email).includes(responsible.email)) {
          newChanges.addedResponsibles = newChanges.addedResponsibles.filter(
            r => r.email !== responsible.email
          );
        } else {
          const wasOriginallyInProject = project?.responsibles.some(
            r => r.email === responsible.email
          );
          if (wasOriginallyInProject && !newChanges.removedResponsibles.map(r => r.email).includes(responsible.email)) {
            newChanges.removedResponsibles.push(responsible);
          }
        }
      }

      return newChanges;
    });

    setConfirmText("")
    setShowResponsibleDialog(false)
  }

  function hasChanges () {
    return (
      changes.hours !== undefined ||
      changes.addedCourses.length > 0 ||
      changes.removedCourses.length > 0 ||
      changes.addedResponsibles.length > 0 ||
      changes.removedResponsibles.length > 0
    );
  };

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
    <section className="p-4 flex flex-col w-full h-full">
      <h1>Detalhe do projeto {project.name}</h1>
      <p>{pslug}</p>

        <Label htmlFor="name" className="text-left mt-4">Nome</Label>
        <Input
          id="name"
          value={project.name}
          disabled
          className="mt-2"
        />

        <Label htmlFor="hours" className="text-left mt-4">Quantidade de horas</Label>
        <Input
          id="hours"
          value={project.hours}
          onChange={(e) => handleTextChange('status', e.target.value)}
          className="mt-2"
        />

        <Label htmlFor="status" className="text-left mt-4 pb-2">Status</Label>

        <Select
          name="status"
          value={project?.status as unknown as string}
          onValueChange={(newStatus) => handleTextChange('status', newStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="disabled">Inativo</SelectItem>
          </SelectContent>
        </Select>
        <small className="text-justify text-gray-500 mt-1">
          Projetos com o status <strong>inativo</strong> ficarao indisponiveis para selecao por parte dos estudantes.
        </small>


        <Label className="text-left mt-4">Cursos</Label>
        {
          project?.courses.concat(changes.addedCourses).map(course => {
          if (changes.removedCourses.map(c => c.slug).includes(course.slug))
            return null

          return (
            <div key={`${project.slug}-course-${course.slug}`} className="flex items-center">
              <Input
                className="mt-2"
                defaultValue={course.name}
                readOnly
              />
              <Dialog open={showCourseDialog} onOpenChange={(val) => setShowCourseDialog(val)}>
                <DialogTrigger>
                  <TrashIcon
                    className="text-red-400 ml-3"
                  />
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Atencao</DialogTitle>
                    <DialogDescription>
                      Deseja mesmo remover o vinculodo do curso <strong>{course.name}</strong> com o projeto <strong>{project?.name}</strong>?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="confirm-input">
                        Digite <strong>confirmar</strong> para remover o vinculo.
                      </Label>
                      <Input
                        id="confirm-input"
                        onChange={(e) => setConfirmText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start space-y-2 flex flex-col">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancelar
                      </Button>
                    </DialogClose>

                    <Button
                      disabled={confirmText !== "confirmar"}
                      onClick={() => handleCourseChange(course, false)}
                      variant="destructive"
                    >
                      Remover
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )
        })
        }

        <Label htmlFor="responsible-input" className="text-left mt-4">Responsaveis</Label>
        <div className="flex items-center">
          <Input
            id="responsible-input"
            value={responsible.email}
            onChange={(e) => setResponsible((curr) => ({ ...curr, email: e.target.value }))}
            onKeyDown={(e) => {
              if (e.code === "Enter")
                handleResponsibleChange(responsible, true)
            }}
            className="mt-2"
          />

          <CheckIcon
            className="text-green-400 ml-3"
            onClick={() => handleResponsibleChange(responsible, true)}
          />
        </div>
        <small className="text-justify text-gray-500 mt-1">
          Digite o email do responsavel que voce deseja adicionar
        </small>

        {
          project?.responsibles.concat(changes.addedResponsibles).map(r => {
          if (changes.removedResponsibles.map(re => re.email).includes(r.email))
            return null

          return (
            <div key={`${project.slug}-responsible-${r.name}`} className="flex items-center mt-2">
              <Input
                defaultValue={`${r.name} - ${r.email}`}
                readOnly
              />
              <Dialog open={showResponsibleDialog} onOpenChange={(val) => setShowResponsibleDialog(val)}>
                <DialogTrigger>
                  <TrashIcon
                    className="text-red-400 ml-3"
                  />
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Atencao</DialogTitle>
                    <DialogDescription>
                      Deseja mesmo remover <strong>{r.name} ({r.email})</strong> da lista de responsaveis pelo projeto <strong>{project?.name}</strong>?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="confirm-input">
                        Digite <strong>confirmar</strong> para remover o responsavel.
                      </Label>
                      <Input
                        id="confirm-input"
                        onChange={(e) => setConfirmText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start space-y-2 flex flex-col">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancelar
                      </Button>
                    </DialogClose>

                    <Button
                      disabled={confirmText !== "confirmar"}
                      onClick={() => handleResponsibleChange(r, false)}
                      variant="destructive"
                    >
                      Remover
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )
        })
        }
      <footer className="flex flex-1 mt-5 justify-end">
        <Button
          onClick={() => updateProjectMutation.mutate(changes)}
          disabled={!hasChanges() || updateProjectMutation.isPending}
          className="bg-green-600"
         >
          Salvar alteracoes
        </Button>
      </footer>
    </section>
  )
}
