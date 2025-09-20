import { Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { getResults } from "../../api/results";
import { getDepartments } from "../../api/departments";
import { getSessions, getLevels } from "../../api/schools";

export default function AdminResults() {
// Handler for blocking a result (placeholder)
const handleBlockResult = (row) => {
  toast.info(`Block result for ${row.first_name} ${row.last_name} (${row.course})`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  // TODO: Implement API call to block result
};
  // Fetch sessions from API
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    getSessions()
      .then(res => {
        setSessions(res.data.sessions || [])
      })
      .catch(console.error);
  }, []);
  // Fetch departments from API
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    getDepartments()
      .then(res => {
        setDepartments(res.data.departments || [])
      })
      .catch(console.error);
  }, []);
// This is a placeholder component for Results management
const [levels, setLevels] =  useState([]);
useEffect(() => {
    getLevels()
      .then(res => {
        setLevels(res.data.levels || [])
      })
      .catch(console.error);
  }, []);
  // Form state
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [results, setResults] = useState([]);


// Handler to fetch results with selected filters
const handleFetchResults = () => {
  console.log(semester, department, session, level);
  getResults(semester, department, session, level)
    .then(res => {
      setResults(res.data.results);
      toast.success(`${res.data.message} `);
    })
    .catch(err => console.error(err));
};
  

  return (
    <div>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Results Management
      </Typography>

      {/* Form to set session, semester, department */}
      <form style={{ margin: '24px 0' }} onSubmit={e => e.preventDefault()}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="session" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Session:</label>
            <select id="session" value={session} onChange={e => setSession(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Select Session</option>
              {sessions.map(ses => <option key={ses.id} value={ses.id}>{ses.name}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="semester" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Semester:</label>
            <select id="semester" value={semester} onChange={e => setSemester(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Select Semester</option>
              <option key={1} value={1}>First </option>
              <option key={2} value={2}>Second</option>
            </select>
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="department" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Department:</label>
            <select id="department" value={department} onChange={e => setDepartment(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Select Department</option>
              {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="level" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Level:</label>
            <select id="level" value={level} onChange={e => setLevel(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Select Level</option>
              {levels.map(lev => <option key={lev.id} value={lev.id}>{lev.name}</option>)}
            </select>
          </div>
          <button type="button" onClick={handleFetchResults} style={{ padding: '8px 20px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer', minWidth: 120 }}>
            Fetch Results
          </button>
        </div>
      </form>

      {/* Results Table: only show if results have been fetched and not empty */}
      {results && results.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <Typography variant="h6" gutterBottom>Results Table</Typography>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student Name</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Course</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Semester</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Session</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Department</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Level</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total Score</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Grade</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.student_name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.course}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.semester}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.session}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.department}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.level}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.total_score}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.grade}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <button onClick={() => handleBlockResult(row)} style={{ padding: '4px 12px', borderRadius: 4, background: '#d32f2f', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}>Block</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
