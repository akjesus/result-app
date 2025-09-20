import React, { useEffect, useState } from "react";
import { getSchools, addSchool, updateSchool, deleteSchool } from "../../api/schools";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
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
import { Edit, Delete, Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";

export default function SchoolsPage() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [schools, setSchools] = useState([]);
  const [editingSchool, setEditingSchool] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Search / Filter
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = () => {
    getSchools()
      .then(res => setSchools(res.data))
      .catch(err => console.error(err));
  };

  const onSubmit = (data) => {
    if (editingSchool) {
      updateSchool(editingSchool.id, data)
        .then(() => {
          reset();
          setEditingSchool(null);
          setOpenDialog(false);
          fetchSchools();
          showSnackbar("School updated successfully!", "success");
        })
        .catch(() => showSnackbar("Failed to update school", "error"));
    } else {
      addSchool(data)
        .then(() => {
          reset();
          setOpenDialog(false);
          fetchSchools();
          showSnackbar("School added successfully!", "success");
        })
        .catch(() => showSnackbar("Failed to add school", "error"));
    }
  };

  const handleEdit = (school) => {
    setEditingSchool(school);
    setValue("name", school.name);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      deleteSchool(id)
        .then(() => {
          fetchSchools();
          showSnackbar("School deleted successfully!", "success");
        })
        .catch(() => showSnackbar("Failed to delete school", "error"));
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtered & paginated schools
  const filtered = schools.filter(school => school.name.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filtered.length / rowsPerPage);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Schools / Faculties</Typography>

      {/* Search + Add Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search by School"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "50%" }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add School
        </Button>
      </Box>

      {/* Schools Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(school => (
              <TableRow key={school.id}>
                <TableCell>{school.name}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(school)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(school.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">No schools found</TableCell>
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
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditingSchool(null); }}>
        <DialogTitle>{editingSchool ? "Edit School" : "Add School"}</DialogTitle>
        <DialogContent>
          <form id="school-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="School Name"
              {...register("name", { required: true })}
              sx={{ mt: 2 }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditingSchool(null); }}>Cancel</Button>
          <Button type="submit" form="school-form" variant="contained" color="primary">
            {editingSchool ? "Update" : "Add"}
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
