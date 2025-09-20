// src/pages/Auth/Login.js
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ email: "", password: "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Temporary hardcoded login check
  //   if (
  //     (identifier === "MU/PH/24/0001" ||
  //       identifier === "student@madukauniversity.edu.ng") &&
  //     password === "student1234"
  //   ) {
  //     localStorage.setItem("token", "fake-student-token");
  //     localStorage.setItem("role", "student");
  //     navigate("/student/dashboard"); // ✅ use navigate, not window.location.href
  //     return;
  //   }

  //   if (
  //     identifier === "admin@madukauniversity.edu.ng" &&
  //     password === "admin1234"
  //   ) {
  //     localStorage.setItem("token", "fake-admin-token");
  //     localStorage.setItem("role", "admin");
  //     navigate("/admin/dashboard"); // ✅ use navigate
  //     return;
  //   }

  //   alert("Invalid credentials");
  // };
      // with API
    
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "" });

    try {
      console.log("Submitting:", { email, password });
      const res = await axios.post("http://localhost:5000/api/auth/login", {
       email, password
      });
      console.log(res.data)
      if (res.data.success) {
        // Save token & role in localStorage/session
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        // Redirect based on role
        if (res.data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.role === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/"); // fallback
        }
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message;

        if (message.includes("Email")) {
          setError((prev) => ({ ...prev, email: message }));
        } else if (message.includes("password")) {
          setError((prev) => ({ ...prev, password: message }));
        } else {
          alert(message);
        }
      } else {
        alert("Server not reachable");
      }
    }
  };


  return (
    <Box
      sx={{
        backgroundImage:
          "url('https://avatars.mds.yandex.net/i?id=1dec3fe0b0deb91cfeb28facc070c7fdee536a76-5231564-images-thumbs&n=13')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
          bgcolor: "rgba(255, 255, 255, 0.9)", // semi-transparent white
          boxShadow: 5,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            University Result Portal
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email or Matric No"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            >
              Login
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, cursor: "pointer", color: "#2C2C78" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
