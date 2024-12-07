import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { University } from "./UniversitiesHome"
import { api } from "@/services/api"

const CreateCourseSchema = z.object({
  name: z.string({ required_error: "Nome do curso eh requirido" }).min(7, {
    message: "Nome do curso deve conter no minimo 7 caracteres"
  }),
  abreviation: z.string({ required_error: "Abreviação do curso eh requirida" }).min(3, {
    message: "Sigla do curso deve conter no minimo 3 caracteres"
  }),
  internalobs: z.string().optional(),
  universities: z.array(z.string()).nonempty("Selecione ao menos uma universidade"),
})

type Course = z.infer<typeof CreateCourseSchema>

export default function CoursesHomePage() {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      name: "",
      abreviation: "",
      internalobs: "",
      universities: []
    }
  })

  const { data: courses, isLoading, isError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await api.get("/courses")
      return data
    },
  })

  const { isPending, mutate: createCourse } = useMutation({
    mutationFn: async (formData: Course) => {
      await api.post("/courses", formData)
    },
    onSuccess: () => {
      toast({
        itemID: "create-course",
        variant: "success",
        title: "Sucesso",
        description: "Curso criado com sucesso e ja disponivel na listagem",
      })

      queryClient.invalidateQueries({
        queryKey: ["courses"]
      })

      form.reset()
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error("error while creating course", error)
      toast({
        itemID: "create-course",
        variant: "destructive",
        title: "Falha!",
        description: "Ocorreu um erro ao registrar o curso, tente novamente mais tarde!",
      })
    }
  })

  const [drawerOpen, setDialogOpen] = useState(false)

  function toggleDialog(value: boolean) {
    if (!value)
      form.reset()

    setDialogOpen(value)
  }

  const universities = queryClient.getQueryData(["universities"]) as University[]

  return (
    <main className="p-5">
      <header className="flex justify-between items-center">
        <h1>Cursos</h1>

        <Dialog open={drawerOpen} onOpenChange={toggleDialog}>
          <DialogTrigger>
            <Button>
              Registrar novo curso
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registro de novo curso</DialogTitle>
              <DialogDescription>Aqui voce pode registrar um novo curso para que possa vincular os estudantes aos seus respectivos cursos</DialogDescription>
            </DialogHeader>

            <section className="flex flex-col justify-start w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(createCourse)} className="w-full space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do curso</FormLabel>
                        <FormControl>
                          <Input placeholder="Engenharia de software" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="abreviation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abreviação do nome do curso</FormLabel>
                        <FormControl>
                          <Input placeholder="Eng. Soft" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="universities"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Universidades</FormLabel>
                        <MultiSelector
                          onValuesChange={field.onChange}
                          values={field.value}
                          getLabel={(value) => universities.find(uni => uni.id === value).name}
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Selecione universidades" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {universities.map((uni) => (
                                <MultiSelectorItem key={uni.id} value={uni.id}>
                                  {uni.name}
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
                    name="internalobs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observacao interna</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          A observacao internao nao estara disponivel para os alunos, apenas para usuarios com o acesso administrativo dessa plataforma.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="flex flex-row justify-end gap-5 w-full">
                    <Button type="reset" variant="destructive" disabled={isPending} onClick={() => toggleDialog(false)}>
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2Icon className="animate-spin" />}
                      Criar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </section>
          </DialogContent>
        </Dialog>
      </header>

      <section className="w-full flex flex-col mt-5">
        {
          isLoading && (
            <Loader2Icon className="animate-spin" />
          )
        }

        {
          isError
            ? (
              <>
                <h1>Ocorreu um erro ao listar os cursos, tente novamente mais tarde!</h1>
                <pre>
                  {JSON.stringify(error, null, 2)}
                </pre>
              </>
            )
            : (
              !isLoading && courses!.map(c => (
                <Accordion type="single" collapsible>
                  <AccordionItem value={c.id}>
                    <AccordionTrigger>{c.name}</AccordionTrigger>
                    <AccordionContent>
                      <pre>
                        {JSON.stringify(c, null, 2)}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            )

        }
      </section>
    </main>
  )
}
