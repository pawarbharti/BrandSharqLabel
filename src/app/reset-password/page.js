"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { authApi } from "@/lib/api";
import { AppButton, AppInput, useToast } from "@/components/common";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      const message = "Password reset successful. You can login now.";
      setSuccess(message);
      toast.success(message);
    } catch (err) {
      const message = err.message || "Failed to reset password";
      setError(message);
      toast.error(message);
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

        <AppInput
          label="Reset Token"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          sx={{ mb: 2 }}
        />
        <AppInput
          label="New Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <AppButton type="submit" disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </AppButton>

        <Typography sx={{ mt: 2 }}>
          Back to <Link href="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}
