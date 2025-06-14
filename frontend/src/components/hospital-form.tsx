"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material"
import type { Hospital, HospitalCreateDTO, HospitalUpdateDTO } from "../types/hospital"

interface HospitalFormProps {
  hospital?: Hospital
  onSubmit: (data: HospitalCreateDTO | HospitalUpdateDTO) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function HospitalForm({ hospital, onSubmit, onCancel, isLoading }: HospitalFormProps) {
  const [formData, setFormData] = useState({
    name: hospital?.name || "",
    address: hospital?.address || "",
    capacity: hospital?.capacity?.toString() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
    }
    await onSubmit(payload)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardHeader
        title={
          <Typography variant="h6">
            {hospital ? "Edit Hospital" : "Create New Hospital"}
          </Typography>
        }
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Hospital Name"
            name="name"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            required
            fullWidth
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            required
            fullWidth
            value={formData.capacity}
            onChange={handleChange}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Saving..." : hospital ? "Update Hospital" : "Create Hospital"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
} 