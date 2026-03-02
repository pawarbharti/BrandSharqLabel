"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { isAdminUser } from "@/lib/authRole";
import { AppButton, AppInput, useToast } from "@/components/common";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      const loggedInUser = data?.user || null;
      toast.success("Logged in successfully.");
      router.push(isAdminUser(loggedInUser) ? "/admin" : "/account");
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 6, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <AppInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <AppInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <AppButton type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </AppButton>

        <Typography sx={{ mt: 2 }}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Forgot password? <Link href="/forgot-password">Reset it</Link>
        </Typography>
      </Box>
    </Container>
  );
}
