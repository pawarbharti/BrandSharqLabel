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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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
      await authApi.forgotPassword({ email });
      const message = "If this email exists, reset instructions have been sent.";
      setSuccess(message);
      toast.success(message);
    } catch (err) {
      const message = err.message || "Failed to send reset instructions";
      setError(message);
      toast.error(message);
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

        <AppInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <AppButton type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Send Reset Link"}
        </AppButton>

        <Typography sx={{ mt: 2 }}>
          Have token already? <Link href="/reset-password">Reset Password</Link>
        </Typography>
      </Box>
    </Container>
  );
}
