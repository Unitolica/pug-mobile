import { useState } from "react"
import { z } from "zod"
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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { SkeletonTable } from "@/components/skeleton-table"
import { Inbox, Loader2Icon } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multi-select"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"

const CreateProjectSchema = z.object({
  name: z.string({ required_error: "Nome do projeto eh requirido" }).min(7, {
    message: "Nome do projeto deve conter no minimo 7 caracteres"
  }),
  courses: z.array(z.string()).nonempty("Selecione ao menos um curso"),
  description: z.string().optional(),
  internalobs: z.string().optional(),
  hours: z.number({ required_error: "Horas eh requerida" }).min(1, {
    message: "Projeto deve conter no minimo 1 hora"
  }),
})

export type Project = z.infer<typeof CreateProjectSchema>

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [params, setParams] = useSearchParams()

  const [createProjectDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string>(params.get("curso") ?? "")

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: "",
      courses: [],
      description: "",
      internalobs: "",
      hours: 1
    }
  })

  const courses = queryClient.getQueryData(["courses"]) as any

  const { isLoading: isLoadingProjects, data: projects } = useQuery({
    queryFn: async () => {
      const { data } = await api.get(`/project${selectedCourse && selectedCourse !== "*" ? `?course=${selectedCourse}` : ""}`)
      return data
    },
    queryKey: ["projects", selectedCourse],
  })

  const { data: linkRequests } = useQuery({
    queryKey: ["link-requests"],
    queryFn: async () => {
      const { data } = await api.get("/project/link-requests")
      return data
    },
    initialData: []
  });

  const respondLinkRequestMutation = useMutation({
    mutationFn: async (data: { userId: string, projectId: string, response: "ACCEPTED" | "REJECTED" }) => {
      await api.post("/project/respond-link-request", data)
    },
    onSuccess: () => {
      toast({
        itemID: "link-respond",
        title: "Sucesso",
        variant: "success",
        description: "Solicitação de acesso foi respondida com sucesso",
      })
      queryClient.invalidateQueries({
        queryKey: ["link-requests"]
      })
    },
    onError: (error) =>{
      console.error("error while responding to a link request", error)
      toast({
        itemID: "link-respond",
        title: "Falha!",
        description: "Ocorreu um erro ao responder a solicitação de acesso, tente novamente mais tarde!",
        variant: "destructive"
      })
    },
    retry: false
  })

  const { isPending, mutate: createProject } = useMutation({
    mutationFn: async (data: Project) => {
      await api.post("/project", data)
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        variant: "success",
        description: "Projeto criado com sucesso e ja disponivel na listagem",
      })
      queryClient.invalidateQueries({
        queryKey: ["projects"]
      })
      form.reset()
      setCreateDialogOpen(false)
    },
    onError: (error) => {
      console.error("error while creating project", error)
      toast({
        title: "Falha!",
        description: "Ocorreu um erro ao registrar o projeto, tente novamente mais tarde!",
        variant: "destructive"
      })
    }
  })

  function selectCourse(newVal: string) {
    setSelectedCourse(newVal)
    params.set("curso", newVal)

    if (newVal === "*")
      params.delete("curso")

    setParams(params)
  }

  function toggleDialog(value: boolean) {
    if (!value) form.reset()
    setCreateDialogOpen(value)
  }

  if (courses.length < 1) {
    return (
      <section className="mt-10 p-5 flex flex-col items-center justify-center text-center">
        <h2 className="font-bold text-lg">Cadastre ao menos um curso para poder registrar novos projetos.</h2>
        <Link to="/cursos" className="underline">
          Ir para pagina de cursos
        </Link>
      </section>
    )
  }

  return (
    <section className="mt-10 p-5 md:w-3/4 md:mx-auto">
      <header className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-md py-3 font-bold">Projetos</h2>

          <Dialog open={createProjectDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger>
              <Button>Cadastrar</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Criar um novo projeto
                </DialogTitle>
                <DialogDescription>
                  Esse curso ficara disponivel para todos os alunos atrelados aos mesmos cursos que esse projeto
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(createProject)} className="w-full space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do projeto</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de horas por estudante</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courses"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Cursos</FormLabel>
                        <MultiSelector
                          onValuesChange={field.onChange}
                          values={field.value}
                          getLabel={(value) => {
                            const c = courses.find(c => c.id === value)
                            return `${c.name} - ${c.university.name}`
                          }}
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Selecione os cursos" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {courses.map((c) => (
                                <MultiSelectorItem key={c.id} value={c.id}>
                                  {c.name} - {c.university.name}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descricao do projeto</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Descreva brevemente o projeto. Essa descricao sera exibida na listagem de projetos para os estudantes dos cursos selecionados.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="internalobs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observacao interna</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          A observacao internao nao estara disponivel para os estudantes, apenas para usuarios com o acesso administrativo da plataforma.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="flex flex-row justify-end gap-5 w-full">
                    <Button type="reset" onClick={() => toggleDialog(false)} disabled={isPending}>
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2Icon className="animate-spin" />}
                      Criar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Select value={selectedCourse} onValueChange={selectCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"*"}>Todos</SelectItem>
            {
              courses.map(course => (
                <SelectItem key={`course-filter-option-${course.id}`} value={course.id}>{course.name} - {course.university.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </header>

      <main className="mt-5">
        <ProjectsTable data={projects} isLoading={isLoadingProjects} />

        {
          linkRequests.length > 0 && (
            <div className="mt-5">
              <h2 className="text-md py-3 font-bold">Solicitações de acesso</h2>
              <div className="flex flex-col gap-5 mt-5">
                {
                  linkRequests.map(linkRequest => (
                    <div key={linkRequest.id} className="flex flex-col gap-2 p-5 border border-zinc-600 rounded">
                      <p><span className="font-bold">Estudante: </span> {linkRequest.user.name} - {linkRequest.user.email} - {linkRequest.user.registration}</p>
                      <p><span className="font-bold">Projeto: </span>{linkRequest.project.name} - {linkRequest.project.hours} h</p>
                      <p><span className="font-bold">Curso: </span>{linkRequest.user.UserOnCourses.map(({ course }) => `${course.name} - ${course.university.name}`).join(", ")}</p>
                      <div className="mt-1">
                        <p className="font-bold">Responder</p>

                        <div className="flex flex-row gap-2">
                          <Button
                            className="bg-green-900"
                            onClick={() => respondLinkRequestMutation.mutate({ projectId: linkRequest.project.id, userId: linkRequest.user.id, response: "ACCEPTED" })}
                            disabled={respondLinkRequestMutation.isPending}
                          >
                            Aceitar
                          </Button>
                          <Button
                            className="bg-red-800"
                            onClick={() => respondLinkRequestMutation.mutate({ projectId: linkRequest.project.id, userId: linkRequest.user.id, response: "REJECTED" })}
                            disabled={respondLinkRequestMutation.isPending}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </main>
    </section>
  )
}

function ProjectsTable({ data, isLoading }: { data?: Project[], isLoading: boolean }) {
  if (isLoading) return <SkeletonTable columns={4} />

  if (!data || data?.length <= 0) {
    return (
      <div className="overflow-x-auto flex flex-col items-center justify-center p-20 min-w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
        <Inbox className="w-12 h-12 text-zinc-400" />
        <p className="text-center mt-4 text-zinc-500 dark:text-zinc-400">
          Nenhum projeto cadastrado
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40%] font-semibold">Nome</TableHead>
            <TableHead className="w-[20%] text-center font-semibold">Horas</TableHead>
            <TableHead className="w-[20%] text-center font-semibold">Status</TableHead>
            <TableHead className="w-[20%] text-center font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={item.id}
              className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <TableCell className="font-medium">
                {item.name}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {item.hours}h
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Ativo
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Link 
                  to={`/projetos/${item.id}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
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