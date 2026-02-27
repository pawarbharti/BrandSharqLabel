"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const { verifyEmail } = useAuth();

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await verifyEmail(email, code);
      setSuccess("Email verified successfully. Please login.");
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 6, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Verify Email
      </Typography>
      <Typography sx={{ opacity: 0.8, mb: 2 }}>
        Enter the OTP sent to your email.
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
        <TextField
          label="OTP Code"
          fullWidth
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>

        <Typography sx={{ mt: 2 }}>
          Already verified? <Link href="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}
