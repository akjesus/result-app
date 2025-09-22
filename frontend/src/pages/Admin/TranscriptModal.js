import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/maduka-logo.png"; // Ensure logo.png exists in assets
import { addTranscriptHeader } from "../../utils/pdfHeader"; // ✅ import helper

export default function TranscriptModal({ open, handleClose, student }) {
  if (!student) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // Add logo and school name at the top
    doc.addImage(logo, "PNG", 14, 10, 25, 25);
    doc.setFontSize(18);
    doc.text("Maduka University, Ekwegbe", 45, 25); // Replace with your school name
    doc.setFontSize(16);
    doc.text("Student Transcript", 14, 45);
    doc.setFontSize(12);
    doc.text(`Name: ${student.student_name}`, 14, 60);
    doc.text(`Matric No: ${student.matric}`, 14, 67);
    doc.text(`Department: ${student.department_name}`, 14, 74);
    const tableColumn = ["Course Code", "Course Name", "Credit", "Score", "Grade"];
    const tableRows = [];
    if (Array.isArray(student.courses_info)) {
      student.courses_info.forEach(course => {
        tableRows.push([
          course.code,
          course.name,
          course.credit_load,
          course.total_score,
          course.grade
        ]);
      });
    }
    autoTable(doc, {
      startY: 85,
      head: [tableColumn],
      body: tableRows,
    });
    // GPA calculation
    let totalCredits = 0;
    let totalGradePoints = 0;
    if (Array.isArray(student.courses_info)) {
      student.courses_info.forEach(course => {
        totalCredits += Number(course.credit_load);
        let gp = 0;
        switch (course.grade) {
          case 'A': gp = 5; break;
          case 'B': gp = 4; break;
          case 'C': gp = 3; break;
          case 'D': gp = 2; break;
          case 'E': gp = 1; break;
          case 'F': gp = 0; break;
          default: gp = 0;
        }
        totalGradePoints += gp * Number(course.credit_load);
      });
    }
    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 120;
    doc.text(`Total Credits: ${totalCredits}`, 14, finalY + 10);
    doc.text(`Total Grade Points: ${totalGradePoints}`, 14, finalY + 17);
    doc.text(`GPA: ${gpa}`, 14, finalY + 24);
    // Registrar signature
    doc.setFontSize(12);
    doc.text("Registrar's Signature:", 14, finalY + 40);
    doc.line(60, finalY + 40, 120, finalY + 40); // Signature line
    doc.save(`${student.matric}_transcript.pdf`);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "#2C2C78" }}>
        Student Transcript
      </DialogTitle>
      <DialogContent dividers>
        {/* Preview Student Info */}
        <Box sx={{ mb: 2 }}>
          <Typography><b>Name:</b> {student.name}</Typography>
          <Typography><b>Matric Number:</b> {student.matNo}</Typography>
          <Typography><b>Faculty:</b> {student.faculty}</Typography>
          <Typography><b>Department:</b> {student.department}</Typography>
          <Typography><b>Level:</b> {student.level}</Typography>
          <Typography><b>Session:</b> {student.session}</Typography>
        </Box>

        {/* Results Preview */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S/N</TableCell>
              <TableCell>CODE</TableCell>
              <TableCell>COURSE TITLE</TableCell>
              <TableCell>UNIT</TableCell>
              <TableCell>SCORE</TableCell>
              <TableCell>GRADE</TableCell>
              <TableCell>GP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {student.results.map((r, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{r.code}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.unit}</TableCell>
                <TableCell>{r.score}</TableCell>
                <TableCell>{r.grade}</TableCell>
                <TableCell>{r.gp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Summary */}
        <Box sx={{ mt: 2 }}>
          <Typography><b>Total Units:</b> {student.totalUnits}</Typography>
          <Typography><b>GPA:</b> {student.gpa}</Typography>
          <Typography><b>CGPA:</b> {student.cgpa}</Typography>
          <Typography><b>Comment:</b> {student.comment}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          sx={{ bgcolor: "#2C2C78" }}
        >
          Download PDF
        </Button>
        <Button onClick={handleClose} sx={{ color: "#2C2C78" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
