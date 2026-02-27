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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSuccess("If this email exists, reset instructions have been sent.");
    } catch (err) {
      setError(err.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 6, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Forgot Password
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
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Submitting..." : "Send Reset Link"}
        </Button>

        <Typography sx={{ mt: 2 }}>
          Have token already? <Link href="/reset-password">Reset Password</Link>
        </Typography>
      </Box>
    </Container>
  );
}
