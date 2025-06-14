"use client"

import { useState, useEffect } from "react"
import type { Patient, PatientCreateDTO, PatientUpdateDTO } from "../types/patient"
import { patientAPI } from "../service/patientService"

async function extractErrorMessage(err: unknown): Promise<string> {
  if (err instanceof Response) {
    try {
      const data = await err.json()
      return data.detail || "Error desconocido"
    } catch {
      return "Error al interpretar la respuesta del servidor"
    }
  }

  if (err instanceof Error) return err.message
  return "Error inesperado"
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await patientAPI.getAllPatients()
      setPatients(data)
    } catch (err) {
      const errorMessage = await extractErrorMessage(err)
      setError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const createPatient = async (patient: PatientCreateDTO) => {
    try {
      const newPatient = await patientAPI.createPatient(patient)
      setPatients((prev) => [...prev, newPatient])
      alert("Paciente creado correctamente")
      return newPatient
    } catch (err) {
      const errorMessage = await extractErrorMessage(err)
      alert(`Error: ${errorMessage}`)
      throw err
    }
  }

  const updatePatient = async (id: number, patient: PatientUpdateDTO) => {
    try {
      const updatedPatient = await patientAPI.updatePatient(id, patient)
      setPatients((prev) => prev.map((p) => (p.id === id ? updatedPatient : p)))
      alert("Paciente actualizado correctamente")
      return updatedPatient
    } catch (err) {
      const errorMessage = await extractErrorMessage(err)
      alert(`Error: ${errorMessage}`)
      throw err
    }
  }

  const deletePatient = async (id: number) => {
    try {
      await patientAPI.deletePatient(id)
      setPatients((prev) => prev.filter((p) => p.id !== id))
      alert("Paciente eliminado correctamente")
    } catch (err) {
      const errorMessage = await extractErrorMessage(err)
      alert(`Error: ${errorMessage}`)
      throw err
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  }
}
