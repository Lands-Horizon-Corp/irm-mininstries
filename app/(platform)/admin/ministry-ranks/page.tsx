"use client"

import { useCallback, useMemo, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Loader2, Plus } from "lucide-react"

import type { MinistryRanks } from "@/types/common"
import type { MinistryRanksFormData } from "@/lib/ministry-ranks-schema"
import { useMinistryRanks } from "@/hooks/use-ministry-ranks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import MinistryRanksForm from "@/components/admin/ministry-ranks-form"

const PAGE_SIZE = 10

export default function MinistryRanksAdminPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingRank, setEditingRank] = useState<MinistryRanks | null>(null)
  const [search, setSearch] = useState("")
  const {
    ministryRanks,
    isLoading,
    createMinistryRank,
    updateMinistryRank,
    deleteMinistryRank,
    isCreating,
    isDeleting,
    refetch,
  } = useMinistryRanks()

  const filteredRanks = useMemo(() => {
    return ministryRanks.filter(rank =>
      rank.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [ministryRanks, search])

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteMinistryRank(id)
      refetch()
    },
    [deleteMinistryRank, refetch]
  )

  const columns = useMemo<ColumnDef<MinistryRanks>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: info => info.getValue(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => handleDelete(row.original.id)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [isDeleting, handleDelete]
  )

  const [pageIndex, setPageIndex] = useState(0)
  const pageCount = Math.ceil(filteredRanks.length / PAGE_SIZE)
  const table = useReactTable({
    data: filteredRanks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    state: { pagination: { pageIndex, pageSize: PAGE_SIZE } },
    onPaginationChange: updater => {
      if (typeof updater === "function") {
        const nextState = updater({ pageIndex, pageSize: PAGE_SIZE })
        setPageIndex(nextState.pageIndex)
      } else {
        setPageIndex(updater.pageIndex)
      }
    },
    manualPagination: false,
  })

  function handleEdit(rank: MinistryRanks) {
    setEditingRank(rank)
    setShowForm(true)
  }

  async function handleFormSubmit(data: MinistryRanksFormData) {
    if (editingRank) {
      await updateMinistryRank({ id: editingRank.id, data })
    } else {
      await createMinistryRank(data)
    }
    setShowForm(false)
    setEditingRank(null)
    refetch()
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Ministry Ranks</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className='w-4 h-4 mr-2' /> Add Rank
        </Button>
      </div>
      <div className='mb-4'>
        <Input
          placeholder='Search by name...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='max-w-xs'
        />
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center h-40'>
          <Loader2 className='animate-spin w-8 h-8' />
        </div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className='mt-4 flex justify-center'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (pageIndex > 0) setPageIndex(pageIndex - 1)
                }}
                isActive={pageIndex !== 0}
                aria-disabled={pageIndex === 0}
                tabIndex={pageIndex === 0 ? -1 : 0}
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={i === pageIndex}
                  onClick={() => setPageIndex(i)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPageIndex(Math.min(pageCount - 1, pageIndex + 1))
                }
                aria-disabled={pageIndex === pageCount - 1}
                tabIndex={pageIndex === pageCount - 1 ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <MinistryRanksForm
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingRank(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={
          editingRank
            ? { name: editingRank.name, description: editingRank.description }
            : null
        }
        isLoading={isCreating}
      />
    </div>
  )
}
