"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material"
import { usePatients } from "../hooks/use-patients"
import { hospitalAPI } from "../service/hospitalService"
import { useSnackbar } from "notistack"
import type { Patient } from "../types/patient"

interface AssignPatientToHospitalProps {    
  hospitalId: number
  hospitalName: string
  onSuccess?: () => void
}

export function AssignPatientToHospital({ hospitalId, hospitalName, onSuccess }: AssignPatientToHospitalProps) {
  const { patients, loading: loadingPatients } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async () => {
    if (!selectedPatient) return

    setIsSubmitting(true)
    try {
      await hospitalAPI.assignPatientToHospital(hospitalId, selectedPatient.id)
      enqueueSnackbar("Patient assigned successfully", { variant: "success" })
      setSelectedPatient(null)
      onSuccess?.()
      // Reload the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      enqueueSnackbar("Failed to assign patient", { variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader
        title={
          <Typography variant="h6">
            Assign Patient to {hospitalName}
          </Typography>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.name} (Age: ${option.age})`}
            value={selectedPatient}
            onChange={(_, newValue) => setSelectedPatient(newValue)}
            loading={loadingPatients}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Patient"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedPatient || isSubmitting}
            sx={{ alignSelf: "flex-end" }}
          >
            {isSubmitting ? "Assigning..." : "Assign Patient"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
} 