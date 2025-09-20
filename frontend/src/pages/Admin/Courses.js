import React, { useState } from "react";
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
  TablePagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

// ✅ Departments List
const departments = [
  "Medicine and Surgery",
  "Accounting",
  "Economics",
  "International Relations",
  "Mass Communication",
  "Computer Science",
  "Cyber Security",
  "Information Technology",
  "Software Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Medical Laboratory Sciences",
  "Nursing Sciences",
  "Physiotherapy",
  "Public Health",
  "Radiography",
  "Pharmacy",
];

const levels = ["100", "200", "300", "400", "500", "600"];

export default function AdminCourses() {
  const [courses, setCourses] = useState([
    {
      code: "CSC101",
      title: "Introduction to Computer Science",
      departments: ["Computer Science"],
      levels: ["100"],
      credit: 3,
      status: "Active",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    departments: [],
    levels: [],
    credit: "",
    status: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Open modal for Add/Edit
  const handleOpen = (course = null, index = null) => {
    if (course) {
      setNewCourse(course);
      setEditIndex(index);
    } else {
      setNewCourse({
        code: "",
        title: "",
        departments: [],
        levels: [],
        credit: "",
        status: "",
      });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  // ✅ Handle Department with "All" toggle
  const handleDepartmentChange = (event) => {
    const value = event.target.value;

    if (value.includes("All")) {
      if (newCourse.departments.length === departments.length) {
        // Unselect all
        setNewCourse({ ...newCourse, departments: [] });
      } else {
        // Select all
        setNewCourse({ ...newCourse, departments: [...departments] });
      }
    } else {
      setNewCourse({ ...newCourse, departments: value });
    }
  };

  // ✅ Handle Level with "All" toggle
  const handleLevelChange = (event) => {
    const value = event.target.value;

    if (value.includes("All")) {
      if (newCourse.levels.length === levels.length) {
        // Unselect all
        setNewCourse({ ...newCourse, levels: [] });
      } else {
        // Select all
        setNewCourse({ ...newCourse, levels: [...levels] });
      }
    } else {
      setNewCourse({ ...newCourse, levels: value });
    }
  };

  // Add or Update Course
  const handleSaveCourse = () => {
    if (editIndex !== null) {
      const updated = [...courses];
      updated[editIndex] = newCourse;
      setCourses(updated);
    } else {
      setCourses([...courses, newCourse]);
    }
    handleClose();
  };

  // Delete Course
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const updated = courses.filter((_, i) => i !== index);
      setCourses(updated);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Courses
      </Typography>

      {/* Add Course Button */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
          onClick={() => handleOpen()}
        >
          Add Course
        </Button>
      </Box>

      {/* Courses Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Course Code</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Course Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Departments</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Levels</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Credit</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((course, index) => (
              <TableRow key={index}>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.departments.join(", ")}</TableCell>
                <TableCell>{course.levels.join(", ")}</TableCell>
                <TableCell>{course.credit}</TableCell>
                <TableCell>{course.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(course, index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={courses.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add/Edit Course Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editIndex !== null ? "Edit Course" : "Add Course"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Course Code"
            name="code"
            fullWidth
            value={newCourse.code}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Course Title"
            name="title"
            fullWidth
            value={newCourse.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Credit"
            name="credit"
            type="number"
            fullWidth
            value={newCourse.credit}
            onChange={handleChange}
          />

          {/* ✅ Department Multi-Select Dropdown */}
<FormControl sx={{ mt: 2, width: "50%" }}>
  <InputLabel>Departments</InputLabel>
  <Select
    multiple
    value={newCourse.departments}
    onChange={handleDepartmentChange}
    input={<OutlinedInput label="Departments" />}
    renderValue={(selected) => selected.join(", ")}
  >
    <MenuItem value="All">
      <Checkbox checked={newCourse.departments.length === departments.length} />
      <ListItemText primary="All" />
    </MenuItem>
    {departments.map((dept) => (
      <MenuItem key={dept} value={dept}>
        <Checkbox checked={newCourse.departments.includes(dept)} />
        <ListItemText primary={dept} />
      </MenuItem>
    ))}
  </Select>
</FormControl>

{/* ✅ Level Multi-Select Dropdown */}
<FormControl sx={{ mt: 2, width: "50%" }}>
  <InputLabel>Levels</InputLabel>
  <Select
    multiple
    value={newCourse.levels}
    onChange={handleLevelChange}
    input={<OutlinedInput label="Levels" />}
    renderValue={(selected) => selected.join(", ")}
  >
    <MenuItem value="All">
      <Checkbox checked={newCourse.levels.length === levels.length} />
      <ListItemText primary="All" />
    </MenuItem>
    {levels.map((lvl) => (
      <MenuItem key={lvl} value={lvl}>
        <Checkbox checked={newCourse.levels.includes(lvl)} />
        <ListItemText primary={lvl} />
      </MenuItem>
    ))}
  </Select>
</FormControl>

          {/* ✅ Status (Text) */}
          <TextField
            margin="dense"
            label="Status"
            name="status"
            fullWidth
            value={newCourse.status}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78" }}
            onClick={handleSaveCourse}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
