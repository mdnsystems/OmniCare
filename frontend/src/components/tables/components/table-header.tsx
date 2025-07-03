import { Table, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { flexRender, HeaderGroup } from "@tanstack/react-table";

interface TableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
}

export function DataTableHeader<TData>({ headerGroups }: TableHeaderProps<TData>) {
  return (
    <div className="flex-none">
      <Table>
        <TableHeader className="bg-muted">
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id} 
                  className="first:rounded-tl-md last:rounded-tr-md uppercase bg-muted whitespace-nowrap"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </div>
  );
} 