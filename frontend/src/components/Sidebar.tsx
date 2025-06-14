import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from "@mui/material"
import { LayoutDashboard, Users, LogOut, Building2 } from "lucide-react"
import { Link as RouterLink, useLocation } from "react-router-dom"

const drawerWidth = 240

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    text: "Pacientes",
    path: "/patients",
    icon: <Users />,
  },
  {
    text: "Hospitales",
    path: "/hospitals",
    icon: <Building2 />,
  },
]

export default function Sidebar() {
  const location = useLocation()

  const handleLogout = () => {
    // Aquí agregas la lógica de logout real (por ejemplo: borrar token, redirigir al login, etc.)
    console.log("Logout clicked")
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f8fafc",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        <Toolbar />

        {/* Header del Sidebar */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1e293b",
              fontSize: "1.1rem",
            }}
          >
            Medical System
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, backgroundColor: "#e2e8f0" }} />

        <Box sx={{ overflow: "auto", mt: 1 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      backgroundColor: isActive ? "#3b82f6" : "transparent",
                      color: isActive ? "white" : "#64748b",
                      "&:hover": {
                        backgroundColor: isActive ? "#2563eb" : "#e2e8f0",
                        color: isActive ? "white" : "#1e293b",
                      },
                      "& .MuiListItemIcon-root": {
                        color: isActive ? "white" : "#64748b",
                        minWidth: 40,
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: isActive ? "white" : "#1e293b",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Box>

      {/* Botón de Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            "&:hover": {
              backgroundColor: "#fecaca",
            },
            "& .MuiListItemIcon-root": {
              color: "#b91c1c",
              minWidth: 40,
            },
          }}
        >
          <ListItemIcon>
            <LogOut />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  )
}
