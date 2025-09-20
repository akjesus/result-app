import React, { useEffect, useState } from "react";
import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from "../../api/departments";
import { getSchools } from "../../api/schools";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Pagination
} from "@mui/material";
import { Edit,Add, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";

export default function DepartmentsPage() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [departments, setDepartments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [editingDept, setEditingDept] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Search / Filter
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchDepartments();
    fetchSchools();
  }, []);

  function fetchDepartments() {
    getDepartments()
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }

  function fetchSchools() {
    getSchools()
      .then(res => setSchools(res.data))
      .catch(err => console.error(err));
  }

  function onSubmit(data) {
    if (editingDept) {
      updateDepartment(editingDept.id, data)
        .then(() => {
          reset();
          setEditingDept(null);
          setOpenDialog(false);
          fetchDepartments();
          showSnackbar("Department updated successfully!", "success");
        })
        .catch(err => showSnackbar("Failed to update department", "error"));
    } else {
      addDepartment(data)
        .then(() => {
          reset();
          setOpenDialog(false);
          fetchDepartments();
          showSnackbar("Department added successfully!", "success");
        })
        .catch(err => showSnackbar("Failed to add department", "error"));
    }
  }

  function handleEdit(dept) {
    setEditingDept(dept);
    setValue("name", dept.name);
    setValue("school", dept.school);
    setOpenDialog(true);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteDepartment(id)
        .then(() => {
          fetchDepartments();
          showSnackbar("Department deleted successfully!", "success");
        })
        .catch(err => showSnackbar("Failed to delete department", "error"));
    }
  }

  function showSnackbar(message, severity) {
    setSnackbar({ open: true, message, severity });
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtered & paginated departments
 const filtered = departments.filter(dept => {
  const name = dept.name ? dept.name.toLowerCase() : "";
  const school = dept.school ? dept.school.toLowerCase() : "";
  return name.includes(search.toLowerCase()) || school.includes(search.toLowerCase());
});


  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filtered.length / rowsPerPage);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}><strong>Departments</strong></Typography>

      {/* Search + Add Button Container */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search by Department or School"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "40%" }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Department
        </Button>
      </Box>

      {/* Departments Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
                           <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>School</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(dept => (
              <TableRow key={dept.id}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.school}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(dept)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(dept.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">No departments found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditingDept(null); }}>
        <DialogTitle>{editingDept ? "Edit Department" : "Add Department"}</DialogTitle>
        <DialogContent>
          <form id="department-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Department Name"
              {...register("name", { required: true })}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>School / Faculty</InputLabel>
              <Select {...register("school", { required: true })} defaultValue={editingDept?.school || ""}>
                {schools.map(school => (
                  <MenuItem key={school.id} value={school.name}>{school.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditingDept(null); }}>Cancel</Button>
          <Button type="submit" form="department-form" variant="contained" color="primary">
            {editingDept ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
