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
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material"
import type { Patient, PatientCreateDTO, PatientUpdateDTO } from "../types/patient"

interface PatientFormProps {
  patient?: Patient
  onSubmit: (data: PatientCreateDTO | PatientUpdateDTO) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PatientForm({ patient, onSubmit, onCancel, isLoading }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    age: patient?.age?.toString() || "",
    oncological: patient?.oncological || false,
    birth_date: patient?.birth_date || "",
    cancer_type: patient?.cancer_type || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      age: parseInt(formData.age),
      cancer_type : formData.cancer_type === "" ? null : formData.cancer_type,
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardHeader
        title={
          <Typography variant="h6">
            {patient ? "Edit Patient" : "Create New Patient"}
          </Typography>
        }
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            name="name"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            required
            fullWidth
            value={formData.age}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="oncological"
                checked={formData.oncological}
                onChange={handleCheckboxChange}
              />
            }
            label="Oncological Patient"
          />
          <TextField
            label="Birth Date"
            name="birth_date"
            type="date"
            required
            fullWidth
            value={formData.birth_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Cancer Type"
            name="cancer_type"
            select
            fullWidth
            value={formData.cancer_type}
            onChange={handleChange}
          >
            <MenuItem value="">No Cancer</MenuItem>
            <MenuItem value="Breast">Breast</MenuItem>
            <MenuItem value="Lung">Lung</MenuItem>
            <MenuItem value="Colon">Colon</MenuItem>
            <MenuItem value="Skin">Skin</MenuItem>
          </TextField>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Saving..." : patient ? "Update Patient" : "Create Patient"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
