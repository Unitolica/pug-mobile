import { useState } from "react"
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Inbox } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { datesToDurationString } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { SkeletonTable } from "@/components/skeleton-table"

async function fetchHours(): Promise<Hour[]> {
  return await new Promise<Hour[]>(resolve => setTimeout(() => {
    resolve(new Array(10).fill("").map((_, index) => {
      const data: Hour = {
        user: {
          email: "gabriel04.rocha@catolicasc.edu.br",
          name: "Gabriel Rocha"
        },
        project: {
          id: "sdjhaskjd",
          name: "Robotica WickedBotz",
          course: {
            id: "jdhjashkd",
            name: "Engenharia de software"
          }
        },
        init: new Date(),
        end: new Date(new Date().setHours(23)),
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        id: String(index)
      }
      return data
    }))
  }, 2000))
}

export default function HoursPage() {
  const { isLoading, data, isError } = useQuery({
    queryFn: () => fetchHours(),
    queryKey: ["hours"]
  })

  return (
    <section className="mt-10 p-5">
      <h2 className="text-md py-3 font-bold">Registro de horas para aprovacao</h2>
      <HoursTable data={data} isLoading={isLoading} />
    </section>
  )
}

type Hour = {
  user: {
    email: string
    name: string
  }
  project: {
    id: string
    name: string
    course: {
      id: string
      name: string
    }
  },
  init: Date
  end: Date
  id: string
  description: string
}
function HoursTable({ data, isLoading }: { data?: Hour[], isLoading: boolean }) {
  const [showDetailHour, setShowDetailHour] = useState<boolean>(false)
  const [selectedHour, setSelecteHour] = useState<Hour | null>(null)

  function detailHour(hour: Hour) {
    setSelecteHour(hour)
    setShowDetailHour(true)

    console.info("hour", hour)
  }

  if (isLoading) return <SkeletonTable columns={4} />

  if (!data || data?.length <= 0) {
    return (
      <div className="overflow-x-auto flex flex-col items-center justify-center p-20 min-w-full rounded border border-zinc-600">
        <Inbox />
        <p className="text-center">
          Nenhuma atividade pendente de aprovacao
        </p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded border border-zinc-600">
      <Table className="min-w-full bg-white rounded">
        <TableCaption className="p-4 mt-0">
          Atividades que precisam de aprovacao para serem creditadas aos alunos
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="px-2 py-1 w-1/3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Projeto</p>
            </TableHead>

            <TableHead className="px-2 py-1 w-1/4 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Inicio</p>
            </TableHead>

            <TableHead className="px-2 py-1 w-1/4 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Fim</p>
            </TableHead>

            <TableHead className="px-2 py-1 w-1/3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <p>Acoes</p>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-2 py-2 w-1/3 text-center whitespace-no-wrap border-b border-gray-200">
                {item.project.name}
              </TableCell>

              <TableCell className="px-2 py-2 w-1/4 text-center whitespace-no-wrap border-b border-gray-200">
                {new Date(item.init).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </TableCell>

              <TableCell className="px-2 py-2 w-1/4 text-center whitespace-no-wrap border-b border-gray-200">
                {new Date(item.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </TableCell>

              <TableCell className="px-2 py-2 w-1/3 text-center whitespace-no-wrap border-b border-gray-200 underline">
                <span onClick={() => detailHour(item)}>
                  Detalhar
                </span>
                <DetailHourDialog show={showDetailHour} hour={selectedHour!} onClose={() => setShowDetailHour(false)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

async function updateHour(hour: Hour, status: "approve" | "deny", reason?: string) {
  return await new Promise((resolve, reject) => setTimeout(() => {
    const random = Math.random() * 10

    if (random > 5) reject()
    resolve(true)
  }, 1000))
}

function DetailHourDialog({ show, hour, onClose }: { show: boolean, hour: Hour, onClose: () => void }) {
  const { toast } = useToast()

  const [status, setStatus] = useState<"approve" | "deny" | undefined>(undefined)
  const [denyReason, setDenyReason] = useState<string | undefined>(undefined)

  function resetValue() {
    setStatus(undefined)
    setDenyReason(undefined)
  }

  const mutation = useMutation({
    mutationFn: () => updateHour(hour, status!, denyReason),
    onSuccess: () => {
      toast({
        itemID: "update-hour",
        title: "Sucesso",
        description: `Atividade ${status === "approve" ? "aprovada" : "recusada"} com sucesso!`,
        variant: "success"
      })
      resetValue()
      onClose()
    },
    onError: () => {
      toast({
        itemID: "update-hour",
        title: "Falha",
        description: `Houve um erro ao ${status === "approve" ? "aprovar" : "recusar"} atividade, tente novamente mais tarde.`,
        variant: "destructive"
      })
      resetValue()
      onClose()
    }
  })

  return (
    <Drawer open={show} dismissible={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Revisar atividade</DrawerTitle>
          <DrawerDescription>
            Aprovar ou reprovar a atividade de <span className="font-bold">{hour?.user.name}</span> para o projeto <span className="font-bold">{hour?.project.name}</span>.

            Ao aprovar essa atividade, <span className="font-bold">{datesToDurationString(new Date(hour?.end), new Date(hour?.init))}</span> serao creditadas ao saldo do estudante.
          </DrawerDescription>

          <Label htmlFor="matricula" className="text-left mt-4">Matricula</Label>
          <Input
            id="matricula"
            value={hour?.user.email}
            disabled
          />

          <Label htmlFor="date" className="text-left mt-4">Data</Label>
          <Input
            id="date"
            value={new Date(hour?.init).toLocaleDateString("pt-br")}
            disabled
          />

          <Label htmlFor="init" className="text-left mt-4">Inicio</Label>
          <Input
            id="init"
            value={new Date(hour?.init).toLocaleTimeString([], { hour12: false })}
            disabled
          />

          <Label htmlFor="end" className="text-left mt-4">Fim</Label>
          <Input
            id="end"
            value={new Date(hour?.end).toLocaleTimeString([], { hour12: false })}
            disabled
          />

          <Label htmlFor="status" className="text-left mt-4">Revisao</Label>
          <Select name="status" value={status as string} onValueChange={(value: "approve" | "deny") => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Aprovar ou reprovar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approve">Aprovar</SelectItem>
              <SelectItem value="deny">Reprovar</SelectItem>
            </SelectContent>
          </Select>

          {
            status === "deny" ? (
              <>
                <Label htmlFor="deny-reason" className="text-left mt-4">Motivo da recusa</Label>
                <Textarea
                  id="deny-reason"
                  value={denyReason}
                  onChange={(event) => setDenyReason(event.target.value)}
                  className="resize-none"
                />
              </>
            ) : (null)
          }

        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => {
              toast({
                itemID: "update-hour",
                title: "Registrando revisao...",
              })
              mutation.mutate()
            }}
            disabled={!status || (status === "deny" && !denyReason)}
          >
            Confirmar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
