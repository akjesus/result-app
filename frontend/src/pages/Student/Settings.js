import React, { useState } from "react";
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
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Settings updated successfully!");
  };

  const toggleShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Settings
        </Typography>

        {/* Change Password */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
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
          sx={{ mt: 3, bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Paper>
    </Container>
  );
}
