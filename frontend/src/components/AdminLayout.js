import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Paper,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Dashboard,
  People,
  Book,
  Apartment,
  School,
  BarChart,
  Grade,
  Settings,Logout,
  ChevronLeft,
  ChevronRight,
  PeopleOutline
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";


const drawerWidth = 240;

// ...existing code...

const getMenuItems = (role) => {
  if (role === "admin" || role === "superadmin") {
    return [
      { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
      { text: "Students", icon: <People />, path: "/admin/students" },
      { text: "Courses", icon: <Book />, path: "/admin/courses" },
      { text: "Departments", icon: <Apartment />, path: "/admin/departments" },
      { text: "Schools", icon: <School />, path: "/admin/schools" },
      { text: "Results", icon: <BarChart />, path: "/admin/results" },
      { text: "Transcripts", icon: <BarChart />, path: "/admin/transcripts" },
      { text: "Staff", icon: <PeopleOutline />, path: "/admin/staff" },
      { text: "Grades", icon: <Grade />, path: "/admin/grades" },
      { text: "Settings", icon: <Settings />, path: "/admin/settings" },
    ];
  } else if (role === "staff") {
    return [
      { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
      { text: "Students", icon: <People />, path: "/admin/students" },
      { text: "Courses", icon: <Book />, path: "/admin/courses" },
      { text: "Departments", icon: <Apartment />, path: "/admin/departments" },
      { text: "Schools", icon: <School />, path: "/admin/schools" },
      { text: "Results", icon: <BarChart />, path: "/admin/results" },
    ];
  }
  return [];
};


const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [menuItems, setMenuItems] = useState(getMenuItems(role));

  React.useEffect(() => {
    const handleStorageChange = () => {
      const newRole = localStorage.getItem("role");
      setRole(newRole);
      setMenuItems(getMenuItems(newRole));
    };
    window.addEventListener("storage", handleStorageChange);
    // In case role changes in same tab (e.g. after login/logout)
    const interval = setInterval(() => {
      const currentRole = localStorage.getItem("role");
      if (currentRole !== role) {
        setRole(currentRole);
        setMenuItems(getMenuItems(currentRole));
      }
    }, 500);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [role]);

  function showSnackbar(message, severity) {
    setSnackbar({ open: true, message, severity });
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    showSnackbar("Logging Out....", "info");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => {
      setRole(null);
      setMenuItems([]);
      navigate("/login");
    }, 1500);
  };

  return (
    <>
  <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
        {/* Sidebar toggle button for mobile */}
        <Box sx={{ position: "fixed", top: 16, left: 8, zIndex: 1300, display: { xs: "block", md: "none" } }}>
          <Button
            variant="contained"
            sx={{ minWidth: 0, p: 1, bgcolor: "#2C2C78" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </Box>

        {/* User Info and Logout at top right */}
        <Box sx={{ position: "fixed", top: 16, right: 32, zIndex: 1400, display: "flex", alignItems: "center", gap: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 40, color: "#2C2C78" }} />
          <Box sx={{ textAlign: "right" }}>
            <Box sx={{ color: "#2C2C78", fontWeight: 600, fontSize: 16 }}>
              {user?.name || "User"}
            </Box>
            <Box sx={{ color: "#2C2C78", fontSize: 14 }}>
              {user?.email}
            </Box>
            <Box sx={{ color: "#2C2C78", fontSize: 13 }}>
              Role: {role}
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ bgcolor: "#2C2C78", ':hover': { bgcolor: "#1f1f5c" }, ml: 2 }}
          >
            Logout
          </Button>
        </Box>
        {/* Sidebar */}
  <Drawer
          variant={sidebarOpen ? "temporary" : "permanent"}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: sidebarOpen ? "block" : "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#87CEEB",
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
              onClick={() => setSidebarOpen(false)}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: location.pathname === item.path ? "white" : undefined,
                  fontWeight: location.pathname === item.path ? 700 : undefined,
                }}
              />
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
          p: { xs: 1, md: 3 },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Paper
          elevation={4}
          sx={{ p: { xs: 1, md: 3 }, width: { xs: "100%", md: "90%" }, minHeight: "80vh", borderRadius: 3 }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
                    <Snackbar
                      open={snackbar.open}
                      autoHideDuration={3000}
                      onClose={handleCloseSnackbar}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                        {snackbar.message}
                      </Alert>
                    </Snackbar>
    </>
  );
};

export default AdminLayout;
