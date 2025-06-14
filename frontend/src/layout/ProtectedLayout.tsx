// src/layouts/ProtectedLayout.tsx
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";




export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
}
