import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Input,
  TablePagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Edit, Delete, UploadFile, Download } from "@mui/icons-material";

// Mock API imports (replace with actual API calls)
import { getSchools } from "../../api/schools";
import { getDepartments } from "../../api/departments";

export default function AdminStudents() {
  const [students, setStudents] = useState([
    {
      fullName: "John Doe",
      matric: "MU/CS/24/0001",
      school: "School of Computing",
      department: "Computer Science",
      level: "100",
      email: "johndoe@example.com",
    },
    {
      fullName: "Mary Jane",
      matric: "MU/PH/24/0002",
      school: "School of Pharmacy",
      department: "Pharmacy",
      level: "200",
      email: "maryjane@example.com",
    },
  ]);

  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const levels = ["100", "200", "300", "400"];

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    matric: "",
    school: "",
    department: "",
    level: "",
    email: "",
  });

  // Filters
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch schools & departments
  useEffect(() => {
    getSchools().then((res) => setSchools(res.data)).catch(console.error);
    getDepartments().then((res) => setDepartments(res.data)).catch(console.error);
  }, []);

  const handleOpen = (student = null, index = null) => {
    if (student) {
      setNewStudent(student);
      setEditIndex(index);
    } else {
      setNewStudent({ fullName: "", matric: "", school: "", department: "", level: "", email: "" });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setNewStudent({ ...newStudent, [e.target.name]: e.target.value });

  const handleSaveStudent = () => {
    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = newStudent;
      setStudents(updated);
    } else {
      setStudents([...students, newStudent]);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const updated = students.filter((_, i) => i !== index);
      setStudents(updated);
    }
  };

  // Filtered students
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) &&
      (filterDept ? s.department === filterDept : true) &&
      (filterLevel ? s.level === filterLevel : true)
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Students</Typography>

      {/* Add / Bulk Upload / Download */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }} onClick={() => handleOpen()}>Add Student</Button>
        <Button variant="outlined" component="label" startIcon={<UploadFile />}>
          Bulk Upload (CSV)
          <Input type="file" accept=".csv" sx={{ display: "none" }} />
        </Button>
        <Button variant="outlined" startIcon={<Download />}>Download Sample CSV</Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField label="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
        <TextField
          label="Filter by Department"
          select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {departments.map((d) => (<MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>))}
        </TextField>
        <TextField
          label="Filter by Level"
          select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {levels.map((l) => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
        </TextField>
      </Box>

      {/* Students Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Matric Number</TableCell>
            <TableCell>School</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
            <TableRow key={index}>
              <TableCell>{student.fullName}</TableCell>
              <TableCell>{student.matric}</TableCell>
              <TableCell>{student.school}</TableCell>
              <TableCell>{student.department}</TableCell>
              <TableCell>{student.level}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(student, index)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(index)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      {/* Add/Edit Student Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Full Name" name="fullName" fullWidth value={newStudent.fullName} onChange={handleChange} />
          <TextField margin="dense" label="Matric Number" name="matric" fullWidth value={newStudent.matric} onChange={handleChange} />

          <FormControl fullWidth margin="dense">
            <InputLabel>School</InputLabel>
            <Select name="school" value={newStudent.school} onChange={handleChange}>
              {schools.map((s) => (<MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select name="department" value={newStudent.department} onChange={handleChange}>
              {departments
                .filter((d) => !newStudent.school || d.school === newStudent.school)
                .map((d) => (<MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Level</InputLabel>
            <Select name="level" value={newStudent.level} onChange={handleChange}>
              {levels.map((l) => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
            </Select>
          </FormControl>

          <TextField margin="dense" label="Email" name="email" type="email" fullWidth value={newStudent.email} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: "#2C2C78" }} onClick={handleSaveStudent}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
