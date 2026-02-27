"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(name, email, password, phone);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 6, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Sign up
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

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
          label="Phone (optional)"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>

        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </Typography>
      </Box>
    </Container>
  );
}
