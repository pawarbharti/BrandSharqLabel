"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { authApi } from "@/lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setSuccess("Password reset successful. You can login now.");
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 6, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        ) : null}

        <TextField
          label="Reset Token"
          fullWidth
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </Button>

        <Typography sx={{ mt: 2 }}>
          Back to <Link href="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}
