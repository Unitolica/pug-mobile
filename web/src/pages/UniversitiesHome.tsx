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

export type University = z.infer<typeof CreateUniversitySchema> & { id?: string }

async function fetchUniversities(): Promise<University[]> {
  const { data } = await api.get("/university")
  return data;
}

async function createUniversityAPI(formData: University): Promise<University> {
  await api.post("/university", formData);
  return formData
}
async function deleteUniversityAPI(id: string): Promise<void> {
  await api.delete(`/university/${id}`);
}

async function updateUniversityAPI(formData: University): Promise<University> {
  await api.put(`/university/${formData.identifier}`, formData);
  return formData;
}

export default function UniversitiesHomePage() {
  const queryClient = useQueryClient()

  const [drawerOpen, setDialogOpen] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const deleteMutation = useMutation({
    mutationFn: deleteUniversityAPI,
    onSuccess: (_, deletedId) => {
      toast({
        itemID: "delete-university",
        variant: "success",
        title: "Sucesso",
        description: "Universidade removida com sucesso!",
      })
      queryClient.setQueryData(["universities"], (current: University[]) =>
        current.filter(u => u.identifier !== deletedId)
      )
      setIsDeleteModalOpen(false)
    },
    onError: (err) => {
      const responseErrorMessage = err.response?.data?.message
      console.error("error while deleting university", err)
      toast({
        itemID: "delete-university",
        variant: "destructive",
        title: "Erro",
        description: responseErrorMessage ?? "Ocorreu um erro ao tentar remover a universidade. Tente novamente.",
      })
    }
  });
  const updateMutation = useMutation({
    mutationFn: updateUniversityAPI,
    onSuccess: (updatedUniversity) => {
      toast({
        itemID: "update-university",
        variant: "success",
        title: "Sucesso",
        description: "Universidade atualizada com sucesso!",
      })
      queryClient.setQueryData(["universities"], (current: University[]) =>
        current.map(u => u.identifier === updatedUniversity.identifier ? updatedUniversity : u)
      )
      setSelectedUniversity(null)
    },
    onError: (err) => {
      console.error("error while updating university", err)
      toast({
        itemID: "update-university",
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao tentar atualizar a universidade. Tente novamente.",
      })
    }
  });


  function toggleDialog(value: boolean) {
    if (!value) {
      form.reset()
      setSelectedUniversity(null)
    }
    setDialogOpen(value)
  }

  const onSubmit = (formData: University) => {
    if (selectedUniversity) {
      updateMutation.mutate(formData)
    } else {
      mutate(formData)
    }
  }
  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    form.reset(university);
  };

  const handleDelete = (university: University) => {
    setSelectedUniversity(university);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUniversity) {
      deleteMutation.mutate(selectedUniversity.id!);
    }
  };


  return (
    <main className="p-5 md:w-3/4 md:mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Universidades</h1>

        <Dialog open={drawerOpen} onOpenChange={toggleDialog}>
          <DialogTrigger>
            <Button>
              Cadastrar
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
                <AccordionItem value={`university-${u.id}`} key={`university-${u.id}`} className="last:border-b-0 backdrop-blur-sm bg-zinc-100 p-2 border rounded-sm mt-2">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-4">
                      {u.description && (
                        <div>
                          <h3 className="mb-1 font-bold">Descrição</h3>
                          <p className="text-sm text-muted-foreground">{u.description}</p>
                        </div>
                      )}

                      {u.internalobs && (
                        <div>
                          <h3 className="mb-1 font-bold">Observações Internas</h3>
                          <p className="text-sm text-muted-foreground">{u.internalobs}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(u)}>
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(u)}>
                          Remover
                        </Button>


                        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                          <DialogContent>
                            <DialogTitle>
                              {selectedUniversity ? "Editar universidade" : "Registro de uma nova universidade"}
                            </DialogTitle>
                            <DialogHeader>
                              <DialogTitle>Confirmar Remoção</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja remover a universidade "{selectedUniversity?.name}"?
                                Esta ação não pode ser desfeita.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending && <Loader2Icon className="animate-spin mr-2" />}
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                      </div>

                    </div>
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

