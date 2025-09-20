import React, { useState, useEffect } from "react";
import { getSessions, getLevels } from "../../api/schools";
import {getResults} from "../../api/students";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  // State for sessions, levels
  const [sessions, setSessions] = useState([]);
  const [levels, setLevels] = useState([]);
  // Fetch sessions
  useEffect(() => {
    getSessions()
      .then(res => {
        setSessions(res.data.sessions || []);
      })
      .catch(console.error);
  }, []);

  // Fetch levels
  useEffect(() => {
    getLevels()
      .then(res => {
        setLevels(res.data.levels || []);
      })
      .catch((error=> {
       toast.error(error.response.data.message);
        console.log(error);
      }));
  }, []);

  // Fetch semesters

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setFormData({
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    getResults(formData)
    .then(res=> {
      if(res.data.results) {
        toast.success("Results retrieved successfully!");
        setResults(res.data.results);
        return;
      }
      toast.info(res.data.message)
      setResults([]);
    })
    .catch(error=> {
      toast.error(error.response.data.message);
      console.log(error.response)
      setResults([]);
    })
   
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
    <>
    <ToastContainer />
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
          onChange={e => setFormData(prev => ({ ...prev, session: e.target.value }))}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="">Select Session</MenuItem>
          {sessions.map(ses => (
            <MenuItem key={ses.id} value={ses.id}>{ses.name}</MenuItem>
          ))}
        </TextField>

        {/* Level Dropdown */}
        <TextField
          select
          label="Level"
          name="level"
          value={formData.level}
          onChange={e => setFormData(prev => ({ ...prev, level: e.target.value }))}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="">Select Level</MenuItem>
          {levels.map(lvl => (
            <MenuItem key={lvl.id} value={lvl.id}>{lvl.name || lvl}</MenuItem>
          ))}
        </TextField>

        {/* Semester Dropdown */}
        <TextField
          select
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={e => setFormData(prev => ({ ...prev, semester: e.target.value }))}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="">Select Semester</MenuItem>
          <MenuItem value="1">First</MenuItem>
          <MenuItem value="2">Second</MenuItem>
        </TextField>

        {/* Removed duplicate Level and Semester dropdowns */}

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
    </>
  );
}
