import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import { getCourses, getSessions } from "../../api/schools";
import { bulkUploadResults } from "../../api/results";
import { toast } from "react-toastify";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function UploadResultsModal({ open, handleClose }) {
  // Wrap handleClose to reset modal state
  const handleModalClose = () => {
    setCourse("");
    setSemester("");
    setSession("");
    setFile(null);
    setSemesters([]);
    handleClose();
  };
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("");
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    if (open) {
      getCourses()
        .then(res => {
          setCourses(res.data.courses || []);
        })
        .catch(() => setCourses([]));
      getSessions()
        .then(res => {
          setSessions(res.data.sessions || []);
        })
        .catch(() => setSessions([]));
      setSemesters([]); // Reset semesters when modal opens
    }
  }, [open]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fetch semesters for selected session
  useEffect(() => {
    if (session) {
      // Assume getSessions returns sessions with semesters array
      const selectedSession = sessions.find(s => s.id === session);
      if (selectedSession && selectedSession.semesters) {
        setSemesters(selectedSession.semesters);
      } else {
        setSemesters([]);
      }
    } else {
      setSemesters([]);
    }
  }, [session, sessions]);

  const handleUpload = async () => {
    if (!file || !course || !semester || !session) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("session_id", session);
    formData.append("course_id", course);
    formData.append("semester_id", semester);
    
    try {
      const res = await bulkUploadResults(formData);
      if(res.data.success)
      toast.success(res.data.message || "Results uploaded successfully");
        else {
        toast.error(res.data.message)
    }
      handleModalClose();
    } catch (err) {
      // Optionally show an error toast
      toast.error(err.response?.data?.message || "Upload failed");
      console.error("Bulk upload failed:", err.response?.data?.message);
      handleModalClose();
    }
  };

  return (
  <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Upload Results (CSV)</Typography>
        <TextField
          select
          label="Course"
          value={course}
          onChange={e => setCourse(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {courses.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.code + " - " + c.title}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Session"
          value={session}
          onChange={e => setSession(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {sessions.map((s) => (
            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Semester"
          value={semester}
          onChange={e => setSemester(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          disabled={!semesters.length}
        >
          {semesters.map((sem) => (
            <MenuItem key={sem.id} value={sem.id}>{sem.name}</MenuItem>
          ))}
        </TextField>
        
        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          Choose CSV File
          <input type="file" hidden accept=".csv" onChange={handleFileChange} />
        </Button>
        {file && <Typography variant="body2" mb={2}>Selected: {file.name}</Typography>}
        <Button variant="contained" color="primary" fullWidth onClick={handleUpload} disabled={!file || !course || !semester || !session}>
          Upload
        </Button>
      </Box>
    </Modal>
  );
}
