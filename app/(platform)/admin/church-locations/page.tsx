"use client"

import { useState } from "react"

import type { ChurchLocation } from "@/types/common"
import { useChurchLocations } from "@/hooks/use-church-locations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChurchLocationCard from "@/components/admin/church-location-card"
import ChurchLocationForm from "@/components/admin/church-location-form"

export default function ChurchLocationsPage() {
  const {
    locations,
    createLocation,
    updateLocation,
    deleteLocation,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useChurchLocations()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<ChurchLocation | null>(null)
  const [searchName, setSearchName] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  const filteredLocations = locations.filter(location => {
    const nameMatch = location.description
      ? location.description.toLowerCase().includes(searchName.toLowerCase())
      : false
    const locationMatch = location.address
      ? location.address.toLowerCase().includes(searchLocation.toLowerCase())
      : false
    return (
      (searchName === "" || nameMatch) &&
      (searchLocation === "" || locationMatch)
    )
  })

  const handleAdd = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleEdit = (location: ChurchLocation) => {
    setEditData(location)
    setFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteLocation(id)
    refetch()
  }

  const handleFormSubmit = async (
    data: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editData) {
      await updateLocation(editData.id, data)
    } else {
      await createLocation(data)
    }
    setFormOpen(false)
    refetch()
  }

  return (
    <div className='container py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Church Locations</h1>
        <Button onClick={handleAdd}>Add Location</Button>
      </div>
      <div className='flex gap-2 mb-6'>
        <Input
          placeholder='Search by name...'
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <Input
          placeholder='Search by location...'
          value={searchLocation}
          onChange={e => setSearchLocation(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredLocations.map(location => (
          <ChurchLocationCard
            key={location.id}
            location={location}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>
      <ChurchLocationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editData}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}
