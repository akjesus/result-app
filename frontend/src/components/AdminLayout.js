import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Paper,Button
} from "@mui/material";
import {
  Dashboard,
  People,
  Book,
  Apartment,
  School,
  BarChart,
  Grade,
  Settings,Logout
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";


const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { text: "Students", icon: <People />, path: "/admin/students" },
  { text: "Courses", icon: <Book />, path: "/admin/courses" },
  { text: "Departments", icon: <Apartment />, path: "/admin/departments" },
  { text: "Schools", icon: <School />, path: "/admin/schools" },
  { text: "Results", icon: <BarChart />, path: "/admin/results" },
  { text: "Grades", icon: <Grade />, path: "/admin/grades" },
  { text: "Settings", icon: <Settings />, path: "/admin/settings" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.info("Logging Out!")
    setTimeout(() => { navigate("/login")}, 2000);
  };

  return (
    <>
    <ToastContainer/>
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#87CEEB", // light blue
            color: "white",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                backgroundColor:
                  location.pathname === item.path ? "#2C2C78" : "transparent",
                "&:hover": { backgroundColor: "#4682B4" },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

           {/* Logout button at bottom */}
           
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              bgcolor: "#2C2C78",
              ":hover": { bgcolor: "#1f1f5c" },
            }}
          >
            Logout
          </Button>
        </Box>

      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f4f6f8",
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Paper
          elevation={4}
          sx={{ p: 3, width: "90%", minHeight: "80vh", borderRadius: 3 }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default AdminLayout;
