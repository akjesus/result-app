import React, { useState, useEffect } from "react";
import { getDepartments } from "../../api/departments";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
  Paper,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadResultsModal from "./UploadResultsModal";

export default function ResultManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [departments, setDepartments] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments()
      .then(res => {
        setDepartments(res.data.departments);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredDepartments = departments.filter(
    (departments) =>
      departments.name.toLowerCase().includes(search.toLowerCase())
      || departments.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <ToastContainer />
    <Box p={3}>
      {/* Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#2C2C78" }}>
        Result Management
      </Typography>
      {/* Quick Navigation Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#2C2C78" }}
          onClick={() => navigate("/admin/results")}
        >
          Results
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/probation")}>
          Probation List
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/settings")}>
          Settings
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/departments")}>
          Departments
        </Button>
        <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => setOpenUploadModal(true)}>
          Upload Results (CSV)
        </Button>
      </Box>

      {/* Search */}
      <TextField
        label="Search by Department or Faculty"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Departments & Faculties Table with Pagination */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Departments</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Faculties</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((departments) => (
                  <TableRow key={departments.id}>
                    <TableCell>{departments.name}</TableCell>
                    <TableCell>{departments.school}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/admin/results/${departments.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredDepartments.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      {/* Upload Results Modal */}
      <UploadResultsModal open={openUploadModal} handleClose={() => setOpenUploadModal(false)} />
    </Box>
    </>
  );
}
