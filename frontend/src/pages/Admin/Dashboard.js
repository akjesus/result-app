import React from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Mock stats data (replace with API later)
  const stats = [
    { key: "totalStudents", label: "Total Students", value: 1200, path: "/admin/students" },
    { key: "totalCourses", label: "Total Courses", value: 85, path: "/admin/courses" },
    { key: "totalDepartments", label: "Departments", value: 12, path: "/admin/departments" },
    { key: "avgCGPA", label: "Average CGPA", value: 3.25 },
    { key: "highestCGPA", label: "Highest CGPA", value: 4.9 },
    { key: "highestGPA", label: "Highest GPA", value: 5.0 },
    { key: "lowestCGPA", label: "Lowest CGPA", value: 1.5 },
    { key: "lowestGPA", label: "Lowest GPA", value: 1.2 },
  ];

  //get data from API
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard", 
        {     
          headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
        });
        const data = await res.data.dashboardData
        return data;
    }
    catch (error) {
      console.log('Error fetching dashboard data:', error);
    }
  } 
const statAPI = fetchDashboardData();
console.log(statAPI);
  //
  // Mock data for departmental performance
  const deptPerformance = [
    { name: "Computer Science", avgGPA: 3.8 },
    { name: "Pharmacy", avgGPA: 3.5 },
    { name: "Engineering", avgGPA: 3.2 },
    { name: "Law", avgGPA: 2.9 },
    { name: "Medicine", avgGPA: 3.7 },
  ];

  // Mock data for CGPA distribution
  const cgpaDistribution = [
    { name: "First Class (4.5+)", value: 300 },
    { name: "2nd Upper (3.5 - 4.49)", value: 500 },
    { name: "2nd Lower (2.5 - 3.49)", value: 300 },
    { name: "Pass (<2.5)", value: 100 },
  ];

  const COLORS = ["#2C2C78", "#4682B4", "#87CEEB", "#B0C4DE"];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.key}>
            <Card
              sx={{
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                cursor: item.path ? "pointer" : "default",
                "&:hover": item.path ? { bgcolor: "#e0e0e0" } : {},
              }}
              onClick={() => item.path && navigate(item.path)}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {item.label}
                </Typography>
                <Typography variant="h6">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Department Performance */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                Departmental Performance
              </Typography>
              <BarChart width={400} height={250} data={deptPerformance}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="avgGPA" fill="#2C2C78" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* CGPA Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                CGPA Distribution
              </Typography>
              <PieChart width={400} height={250}>
                <Pie
                  data={cgpaDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cgpaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
