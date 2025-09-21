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
import "jspdf-autotable";
import { addTranscriptHeader } from "../../utils/pdfHeader"; // ✅ import helper

export default function TranscriptModal({ open, handleClose, student }) {
  if (!student) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    addTranscriptHeader(doc); // ✅ use helper here

    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 14, 105);
    doc.text(`Matric No: ${student.matNo}`, 14, 112);
    doc.text(`Faculty: ${student.faculty}`, 14, 119);
    doc.text(`Department: ${student.department}`, 14, 126);
    doc.text(`Level: ${student.level}`, 14, 133);
    doc.text(`Session: ${student.session}`, 14, 140);

    const tableColumn = ["S/N", "CODE", "COURSE TITLE", "UNIT", "SCORE", "GRADE", "GP"];
    const tableRows = [];

    student.results.forEach((r, index) => {
      tableRows.push([index + 1, r.code, r.title, r.unit, r.score, r.grade, r.gp]);
    });

    doc.autoTable({
      startY: 150,
      head: [tableColumn],
      body: tableRows,
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Units: ${student.totalUnits}`, 14, finalY);
    doc.text(`GPA: ${student.gpa}`, 14, finalY + 7);
    doc.text(`CGPA: ${student.cgpa}`, 14, finalY + 14);
    doc.text(`Comment: ${student.comment}`, 14, finalY + 21);

    doc.save(`${student.matNo}_transcript.pdf`);
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
