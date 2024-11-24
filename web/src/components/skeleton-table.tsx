import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
} from "@/components/ui/table"

export function SkeletonTable({ columns }: { columns: number }) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-600">
      <Table className="min-w-full rounded">
        <TableHeader>
          <TableRow>
            {[...Array(columns).map((_, index) => (
              <TableHead key={index} className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              </TableHead>
            ))]}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            [...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {
                  [...Array(columns)].map((_, inIndex) => (
                    <TableCell key={inIndex} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </TableCell>
                  ))
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}
