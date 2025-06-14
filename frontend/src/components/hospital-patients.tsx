"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material"
import { Calendar, Clock, User, Heart, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Patient } from "../types/patient"
import { getHospitalPatients } from "../service/authService"

interface HospitalPatientsProps {
  hospitalId: number
}

export function HospitalPatients({ hospitalId }: HospitalPatientsProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const data = await getHospitalPatients(hospitalId)
      setPatients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [hospitalId])

  useEffect(() => {
    const element = document.querySelector('[data-testid="hospital-patients"]')
    if (element) {
      const handleRefresh = () => {
        fetchPatients()
      }
      element.addEventListener('refresh', handleRefresh)
      return () => {
        element.removeEventListener('refresh', handleRefresh)
      }
    }
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  if (patients.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="text.secondary">No patients found in this hospital</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 3 }} data-testid="hospital-patients">
      <Typography variant="h6" gutterBottom>
        Current Patients
      </Typography>
      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: patient.oncological ? "#ef4444" : "#3b82f6",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <User size={24} />
                  </Avatar>
                  <Box ml={2}>
                    <Typography variant="h6" component="div">
                      {patient.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {patient.age}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Calendar size={16} />
                    <Typography variant="body2">
                      Birth Date: {new Date(patient.birth_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {patient.oncological ? (
                      <>
                        <Heart size={16} color="#ef4444" />
                        <Typography variant="body2" color="error">
                          Cancer Type: {patient.cancer_type || "Not specified"}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} color="#22c55e" />
                        <Typography variant="body2" color="success.main">
                          Non-oncological patient
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={patient.oncological ? "Oncological" : "Regular"}
                    color={patient.oncological ? "error" : "primary"}
                    size="small"
                  />
                  <Tooltip title="Patient ID">
                    <Typography variant="caption" color="text.secondary">
                      ID: {patient.id}
                    </Typography>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
} 