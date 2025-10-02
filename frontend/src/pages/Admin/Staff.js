import { Typography, Box } from "@mui/material";

export default function StaffSettings() {
  return (
      <Box p={{ xs: 1, sm: 3 }} sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#2C2C78", fontSize: { xs: 18, sm: 24 } }}>
      Staff Management 
      </Typography>
      <Typography>
        General settings such as result visibility and user permissions will be managed here.
      </Typography>
    </Box>
  );
}
