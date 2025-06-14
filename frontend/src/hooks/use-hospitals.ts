import { useState, useEffect } from "react"
import { hospitalAPI } from "../service/hospitalService"
import type { Hospital, HospitalCreateDTO, HospitalUpdateDTO } from "../types/hospital"


export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHospitals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await hospitalAPI.getAllHospitals()
      setHospitals(data)
    } catch (err) {
      alert("Error:")
    } finally {
      setLoading(false)
    }
  }

  const createHospital = async (hospital: HospitalCreateDTO) => {
    try {
      const newHospital = await hospitalAPI.createHospital(hospital)
      setHospitals((prev) => [...prev, newHospital])
      alert("Hospital creado correctamente")
      return newHospital
    } catch (err) {
      alert("Error:")
      throw err
    }
  }

  const updateHospital = async (id: number, hospital: HospitalUpdateDTO) => {
    try {
      const updatedHospital = await hospitalAPI.updateHospital(id, hospital)
      setHospitals((prev) => prev.map((h) => (h.id === id ? updatedHospital : h)))
      alert("Hospital actualizado correctamente")
      return updatedHospital
    } catch (err) {
      alert("Error:")
      throw err
    }
  }

  const deleteHospital = async (id: number) => {
    try {
      await hospitalAPI.deleteHospital(id)
      setHospitals((prev) => prev.filter((h) => h.id !== id))
      alert("Hospital eliminado correctamente")
    } catch (err) {
      alert("Error:")
      throw err
    }
  }

  useEffect(() => {
    fetchHospitals()
  }, [])

  return {
    hospitals,
    loading,
    error,
    fetchHospitals,
    createHospital,
    updateHospital,
    deleteHospital,
  }
} 