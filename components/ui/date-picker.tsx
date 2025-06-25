"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "./calendar"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  showTime?: boolean
  timeStep?: number
  dateLabel?: string
  timeLabel?: string
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  showTime = true,
  timeStep = 1,
  dateLabel = "Date",
  timeLabel = "Time",
  className = "",
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value
  )
  const [timeValue, setTimeValue] = React.useState<string>(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, "0")
      const minutes = value.getMinutes().toString().padStart(2, "0")
      const seconds = value.getSeconds().toString().padStart(2, "0")
      return `${hours}:${minutes}:${seconds}`
    }
    return "10:30:00"
  })

  // Update internal state when value prop changes
  React.useEffect(() => {
    setInternalDate(value)
    if (value) {
      const hours = value.getHours().toString().padStart(2, "0")
      const minutes = value.getMinutes().toString().padStart(2, "0")
      const seconds = value.getSeconds().toString().padStart(2, "0")
      setTimeValue(`${hours}:${minutes}:${seconds}`)
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && showTime) {
      // Combine date with current time
      const [hours, minutes, seconds] = timeValue.split(":").map(Number)
      const combinedDateTime = new Date(selectedDate)
      combinedDateTime.setHours(hours, minutes, seconds)
      setInternalDate(combinedDateTime)
      onChange?.(combinedDateTime)
    } else {
      setInternalDate(selectedDate)
      onChange?.(selectedDate)
    }
    setOpen(false)
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeValue = event.target.value
    setTimeValue(newTimeValue)

    if (internalDate) {
      const [hours, minutes, seconds] = newTimeValue.split(":").map(Number)
      const combinedDateTime = new Date(internalDate)
      combinedDateTime.setHours(hours, minutes, seconds || 0)
      setInternalDate(combinedDateTime)
      onChange?.(combinedDateTime)
    }
  }

  const displayDate = internalDate || value

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className='flex flex-col gap-3'>
        <Label htmlFor='date-picker' className='px-1'>
          {dateLabel}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              id='date-picker'
              disabled={disabled}
              className='w-full justify-between font-normal'
            >
              {displayDate ? displayDate.toLocaleDateString() : placeholder}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={displayDate}
              captionLayout='dropdown'
              onSelect={handleDateSelect}
              disabled={date => {
                if (minDate && date < minDate) return true
                if (maxDate && date > maxDate) return true
                return false
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {showTime && (
        <div className='flex flex-col gap-3'>
          <Label htmlFor='time-picker' className='px-1'>
            {timeLabel}
          </Label>
          <Input
            type='time'
            id='time-picker'
            step={timeStep}
            value={timeValue}
            onChange={handleTimeChange}
            disabled={disabled}
            className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
          />
        </div>
      )}
    </div>
  )
}
