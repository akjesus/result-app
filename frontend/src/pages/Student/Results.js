import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import jsPDF from "jspdf";

export default function StudentResults() {
  const [formData, setFormData] = useState({
    session: "",
    level: "",
    semester: "",
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // Example results (replace with API later)
    const sampleResults = [
      { code: "GST101", title: "Use of English I", grade: "A", credit: 2 },
      { code: "MTH101", title: "Calculus I", grade: "B", credit: 3 },
      { code: "CHM101", title: "General Chemistry", grade: "C", credit: 3 },
    ];

    setResults(sampleResults);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Student Result Slip", 20, 20);
    doc.text(
      `Session: ${formData.session} | Level: ${formData.level} | Semester: ${formData.semester}`,
      20,
      30
    );

    let y = 50;
    results.forEach((result, index) => {
      doc.text(
        `${index + 1}. ${result.code} - ${result.title} | Grade: ${
          result.grade
        } | Credit: ${result.credit}`,
        20,
        y
      );
      y += 10;
    });

    doc.save("result.pdf");
  };

  return (
    <Container sx={{ mt: 6 }}>
      {/* Search Form */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Check Your Results
        </Typography>

        {/* Session */}
        <TextField
          select
          label="Session"
          name="session"
          value={formData.session}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="2023/2024">2023/2024</MenuItem>
          <MenuItem value="2024/2025">2024/2025</MenuItem>
        </TextField>

        {/* Level */}
        <TextField
          select
          label="Level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="100">100</MenuItem>
          <MenuItem value="200">200</MenuItem>
          <MenuItem value="300">300</MenuItem>
          <MenuItem value="400">400</MenuItem>
        </TextField>

        {/* Semester */}
        <TextField
          select
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="First">First Semester</MenuItem>
          <MenuItem value="Second">Second Semester</MenuItem>
        </TextField>

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
          onClick={handleSearch}
        >
          Search Result
        </Button>
      </Paper>

      {/* Results Table */}
      {results && (
        <Box sx={{ mt: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Results for {formData.session} - Level {formData.level} -{" "}
              {formData.semester} Semester
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Course Code</b></TableCell>
                  <TableCell><b>Course Title</b></TableCell>
                  <TableCell><b>Credit</b></TableCell>
                  <TableCell><b>Grade</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.credit}</TableCell>
                    <TableCell>{course.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Download PDF Button */}
            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
