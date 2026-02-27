"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    const data = await adminApi.users();
    setUsers(data?.users || data?.data || data || []);
  };

  useEffect(() => {
    loadUsers().catch((err) => setError(err.message || "Failed to load users"));
  }, []);

  const promote = async (userId) => {
    try {
      setError("");
      await adminApi.promote({ userId });
      setSuccess("User promoted to admin");
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to promote user");
    }
  };

  return (
    <AdminGuard>
      <AdminShell title="Manage Users">
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Users
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const id = user._id || user.id;
                const role = user.role || (user.isAdmin ? "admin" : "user");
                const isAdmin = String(role).toLowerCase() === "admin";
                return (
                  <TableRow key={id}>
                    <TableCell>{user.name || "-"}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {!isAdmin ? (
                          <Button size="small" onClick={() => promote(id)}>
                            Promote
                          </Button>
                        ) : (
                          <Typography sx={{ opacity: 0.7 }}>Already admin</Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </AdminShell>
    </AdminGuard>
  );
}
