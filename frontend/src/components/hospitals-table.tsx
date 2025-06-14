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
import { Pencil, Trash2, Plus, Search, Users, CheckCircle2, XCircle } from "lucide-react"
import type { Hospital } from "../types/hospital"
import { DeleteHospitalDialog } from "./delete-hospital-dialog"
import { useSnackbar } from "notistack"

interface HospitalsTableProps {
  hospitals: Hospital[]
  onEdit: (hospital: Hospital) => void
  onDelete: (id: number) => void
  onCreate: () => void
  loading?: boolean
  onSelect: (hospital: Hospital) => void
  selectedHospitalId?: number
}

export function HospitalsTable({
  hospitals,
  onEdit,
  onDelete,
  onCreate,
  loading = false,
  onSelect,
  selectedHospitalId,
}: HospitalsTableProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteHospital, setDeleteHospital] = useState<Hospital | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      await onDelete(id)
      enqueueSnackbar("Hospital eliminado con éxito", { variant: "success" })
    } catch (error) {
      enqueueSnackbar("Error al eliminar el hospital", { variant: "error" })
    } finally {
      setDeletingId(null)
    }
  }

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
              Loading hospitals...
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
              <Typography variant="h5">Hospitals</Typography>
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={onCreate}>
                Add Hospital
              </Button>
            </Box>
          }
        />
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search hospitals by name or address..."
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
          {filteredHospitals.length === 0 ? (
            <Typography align="center" color="text.secondary" py={4}>
              {searchTerm ? "No hospitals found matching your search." : "No hospitals found."}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>See patients</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHospitals.map((hospital) => (
                    <TableRow 
                      key={hospital.id}
                      onClick={() => onSelect(hospital)}
                      sx={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedHospitalId === hospital.id ? 'rgba(59, 130, 246, 0.08)' : 'inherit',
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 0.04)',
                        }
                      }}
                    >
                      <TableCell>{hospital.name}</TableCell>
                      <TableCell>{hospital.address}</TableCell>
                      <TableCell>{hospital.capacity}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(hospital);
                          }}
                          startIcon={<Users className="w-4 h-4" />}
                        >
                          View Patients
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(hospital);
                          }} 
                          color="warning"
                        >
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteHospital(hospital);
                          }} 
                          color="error"
                        >
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

      <DeleteHospitalDialog
        hospital={deleteHospital}
        open={!!deleteHospital}
        onOpenChange={(open) => !open && setDeleteHospital(null)}
        onConfirm={() => handleDelete(deleteHospital?.id || 0)}
        isLoading={isDeleting}
      />
    </>
  )
} 