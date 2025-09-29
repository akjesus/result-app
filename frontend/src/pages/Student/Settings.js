import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {changePassword} from "../../api/students"
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function StudentSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All password fields are required!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    console.log(formData)
    changePassword(formData)
      .then(res=> {
        if(res.data.success) {
          toast.success(res.data.message);
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
        else {
          console.log(res.data);
          toast.info(res.data.message);
          return;
        } 
      })
      .catch(error=> {
        toast.error(error.response?.data?.message || error.message);
        console.log(error.response);
      })
    
  };

  const toggleShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <>
    <ToastContainer/>
    <Container sx={{ mt: 4, px: { xs: 1, sm: 2 }, display: "flex", justifyContent: "center", alignItems: "center", minHeight: { xs: "100vh", sm: "auto" } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: "100%", maxWidth: 500, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom align="center" sx={{ fontSize: { xs: 18, sm: 22 } }}>
          Settings
        </Typography>

        {/* Change Password */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontSize: { xs: 15, sm: 18 } }}>
          Change Password
        </Typography>

        {/* Current Password */}
        <TextField
          label="Current Password"
          type={showPassword.current ? "text" : "password"}
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleShowPassword("current")}> 
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New Password */}
        <TextField
          label="New Password"
          type={showPassword.new ? "text" : "password"}
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleShowPassword("new")}> 
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm New Password */}
        <TextField
          label="Confirm New Password"
          type={showPassword.confirm ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleShowPassword("confirm")}> 
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Notifications */}
        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.emailNotifications}
                onChange={handleChange}
                name="emailNotifications"
              />
            }
            label="Email me when new results are uploaded"
          />
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, bgcolor: "#2C2C78", width: { xs: "100%", sm: "auto" }, ":hover": { bgcolor: "#1f1f5c" } }}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Paper>
    </Container>
    </>
  );
}
