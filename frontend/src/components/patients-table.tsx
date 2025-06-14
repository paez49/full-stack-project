"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
import type { Patient } from "../types/patient"
import { DeletePatientDialog } from "./delete-patient-dialog"

interface PatientsTableProps {
  patients: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (id: number) => Promise<void>
  onCreate: () => void
  loading?: boolean
}

export function PatientsTable({ patients, onEdit, onDelete, onCreate, loading }: PatientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deletePatient) return
    setIsDeleting(true)
    try {
      await onDelete(deletePatient.id)
      setDeletePatient(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ height: 256, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box textAlign="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                border: "2px solid",
                borderColor: "grey.900",
                borderBottom: "none",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                mx: "auto",
              }}
            />
            <Typography mt={2} color="text.secondary">
              Loading patients...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
              <Typography variant="h5">Patients</Typography>
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={onCreate}>
                Add Patient
              </Button>
            </Box>
          }
        />
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          {filteredPatients.length === 0 ? (
            <Typography align="center" color="text.secondary" py={4}>
              {searchTerm ? "No patients found matching your search." : "No patients found."}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Oncological</TableCell>
                    <TableCell>Birth Date</TableCell>
                    <TableCell>Cancer Type</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Chip
                          label={patient.oncological ? "Yes" : "No"}
                          color={patient.oncological ? "success" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(patient.birth_date)}</TableCell>
                      <TableCell>{patient.cancer_type || "N/A"}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => onEdit(patient)} color="primary">
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeletePatient(patient)} color="error">
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <DeletePatientDialog
        patient={deletePatient}
        open={!!deletePatient}
        onOpenChange={(open) => !open && setDeletePatient(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
