import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { SkeletonTable } from "@/components/skeleton-table"
import { datesToDurationString, periodToDateRange } from "@/lib/utils"

interface TimeLog {
  id: string
  userId: string
  projectId: string
  init: string
  geolocalization: string
  end: string
  description: string
  requestedBy: {
    name: string
    registration: string
  }
  project: {
    name: string
  }
}

export default function DashboardHome() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: timeLogs, isLoading } = useQuery({
    queryKey: ["pending-time-logs"],
    queryFn: async () => {
      const response = await api.get<TimeLog[]>("project/activity/pending")
      return response.data
    },
  })

  const reviewMutation = useMutation({
    mutationFn: async ({
      timeLogId,
      status,
    }: {
      timeLogId: string
      status: "APPROVED" | "REJECTED"
    }) => {
      await api.patch(`project/activity/${timeLogId}/review`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-time-logs"] })
      toast({
        title: "Sucesso",
        description: "Registro de horas atualizado com sucesso",
      })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar registro de horas",
        variant: "destructive",
      })
    },
  })

  return (
    <main className="p-4 space-y-6 md:w-3/4 md:mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="font-bold">Oi, {user!.name}</h1>
      </header>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Atividades Pendentes de Revisão</h2>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      Nenhum registro pendente de revisão
                    </TableCell>
                  </TableRow>
                ) : (
                  timeLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.requestedBy.name} - {log.requestedBy.registration}</TableCell>
                      <TableCell>{log.project.name}</TableCell>
                      <TableCell>
                        {format(new Date(log.end), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        { datesToDurationString(new Date(log.end), new Date(log.init)) }
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.description || "Sem descrição"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            reviewMutation.mutate({
                              timeLogId: log.id,
                              status: "APPROVED",
                            })
                          }
                          disabled={reviewMutation.isPending}
                          className="bg-green-700 hover:bg-green-800"
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            reviewMutation.mutate({
                              timeLogId: log.id,
                              status: "REJECTED",
                            })
                          }
                          disabled={reviewMutation.isPending}
                        >
                          Rejeitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </main>
  )
}
