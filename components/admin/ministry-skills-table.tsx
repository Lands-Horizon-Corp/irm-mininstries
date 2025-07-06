"use client"

import { Loader2 } from "lucide-react"

import type { MinistrySkills } from "@/types/common"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface MinistrySkillsTableProps {
  skills: MinistrySkills[]
  isLoading: boolean
  onEdit: (skill: MinistrySkills) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function MinistrySkillsTable({
  skills,
  isLoading,
  onEdit,
  onDelete,
  isDeleting = false,
}: MinistrySkillsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className='text-center'>
              <Loader2 className='mx-auto animate-spin' />
            </TableCell>
          </TableRow>
        ) : (
          skills.map(skill => (
            <TableRow key={skill.id}>
              <TableCell>{skill.name}</TableCell>
              <TableCell>{skill.description}</TableCell>
              <TableCell>
                <button onClick={() => onEdit(skill)} className='mr-2'>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(skill.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
