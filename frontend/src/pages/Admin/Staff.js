import { 
  Typography, 
  Box, 
  Table, 
  TableHead, 
  TableRow, 
  TextField, 
  TableCell, 
  TableBody, 
  IconButton, 
  Tooltip, 
  Button,
Dialog,
DialogTitle,
DialogActions,
DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import { getStaff, deleteStaff, createStaff, resetPassword, updateStaff } from "../../api/staff";
import { Edit, Delete, Visibility, LockReset } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StaffSettings() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ first_name: '', last_name: '', email: '', role: '' });
  const handleCreateOpen = () => {
    setCreateModalOpen(true);
    setNewStaff({ first_name: '', last_name: '', email: '', role: '' });
  };
  const handleCreateClose = () => {
    setCreateModalOpen(false);
  };
  const handleCreateSave = async () => {
    try {
      const res = await createStaff(newStaff);
      if(res.data.success) {
        setStaff(prev => [...prev, res.data.staff]);
        toast.success('Staff created successfully');
        setCreateModalOpen(false);
        return;
      }
      else {
        toast.error(res.data.message || 'Failed to create staff');
        return;
      }

    }
    catch(error) {
      toast.error(error.response?.data?.message || 'Error creating staff');
      return;
    } 
  };

  const handleResetPassword = async (staffMember) => {
    if (window.confirm(`Reset password for ${staffMember.first_name} ${staffMember.last_name}?`)) {
      try {
        const res = await resetPassword(staffMember.id);
        if(res.data.success) {
          toast.success('Password reset successfully');
          return;
        }
        else {
          toast.error(res.data.message || 'Failed to reset password');
          return;
        }
      }
      catch(error) {
        toast.error(error.response?.data?.message || 'Error resetting password');
      }
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    getStaff()
      .then(res => setStaff(res.data.staff || []))
      .catch(() => setStaff([]));
  }, []);

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedStaff(null);
  };

  const handleModalSave = async () => {
    // TODO: Implement save logic (API call)
      if(!selectedStaff) {
        return;}
    try {
      const res = await updateStaff(selectedStaff, selectedStaff.id);
      if(res.data.success) {
        setStaff(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
        toast.success('Staff updated successfully');
        setModalOpen(false);
        setSelectedStaff(null);
        return;
      }
      else {
        toast.error(res.data.message || 'Failed to update staff');
        return;
      }

    }
    catch(error) {
      toast.error(error.response?.data?.message || 'Error updating staff');
      return;
    }
    
  };

  const handleDelete = async (staffMember) => {
    if (window.confirm(`Delete staff: ${staffMember.name || staffMember.email}?`)) {
      try {
        const res = await deleteStaff(staffMember.id);
        if(res.data.success) {
          setStaff(staff.filter(s => s.id !== staffMember.id));
          toast.success('Staff deleted successfully');
          return;
        }
        else {
          toast.error(res.data.message || 'Failed to delete staff');
          return;
        }
      }
      catch(error) {
        toast.error(error.response?.data?.message || 'Error deleting staff');
      }
    }
  };

  return (
    <>
    <ToastContainer />
    <Box p={{ xs: 1, sm: 3 }} sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#2C2C78", fontSize: { xs: 18, sm: 24 } }}>
        Staff Management
      </Typography>
      <Button variant="contained" sx={{ mb: 2, bgcolor: '#2C2C78' }} onClick={handleCreateOpen}>Add New Staff</Button>
      {/* Create New Staff Modal */}
      <Dialog open={createModalOpen} onClose={handleCreateClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Staff</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
              label="First Name"
              value={newStaff.first_name}
              fullWidth
              onChange={e => setNewStaff({ ...newStaff, first_name: e.target.value })}
            />
            
            <TextField
              label="Last Name"
              value={newStaff.last_name}
              fullWidth
              onChange={e => setNewStaff({ ...newStaff, last_name: e.target.value })}
            />
            <TextField
              label="Username"
              value={newStaff.username}
              fullWidth
              onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
            />
            <TextField
              label="Email"
              value={newStaff.email}
              fullWidth
              onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
            />
            <TextField
              label="Role"
              select
              value={newStaff.role}
              fullWidth
              onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreateSave} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      
      <Table sx={{ minWidth: 320, width: '100%', overflowX: 'auto', mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((s, idx) => (
            <TableRow key={idx}>
              <TableCell>{s.first_name} {s.last_name}</TableCell>
              <TableCell>{s.username || '-'}</TableCell>
              <TableCell>{s.email || '-'}</TableCell>
              <TableCell>{s.role || '-'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                  <Tooltip title="View" arrow>
                    <IconButton color="primary" onClick={() => handleView(s)}><Visibility fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <IconButton color="secondary" onClick={() => handleEdit(s)}><Edit fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton color="error" onClick={() => handleDelete(s)}><Delete fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Reset Password" arrow>
                    <IconButton color="info" onClick={() => handleResetPassword(s)}><LockReset fontSize="small" /></IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {staff.length === 0 && (
        <Typography color="text.secondary" align="center">No staff found.</Typography>
      )}

      {/* Staff View/Edit Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>{modalMode === 'edit' ? 'Edit Staff' : 'View Staff'}</DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              
              <TextField
                label="First Name"
                value={selectedStaff.first_name || ''}
                fullWidth
                InputProps={{ readOnly: modalMode === 'view' }}
                onChange={e => {
                  if (modalMode === 'edit') setSelectedStaff({ ...selectedStaff, first_name: e.target.value });
                }}
              />
              <TextField
                label="Last Name"
                value={selectedStaff.last_name || ''}
                fullWidth
                InputProps={{ readOnly: modalMode === 'view' }}
                onChange={e => {
                  if (modalMode === 'edit') setSelectedStaff({ ...selectedStaff, last_name: e.target.value });
                }}
              />
              <TextField
                label="Username"
                value={selectedStaff.username || ''}
                fullWidth
                InputProps={{ readOnly: modalMode === 'view' }}
                onChange={e => {
                  if (modalMode === 'edit') setSelectedStaff({ ...selectedStaff, username: e.target.value });
                }}
              />
              <TextField
                label="Email"
                value={selectedStaff.email || ''}
                fullWidth
                InputProps={{ readOnly: modalMode === 'view' }}
                onChange={e => {
                  if (modalMode === 'edit') setSelectedStaff({ ...selectedStaff, email: e.target.value });
                }}
              />
              {modalMode === 'edit' ? (
                <TextField
                  label="Role"
                  select
                  value={selectedStaff.role || ''}
                  fullWidth
                  onChange={e => setSelectedStaff({ ...selectedStaff, role: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Role</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </TextField>
              ) : (
                <TextField
                  label="Role"
                  value={selectedStaff.role || ''}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Close</Button>
          {modalMode === 'edit' && <Button onClick={handleModalSave} variant="contained">Save</Button>}
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}
