"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"
import type { Hospital } from "../types/hospital"

interface DeleteHospitalDialogProps {
  hospital: Hospital | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteHospitalDialog({
  hospital,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteHospitalDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This action cannot be undone. This will permanently delete the hospital record for{" "}
          <strong>{hospital?.name}</strong> and remove all associated data.
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
          {isLoading ? "Deleting..." : "Delete Hospital"}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 