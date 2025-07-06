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

import type { MinistrySkills } from "@/types/common"
import type { MinistrySkillsFormData } from "@/lib/ministry-skills-schema"
import { useMinistrySkills } from "@/hooks/use-ministry-skills"
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
import MinistrySkillsForm from "@/components/admin/ministry-skills-form"

const PAGE_SIZE = 10

export default function MinistrySkillsAdminPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<MinistrySkills | null>(null)
  const [search, setSearch] = useState("")
  const {
    ministrySkills,
    isLoading,
    createMinistrySkill,
    updateMinistrySkill,
    deleteMinistrySkill,
    isCreating,
    isDeleting,
    refetch,
  } = useMinistrySkills()

  const filteredSkills = useMemo(
    () =>
      ministrySkills.filter(skill =>
        skill.name.toLowerCase().includes(search.toLowerCase())
      ),
    [ministrySkills, search]
  )

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteMinistrySkill(id)
      refetch()
    },
    [deleteMinistrySkill, refetch]
  )

  const columns = useMemo<ColumnDef<MinistrySkills>[]>(
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
        cell: ({ row }) => {
          const skill = row.original
          return (
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setEditingSkill(skill)
                  setShowForm(true)
                }}
              >
                Edit
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => handleDelete(skill.id)}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          )
        },
      },
    ],
    [isDeleting, handleDelete]
  )

  const table = useReactTable({
    data: filteredSkills,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredSkills.length / PAGE_SIZE),
  })

  const handleSubmit = useCallback(
    async (data: MinistrySkillsFormData) => {
      if (editingSkill) {
        await updateMinistrySkill({ id: editingSkill.id, data })
      } else {
        await createMinistrySkill(data)
      }
      setShowForm(false)
      setEditingSkill(null)
      refetch()
    },
    [editingSkill, createMinistrySkill, updateMinistrySkill, refetch]
  )

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Ministry Skills</h1>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingSkill(null)
          }}
        >
          <Plus className='w-4 h-4 mr-2' /> Add Skill
        </Button>
      </div>
      <div className='mb-4'>
        <Input
          placeholder='Search skills...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto'>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center'>
                  <Loader2 className='mx-auto animate-spin' />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className='mt-4 flex justify-center'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                isActive={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={table.getState().pagination.pageIndex === i}
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                isActive={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <MinistrySkillsForm
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingSkill(null)
        }}
        onSubmit={handleSubmit}
        initialData={
          editingSkill
            ? { name: editingSkill.name, description: editingSkill.description }
            : null
        }
        isLoading={isCreating}
      />
    </div>
  )
}
