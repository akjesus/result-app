import React, { useState } from "react";
import { useEffect } from "react";
import { getCourses, createCourse, getLevels } from "../../api/schools";
import { getDepartments } from "../../api/departments";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

// ✅ Departments List

export default function AdminCourses() {
  // Handle submit for creating a course
  const handleSubmitCourse = async () => {
    try {
      const payload = {
        code: newCourse.code,
        title: newCourse.title,
        department: newCourse.department,
        level: newCourse.level,
        credit: newCourse.credit,
        active: newCourse.active,
        semester: newCourse.semester,
      };
      const res = await createCourse(payload);
      if (res.data.success) {
        toast.success("Course created successfully!");
        handleClose();
      } else {
        toast.error(res.data.message || "Failed to create course");
      }
      // Optionally refresh courses list here
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create course");
      handleClose();
    }
  };
  // Search state
  const [search, setSearch] = useState("");
  // State for courses and departments
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  // Fetch departments from API
  useEffect(() => {
    getDepartments()
      .then((res) => {
        setDepartments(res.data.departments || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getCourses()
      .then((res) => {
        toast.success("Courses and Departments Fetched!");
        setCourses(res.data.courses || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getLevels()
      .then((res) => {
        toast.success("Levels Fetched!");
        setLevels(res.data.levels || []);
      })
      .catch(console.error);
  }, []);

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    department: "",
    level: "",
    credit: "",
    active: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Open modal for Add/Edit
  const handleOpen = (course = null, index = null) => {
    if (course) {
      setNewCourse({
        code: course.code || "",
        title: course.title || "",
        department: course.department || "",
        level: course.level || "",
        semester: course.semester || "",
        credit: course.credit || "",
        active: course.active || "",
      });
      setEditIndex(index);
    } else {
      setNewCourse({
        code: "",
        title: "",
        department: "",
        level: "",
        semester: "",
        credit: "",
        active: "",
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
    setNewCourse({ ...newCourse, department: event.target.value });
  };
  // ✅ Handle Level with "All" toggle
  const handleLevelChange = (event) => {
    setNewCourse({ ...newCourse, level: event.target.value });
  };

  // Add or Update Course
  const handleSaveCourse = () => {
    if (editIndex !== null) {
      const updated = [...courses];
      updated[editIndex] = newCourse;
      setCourses(updated);
    } else {
      handleSubmitCourse();
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
    <>
      <ToastContainer />
      <Box p={{ xs: 1, sm: 3 }} sx={{ maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#2C2C78", fontSize: { xs: 18, sm: 24 } }}>
            Manage Courses 
            </Typography>

        {/* Add Course Button & Search Box */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            onClick={() => handleOpen()}
          >
            Add Course
          </Button>
          <TextField
            label="Search Courses"
            variant="outlined"
            size="small"
            sx={{ minWidth: 250 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <TableCell sx={{ fontWeight: "bold" }}>active</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses
              .filter(
                (course) =>
                  course.code.toLowerCase().includes(search.toLowerCase()) ||
                  course.title.toLowerCase().includes(search.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.departments}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.credit}</TableCell>
                  <TableCell>{course.active}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <IconButton
                        color="primary"
                        size="small"
                        sx={{ bgcolor: '#e3e3fa', borderRadius: 2, p: 1, boxShadow: 1, ':hover': { bgcolor: '#d1d1f7' } }}
                        onClick={() => handleOpen(course, index)}
                        aria-label="Edit Course"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        sx={{ bgcolor: '#fdecea', borderRadius: 2, p: 1, boxShadow: 1, ':hover': { bgcolor: '#f9d6d5' } }}
                        onClick={() => handleDelete(index)}
                        aria-label="Delete Course"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
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
          <DialogTitle>
            {editIndex !== null ? "Edit Course" : "Add Course"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Course Code"
              name="code"
              sx={{ width: "95%", mr: 2 }}
              value={newCourse.code}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Course Title"
              name="title"
              sx={{ width: "95%", mr: 2 }}
              value={newCourse.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Credit"
              name="credit"
              type="number"
              sx={{ width: 250, mr: 2 }}
              value={newCourse.credit}
              onChange={handleChange}
            />
            {/* ✅ active (Text) */}
            <TextField
              select
              margin="dense"
              label="Active"
              name="active"
              sx={{ width: 250, mr: 2 }}
              value={newCourse.active}
              onChange={handleChange}
            >
              <MenuItem value="1">Yes</MenuItem>
              <MenuItem value="2">No</MenuItem>
            </TextField>
            <TextField
              select
              margin="dense"
              label="Semester"
              name="semester"
              sx={{ width: 250, mr: 2 }}
              value={newCourse.semester}
              onChange={handleChange}
            >
              <MenuItem value="1">First Semester</MenuItem>
              <MenuItem value="2">Second Semester</MenuItem>
            </TextField>

            {/* ✅ Department Multi-Select Dropdown */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              <FormControl sx={{ width: 390 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newCourse.department}
                  onChange={handleDepartmentChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 390 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={newCourse.level}
                  onChange={handleLevelChange}
                  label="Level"
                >
                  {levels.map((lvl) => (
                    <MenuItem key={lvl.id || lvl} value={lvl.id || lvl}>
                      {lvl.name || lvl}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
            </Box>
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
    </>
  );
}
