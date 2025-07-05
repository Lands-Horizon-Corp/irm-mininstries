"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Loader2, Plus } from "lucide-react"

import type { ContactUs } from "@/types/common"
import type { ContactUsFormData } from "@/lib/contact-us-schema"
import { useContactUs } from "@/hooks/use-contact-us"
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
import ContactUsForm from "@/components/admin/contact-us-form"

const PAGE_SIZE = 10

export default function ContactUsAdminPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactUs | null>(null)
  const [search, setSearch] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const {
    contactUs,
    isLoading,
    createContactUs,
    deleteContactUs,
    isCreating,
    isDeleting,
    refetch,
  } = useContactUs()

  // Filtered and paginated data
  const filtered = contactUs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  )

  const columns: ColumnDef<ContactUs>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "contactNumber", header: "Contact Number" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: info => new Date(info.row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: info => new Date(info.row.original.updatedAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: info => (
        <Button
          variant='destructive'
          size='sm'
          onClick={() => handleDelete(info.row.original.id)}
          disabled={isDeleting}
        >
          Delete
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: paginated,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    state: { pagination: { pageIndex, pageSize: PAGE_SIZE } },
    onPaginationChange: updater => {
      // updater can be a function or a PaginationState object
      if (typeof updater === "function") {
        const nextState = updater({ pageIndex, pageSize: PAGE_SIZE })
        setPageIndex(nextState.pageIndex)
      } else {
        setPageIndex(updater.pageIndex)
      }
    },
  })

  const handleSubmit = async (data: ContactUsFormData) => {
    if (editingContact) {
      // Optionally implement update logic
    } else {
      await createContactUs(data)
    }
    setShowForm(false)
    setEditingContact(null)
    refetch()
  }

  const handleDelete = async (id: number) => {
    await deleteContactUs(id)
    refetch()
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingContact(null)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Contact Us Submissions
          </h1>
          <p className='text-muted-foreground'>
            Manage contact form submissions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Submission
        </Button>
      </div>
      <div className='flex items-center gap-2 mb-4'>
        <Input
          placeholder='Search by name...'
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPageIndex(0)
          }}
          className='max-w-xs'
        />
      </div>
      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {table.getHeaderGroups()[0].headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='text-center'>
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell ??
                            (typeof cell.column.columnDef.header === "string"
                              ? cell.column.columnDef.header
                              : ""),
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className='mt-4'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      setPageIndex(i => Math.max(i - 1, 0))
                    }}
                    aria-disabled={pageIndex === 0}
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href='#'
                      isActive={i === pageIndex}
                      onClick={e => {
                        e.preventDefault()
                        setPageIndex(i)
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      setPageIndex(i => Math.min(i + 1, pageCount - 1))
                    }}
                    aria-disabled={
                      pageIndex === pageCount - 1 || pageCount === 0
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
      <ContactUsForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingContact}
        isLoading={isCreating}
      />
    </div>
  )
}
