"use client"

import { useState } from "react"
import { HospitalsTable } from "../components/hospitals-table"
import { HospitalForm } from "../components/hospital-form"
import { HospitalPatients } from "../components/hospital-patients"
import { AssignPatientToHospital } from "../components/assign-patient-to-hospital"
import { useHospitals } from "../hooks/use-hospitals"
import type { Hospital, HospitalCreateDTO, HospitalUpdateDTO } from "../types/hospital"
import { useSnackbar } from "notistack"
import { Box, Typography, Divider } from "@mui/material"

type ViewMode = "list" | "create" | "edit"

export default function HospitalsPage() {
  const { enqueueSnackbar } = useSnackbar()
  const { hospitals, loading, createHospital, updateHospital, deleteHospital } = useHospitals()
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedHospital, setSelectedHospital] = useState<Hospital | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setViewMode("create")
    setSelectedHospital(undefined)
  }

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setViewMode("edit")
  }

  const handleSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setViewMode("list")
  }

  const handleFormSubmit = async (data: HospitalCreateDTO | HospitalUpdateDTO) => {
    setIsSubmitting(true)
    try {
      if (viewMode === "create") {
        await createHospital(data as HospitalCreateDTO)
        enqueueSnackbar("Hospital creado con éxito", { variant: "success" })
      } else if (viewMode === "edit" && selectedHospital) {
        await updateHospital(selectedHospital.id, data as HospitalUpdateDTO)
        enqueueSnackbar("Hospital actualizado con éxito", { variant: "success" })
      }
      setViewMode("list")
      setSelectedHospital(undefined)
    } catch (err) {
      enqueueSnackbar("Ocurrió un error", { variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setViewMode("list")
    setSelectedHospital(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {viewMode === "list" ? (
          <>
            <HospitalsTable
              hospitals={hospitals}
              onEdit={handleEdit}
              onDelete={deleteHospital}
              onCreate={handleCreate}
              loading={loading}
              onSelect={handleSelect}
              selectedHospitalId={selectedHospital?.id}
            />
            {selectedHospital && (
              <>
                <Divider sx={{ my: 4 }} />
                <Box mb={4}>
                  <Typography variant="h5" gutterBottom>
                    {selectedHospital.name} - Patient Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Address: {selectedHospital.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {selectedHospital.capacity} patients
                  </Typography>
                </Box>
                <AssignPatientToHospital 
                  hospitalId={selectedHospital.id}
                  hospitalName={selectedHospital.name}
                  onSuccess={() => {
                    // Refresh the patients list
                    const hospitalPatientsElement = document.querySelector('[data-testid="hospital-patients"]')
                    if (hospitalPatientsElement) {
                      const event = new Event('refresh')
                      hospitalPatientsElement.dispatchEvent(event)
                    }
                  }}
                />
                <Box mt={4}>
                  <HospitalPatients hospitalId={selectedHospital.id} />
                </Box>
              </>
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <HospitalForm
              hospital={selectedHospital}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  )
} 