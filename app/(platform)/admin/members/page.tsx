"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Loader2 } from "lucide-react"

import { Member } from "@/lib/member-schema"
import { useMembers } from "@/hooks/use-member"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PAGE_SIZE = 10
const genderOptions = ["male", "female"]
const civilStatusOptions = [
  "single",
  "married",
  "widowed",
  "separated",
  "divorced",
]

export default function MembersAdminPage() {
  const [search, setSearch] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    civilStatus: "",
    email: "",
  })
  const [pageIndex, setPageIndex] = useState(0)
  const { members, isLoading } = useMembers()

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      return (
        member.firstName
          .toLowerCase()
          .includes(search.firstName.toLowerCase()) &&
        member.lastName.toLowerCase().includes(search.lastName.toLowerCase()) &&
        (member.middleName || "")
          .toLowerCase()
          .includes(search.middleName.toLowerCase()) &&
        (search.gender ? member.gender === search.gender : true) &&
        (search.civilStatus
          ? member.civilStatus === search.civilStatus
          : true) &&
        (search.email
          ? (member.email || "")
              .toLowerCase()
              .includes(search.email.toLowerCase())
          : true)
      )
    })
  }, [members, search])

  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: info => {
          const url = info.getValue() as string | undefined
          return url ? (
            <Image
              src={url}
              alt='Member'
              className='w-10 h-10 rounded-full object-cover border'
              style={{ minWidth: 40, minHeight: 40 }}
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border'>
              N/A
            </div>
          )
        },
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "middleName",
        header: "Middle Name",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "civilStatus",
        header: "Civil Status",
        cell: info => info.getValue(),
      },
      { accessorKey: "email", header: "Email", cell: info => info.getValue() },
      {
        accessorKey: "numberOfRanks",
        header: "# of Ranks",
        cell: info => info.row.original.ministryRecords?.length || 0,
      },
    ],
    []
  )

  const pageCount = Math.ceil(filteredMembers.length / PAGE_SIZE)
  const table = useReactTable({
    data: filteredMembers,
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

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Members</h1>
      </div>
      <div className='mb-4 grid grid-cols-1 md:grid-cols-3 gap-2'>
        <Input
          placeholder='Search first name...'
          value={search.firstName}
          onChange={e => setSearch(s => ({ ...s, firstName: e.target.value }))}
        />
        <Input
          placeholder='Search last name...'
          value={search.lastName}
          onChange={e => setSearch(s => ({ ...s, lastName: e.target.value }))}
        />
        <Input
          placeholder='Search middle name...'
          value={search.middleName}
          onChange={e => setSearch(s => ({ ...s, middleName: e.target.value }))}
        />
        <Select
          value={search.gender}
          onValueChange={val => setSearch(s => ({ ...s, gender: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder='Gender' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All</SelectItem>
            {genderOptions.map(opt => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={search.civilStatus}
          onValueChange={val => setSearch(s => ({ ...s, civilStatus: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder='Civil Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All</SelectItem>
            {civilStatusOptions.map(opt => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder='Search email...'
          value={search.email}
          onChange={e => setSearch(s => ({ ...s, email: e.target.value }))}
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
    </div>
  )
}
