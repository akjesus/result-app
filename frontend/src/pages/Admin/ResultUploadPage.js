import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  TextField,
} from "@mui/material";
import { Edit, Delete, Visibility, Download } from "@mui/icons-material";
import Papa from "papaparse";
import TranscriptModal from "./TranscriptModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addTranscriptHeader, addTranscriptFooter } from "../../utils/pdfHeader";
import { getResultsByDepartment } from "../../api/results";

export default function ResultUploadPage() {
  const params = useParams();
  const id = params.id || params.departmentId;
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openTranscript, setOpenTranscript] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Convert score → grade + grade point
  const getGrade = (score) => {
    if (score >= 70) return { grade: "A", gp: 5 };
    if (score >= 60) return { grade: "B", gp: 4 };
    if (score >= 50) return { grade: "C", gp: 3 };
    if (score >= 45) return { grade: "D", gp: 2 };
    if (score >= 40) return { grade: "E", gp: 1 };
    return { grade: "F", gp: 0 };
  };

  // CSV Upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const courseCodes = Object.keys(results.data[0]).filter(
          (col) => col !== "mat_no"
        );

        const parsed = results.data.map((row, index) => {
          let totalUnits = 0;
          let totalPoints = 0;

          const courseResults = courseCodes.map((code) => {
            const score = Number(row[code]) || 0;
            const gradeData = getGrade(score);
            const unit = 3;
            totalUnits += unit;
            totalPoints += gradeData.gp * unit;

            return {
              code,
              title: code,
              unit,
              score,
              grade: gradeData.grade,
              gp: gradeData.gp,
            };
          });

          const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0;

          return {
            matNo: row.mat_no,
            name: `Student ${index + 1}`,
            faculty: "School of Science",
            department: "Biochemistry",
            level: "100",
            session: "2023/2024",
            results: courseResults,
            totalUnits,
            gpa,
            cgpa: gpa,
            comment: gpa < 2 ? "Probation" : "Good Standing",
          };
        });

        setStudents(parsed);
      },
    });
  };

  // View Transcript
  const handleView = (student) => {
    setSelectedStudent(student);
    setOpenTranscript(true);
  };

  // Bulk Download All Transcripts
  const handleDownloadAll = () => {
    const doc = new jsPDF();

    students.forEach((student, idx) => {
      if (idx !== 0) doc.addPage();

      addTranscriptHeader(doc);

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

      addTranscriptFooter(doc); // ✅ footer on every page
    });

    doc.save("all_transcripts.pdf");
  };

  // Download transcript PDF for a student
  const handleDownloadTranscript = (student) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student Transcript", 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${student.student_name}`, 14, 35);
    doc.text(`Matric No: ${student.matric}`, 14, 42);
    doc.text(`Department: ${student.department_name}`, 14, 49);
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
      startY: 60,
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
    doc.text(`Total Credits: ${totalCredits}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Grade Points: ${totalGradePoints}`, 14, doc.lastAutoTable.finalY + 17);
    doc.text(`GPA: ${gpa}`, 14, doc.lastAutoTable.finalY + 24);
    doc.save(`${student.matric}_transcript.pdf`);
  };

  useEffect(() => {
    if (!id) return;
    getResultsByDepartment(id)
      .then(res => {
          console.log(res.data.gpas);
        setStudents(res.data.gpas || []);
      })
      .catch(() => setStudents([]));
  }, [id]);

  // Filter students by search (matric or name)
  const filteredStudents = students.filter(student =>
    student.matric.toLowerCase().includes(search.toLowerCase()) ||
    (student.student_name && student.student_name.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginate filtered students
  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={3}>
      
      {students.length > 0 && (
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2C2C78" }}>
        Department Results: {students[0].department_name}
      </Typography>
      )}
      {/* Upload Section */}
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" component="label">
          Choose File (CSV)
          <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
        </Button>
        {file && <Typography variant="body2">Selected: {file.name}</Typography>}
      </Box>
      <Box mt={2}>
        <TextField
          label="Search by Matric or Name"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>
      {/* Results Table */}
      <Box mt={4}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Results
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Matric</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Courses & Results</TableCell>
              <TableCell>Total Credits</TableCell>
              <TableCell>Total Grade Points</TableCell>
              <TableCell>GPA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((student, idx) => {
              let totalCredits = 0;
              let totalGradePoints = 0;
              if (Array.isArray(student.courses_info) && student.courses_info.length > 0) {
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
              return (
                <TableRow key={student.matric}>
                  <TableCell>{student.matric}</TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>
                    {Array.isArray(student.courses_info) && student.courses_info.length > 0
                      ? student.courses_info.map(course => `${course.code} (${course.grade}, ${course.credit_load})`).join(', ')
                      : 'No courses'}
                  </TableCell>
                  <TableCell>{totalCredits}</TableCell>
                  <TableCell>{totalGradePoints}</TableCell>
                  <TableCell>{gpa}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleDownloadTranscript(student)}>
                      Download Transcript
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredStudents.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>
      {/* Transcript Modal */}
      <TranscriptModal
        open={openTranscript}
        handleClose={() => setOpenTranscript(false)}
        student={selectedStudent}
      />
    </Box>
  );
}
