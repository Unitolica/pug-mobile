import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormLabel,
  FormDescription,
  FormItem,
  FormMessage,
  FormField
} from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const CreateStudentSchema = z.object({
  name: z.string({ required_error: "Nome obrigatório" }),
  email: z.string({ required_error: "Email obrigatório" }),
  password: z.string({ required_error: "Senha obrigatória" }),
  registration: z.string({ required_error: "Matrícula obrigatória" }),
  courses: z.array(z.string()).nonempty("Selecione ao menos um curso"),
})

type Student = z.infer<typeof CreateStudentSchema>

async function registerStudent(student: Student) {
  console.info("creating student", student)
  await new Promise(resolve => setTimeout(resolve, 2000))
}

async function fetchStudents(): Promise<Student[]> {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return []
}

export default function StudentsHomePage() {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<Student>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      registration: "",
      courses: [],
    },
    resolver: zodResolver(CreateStudentSchema),
  })

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetchStudents(),
  })

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      queryClient.setQueryData(["students"], (current: Student[]) => [...current, form.getValues()])
      setIsDialogOpen(false)
      form.reset()
    }
  })

  function onSubmit(data: Student) {
    createUser(data);
  }

  return (
    <section className="p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-md py-3 font-bold">Estudantes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button>Cadastrar</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Estudante</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo estudante
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        getLabel={(value) => [].find(uni => uni.id === value)?.name ?? ""}
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Selecione curso(s)" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {[].map((uni) => (
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

                <DialogFooter className="flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2Icon className="mr-1 animate-spin" /> }
                    <span>Cadastrar</span>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="mt-5">
        {
          isLoading
          ? (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin h-5 w-5" />
            </div>
          )
          : (
            <Accordion type="single" collapsible>
              {
                students!.map((s) => (
                  <AccordionItem value={`student-${s.name}`} key={`student-${s.name}`}>
                    <AccordionTrigger>{s.name}</AccordionTrigger>
                    <AccordionContent>
                      <pre>{JSON.stringify(s, null, 2)}</pre>
                    </AccordionContent>
                  </AccordionItem>
                ))
              }
            </Accordion>
          )
        }
      </main>
    </section>
  )
}