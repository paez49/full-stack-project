"use client"

import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"
import type { Patient } from "../types/patient"

interface DeletePatientDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export function DeletePatientDialog({
  patient,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeletePatientDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This action cannot be undone. This will permanently delete the patient record for{" "}
          <strong>{patient?.name}</strong> and remove all associated data.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete Patient"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
