import React, { useState, useEffect } from "react";
import {getProfile} from "../../api/students";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Avatar,
  Button,
  Box,
} from "@mui/material";

export default function StudentProfile() {
  const [profilePic, setProfilePic] = useState(null);
  const [profileData, setProfileData] = useState({})


   useEffect(() => {
      getProfile()
        .then(res => {
          setProfileData(res.data.user || []);
        })
        .catch((error=> {
         toast.error(error.response.data.message);
          console.log(error.response);
        }));
    }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Later connect this with backend to update student profile
    toast.success("Profile saved successfully!");
  };

  return (
    <>
    <ToastContainer/>
    <Container sx={{ mt: 4 }}>
      {/* Profile Picture */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Avatar
          src={profilePic}
          alt="Profile"
          sx={{ width: 120, height: 120 }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button variant="outlined" component="label">
          Upload Picture
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
      </Box>

      {/* Profile Info (Left Aligned with Bold Labels) */}
      <Box sx={{ textAlign: "left", maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="body1">
          <strong>Full Name:</strong> {profileData.fullName}
        </Typography>
        <Typography variant="body1">
          <strong>Matric No:</strong> {profileData.matric}
        </Typography>
        <Typography variant="body1">
          <strong>School:</strong> {profileData.school}
        </Typography>
        <Typography variant="body1">
          <strong>Department:</strong> {profileData.department}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {profileData.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone:</strong> {profileData.phone}
        </Typography>
        <Typography variant="body1">
          <strong>Level:</strong> {profileData.level}
        </Typography>
      </Box>

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#2C2C78" }}
          onClick={handleSave}
        >
          Save Profile
        </Button>
      </Box>
    </Container>
    </>
  );
}
