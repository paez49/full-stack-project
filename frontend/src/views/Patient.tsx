"use client"

import { useState } from "react"
import { PatientsTable } from "../components/patients-table"
import { PatientForm } from "../components/patient-form"
import { usePatients } from "../hooks/use-patients"
import type { Patient, PatientCreateDTO, PatientUpdateDTO } from "../types/patient"
import { useSnackbar } from "notistack"

type ViewMode = "list" | "create" | "edit"

export default function PatientsPage() {
  const { enqueueSnackbar } = useSnackbar()
  const { patients, loading, createPatient, updatePatient, deletePatient } = usePatients()
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setViewMode("create")
    setSelectedPatient(undefined)
  }

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setViewMode("edit")
  }

  const handleFormSubmit = async (data: PatientCreateDTO | PatientUpdateDTO) => {
    setIsSubmitting(true)
    try {
      if (viewMode === "create") {
        await createPatient(data as PatientCreateDTO)
        enqueueSnackbar("Paciente creado con éxito", { variant: "success" })
      } else if (viewMode === "edit" && selectedPatient) {
        await updatePatient(selectedPatient.id, data as PatientUpdateDTO)
        enqueueSnackbar("Paciente actualizado con éxito", { variant: "success" })
      }
      setViewMode("list")
      setSelectedPatient(undefined)
    } catch (err) {
      enqueueSnackbar("Ocurrió un error", { variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setViewMode("list")
    setSelectedPatient(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {viewMode === "list" ? (
          <PatientsTable
            patients={patients}
            onEdit={handleEdit}
            onDelete={deletePatient}
            onCreate={handleCreate}
            loading={loading}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <PatientForm
              patient={selectedPatient}
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
