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
import { api } from "@/services/api"

const CreateUniversitySchema = z.object({
  identifier: z.string({ required_error: "Identificador unico eh requirido" }).min(3, {
    message: "Identificador deve conter no minimo 3 caracteres"
  }),
  name: z.string({ required_error: "Nome do curso eh requirido" }).min(7, {
    message: "Nome do curso deve conter no minimo 7 caracteres"
  }),
  description: z.string().optional(),
  internalobs: z.string().optional(),
})

export type University = z.infer<typeof CreateUniversitySchema>

async function fetchUniversities(): Promise<University[]> {
  const { data } = await api.get("/university")
  return data;
}

async function createUniversityAPI(formData: University): Promise<University> {
  await api.post("/university", formData);
  return formData
}

export default function UniversitiesHomePage() {
  const queryClient = useQueryClient()

  const { data: universities, isPending: isUniversitiesFetchPending, isError: isUniversitiesFetchError, error } = useQuery<University[]>({
    queryKey: ["universities"],
    queryFn: () => fetchUniversities(),
    retry: false
  })

  const form = useForm<z.infer<typeof CreateUniversitySchema>>({
    resolver: zodResolver(CreateUniversitySchema),
    defaultValues: {
      identifier: "",
      name: "",
      description: "",
      internalobs: ""
    }
  })

  const [drawerOpen, setDialogOpen] = useState(false)

  const { mutate, isPending: isSubmitLoading } = useMutation({
    mutationFn: createUniversityAPI,
    onSuccess: (data: University) => {
      toast({
        itemID: "create-university",
        variant: "success",
        title: "Sucesso",
        description: "Universidade registrada com sucesso!",
      })
      queryClient.setQueryData(["universities"], (current: University[]) => [...current, data])
      setDialogOpen(false)
    },
    onError: (err) => {
      console.error("error while creating university", err)
      toast({
        itemID: "create-university",
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao tentar registrar a universidade. Tente novamente.",
      })
    }
  });

  function toggleDialog(value: boolean) {
    if (!value) form.reset()
    setDialogOpen(value)
  }

  const onSubmit = (formData: University) => {
    toast({
      itemID: "create-university",
      title: "Usando os seguintes valores: ",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(formData, null, 2)}</code>
        </pre>
      ),
    })

    mutate(formData)
  }

  return (
    <main className="p-5">
      <header className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Universidades</h1>

        <Dialog open={drawerOpen} onOpenChange={toggleDialog}>
          <DialogTrigger>
            <Button>
              Registrar uma universidade
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registro de uma nova universidade</DialogTitle>
              <DialogDescription>
                Aqui voce pode cadastrar uma universidade para vincular cursos e estudantes
              </DialogDescription>
            </DialogHeader>

            <section className="flex flex-col justify-start w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identificador Único</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="jaragua-do-sul-rau"
                            {...field}
                            onChange={(e) => {
                              const transformedValue = e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-");
                              field.onChange(transformedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da universidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Unidade Jaragua do Sul - Rau" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" placeholder="Unidade localizada no bairro XXXXX" {...field} />
                        </FormControl>
                        <FormDescription>
                          Uma descrição breve para facilitar a identificação na listagem das universidades cadastradas
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
                        <FormLabel>Observação interna</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          A observação interna não estará disponível para os alunos, apenas para usuários com acesso administrativo.
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
        {isUniversitiesFetchPending && <Loader2Icon className="animate-spin" />}
        {isUniversitiesFetchError ? (
          <>
            <h1>Ocorreu um erro ao listar as universidades, tente novamente mais tarde!</h1>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </>
        ) : (
          !isUniversitiesFetchPending &&
          <Accordion type="single" collapsible>
            {
              universities!.map((u) => (
                <AccordionItem value={`university-${u.id}`} key={`university-${u.id}`}>
                  <AccordionTrigger>{u.name}</AccordionTrigger>
                  <AccordionContent>
                    <pre>{JSON.stringify(u, null, 2)}</pre>
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        )}
      </section>
    </main>
  )
}

