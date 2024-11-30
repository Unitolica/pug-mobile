import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQueryClient, useQuery } from "@tanstack/react-query"
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

const CreateCourseSchema = z.object({
  identifier: z.string({ required_error: "Identificador unico eh requirido" }).min(3, {
    message: "Identificador deve conter no minimo 3 caracteres"
  }),
  name: z.string({ required_error: "Nome do curso eh requirido" }).min(7, {
    message: "Nome do curso deve conter no minimo 7 caracteres"
  }),
  acronym: z.string({ required_error: "Sigla do curso eh requirida" }).min(3, {
    message: "Sigla do curso deve conter no minimo 3 caracteres"
  }),
  internalobs: z.string().optional(),
  universities: z.array(z.string()).nonempty("Selecione ao menos uma universidade"),
})

type Course = z.infer<typeof CreateCourseSchema>

async function fetchCourses(): Promise<Course[]> {
  const random = Math.random() * 10
  console.info("random", random)
  if (random > 7)
    throw new Error("erro shjdkashkjdhkjash kjdhkj")

  await new Promise(resolve => setTimeout(resolve, 2000))
  return []
}

export default function CoursesHomePage() {
  const queryClient = useQueryClient()

  const { data: courses, isPending: isCoursesFetchPending, isError: isCoursesFetchError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
    retry: false
  })

  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      identifier: "",
      name: "",
      acronym: "",
      internalobs: "",
      universities: []
    }
  })

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [drawerOpen, setDialogOpen] = useState(false)

  async function onSubmit(formData: Course) {
    setIsSubmitLoading(true)
    toast({
      itemID: "create-course",
      title: "Usando os seguintes valores: ",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(formData, null, 2)}</code>
        </pre>
      ),
    })

    await new Promise(resolve => setTimeout(resolve, 2000))

    toast({
      itemID: "create-course",
      variant: "success",
      title: "Sucesso",
      description: "Curso criado com sucesso e ja disponivel na listagem",
    })
    setIsSubmitLoading(false)
    setDialogOpen(false)

    queryClient.setQueryData(["courses"], (current: Course[]) => [...current, formData])
  }

  function toggleDialog(value: boolean) {
    if (!value)
      form.reset()

    setDialogOpen(value)
  }

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indetificador Unico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="eng-software"
                            {...field}
                            onChange={(e) => {
                              const transformedValue = e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-");
                              field.onChange(transformedValue);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Informe um texto sem espacos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    name="acronym"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sigla do curso</FormLabel>
                        <FormControl>
                          <Input placeholder="Eng. Soft" {...field} />
                        </FormControl>
                        <FormDescription>
                          Uma sigla para que, quando necessario, o nome do curso possa ser contraido
                        </FormDescription>
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
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Selecione universidades" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {(["Jaragua do Sul - Rau", "Jaragua do Sul - Centro", "Joinville - Centro"]).map((uni) => (
                                <MultiSelectorItem key={uni} value={uni}>
                                  <span>{uni}</span>
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
                    <Button type="reset" variant="destructive" disabled={isSubmitLoading} onClick={() => toggleDialog(false)}>
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={isSubmitLoading}>
                      {isSubmitLoading && <Loader2Icon className="animate-spin" />}
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
          isCoursesFetchPending && (
            <Loader2Icon className="animate-spin" />
          )
        }

        {
          isCoursesFetchError
            ? (
              <>
                <h1>Ocorreu um erro ao listar os cursos, tente novamente mais tarde!</h1>
                <pre>
                  {JSON.stringify(error, null, 2)}
                </pre>
              </>
            )
            : (
              !isCoursesFetchPending && courses!.map(c => (
                <Accordion type="single" collapsible>
                  <AccordionItem value={c.identifier}>
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
