// src/pages/Student/Dashboard.js
import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = {
  gpa: 3.6,
  cgpa: 3.4,
  coursesTaken: 42,
  carryOver: 2,
  performance: [
    { semester: "100L 1st", gpa: 3.2 },
    { semester: "100L 2nd", gpa: 3.5 },
    { semester: "200L 1st", gpa: 3.8 },
    { semester: "200L 2nd", gpa: 3.6 },
    { semester: "300L 1st", gpa: 3.7 },
  ],
};

const SummaryCard = ({ title, value }) => (
  <Card sx={{ bgcolor: "#2C2C78", color: "white", borderRadius: 3, textAlign: "center" }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const StudentDashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Quick summary cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="GPA (Current)" value={mockData.gpa} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="CGPA" value={mockData.cgpa} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Courses Taken" value={mockData.coursesTaken} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Carry Over" value={mockData.carryOver} />
        </Grid>
      </Grid>

      {/* Performance chart */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Performance Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData.performance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 4]} />
            <Tooltip />
            <Bar dataKey="gpa" fill="#2C2C78" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default StudentDashboard;
