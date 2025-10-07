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
  Alert
} from "@mui/material";
import {
  Dashboard,
  Book,
  BarChart,
  Settings,
  Logout,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/student/dashboard" },
  { text: "Profile", icon: <Book />, path: "/student/profile" },
  { text: "Results", icon: <BarChart />, path: "/student/results" },
  { text: "Settings", icon: <Settings />, path: "/student/settings" },
];

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const user = JSON.parse(localStorage.getItem("user"));

  function showSnackbar(message, severity) {
    setSnackbar({ open: true, message, severity });
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => { showSnackbar("Logged Out!", "info")}, 1000);
    setTimeout(() => { navigate("/login")}, 2500);
    
  };

  return (
    <>
      {/* User Icon and Info at Top Left */}
      <Box sx={{ position: "fixed", top: 16, left: 32, zIndex: 1400, display: "flex", alignItems: "center", gap: 1 }}>
        <AccountCircleIcon sx={{ fontSize: 36, color: "#2C2C78" }} />
        <Box sx={{ color: "#2C2C78", fontWeight: 600, fontSize: 15 }}>
          {user?.name || user?.email || "Student"}
        </Box>
      </Box>
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", height: "100vh" }}>
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

export default StudentLayout;
