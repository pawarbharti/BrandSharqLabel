"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    const data = await adminApi.users();
    setUsers(data?.users || data?.data || data || []);
  };

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const data = await adminApi.users();
        if (active) setUsers(data?.users || data?.data || data || []);
      } catch (err) {
        if (active) setError(err.message || "Failed to load users");
      }
    }
    run();
    return () => {
      active = false;
    };
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

  const blockUser = async (userId, value) => {
    try {
      setError("");
      await adminApi.updateUser(userId, { action: "block", value });
      setSuccess(value ? "User blocked" : "User unblocked");
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  const resetPassword = async (userId) => {
    try {
      setError("");
      await adminApi.updateUser(userId, { action: "reset_password", newPassword: "password123" });
      setSuccess("Password reset to password123");
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
                <TableCell>Orders</TableCell>
                <TableCell>Blocked</TableCell>
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
                    <TableCell>{user.ordersCount || 0}</TableCell>
                    <TableCell>{user.isBlocked ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {!isAdmin ? (
                          <Button size="small" onClick={() => promote(id)}>
                            Promote
                          </Button>
                        ) : (
                          <Typography sx={{ opacity: 0.7 }}>Already admin</Typography>
                        )}
                        <Button size="small" onClick={() => setSelectedUser(user)}>
                          History
                        </Button>
                        <Button size="small" color={user.isBlocked ? "success" : "warning"} onClick={() => blockUser(id, !user.isBlocked)}>
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                        <Button size="small" onClick={() => resetPassword(id)}>
                          Reset Password
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} fullWidth maxWidth="md">
          <DialogTitle>User Order History</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 1.5 }}>
              {selectedUser?.name || "-"} | {selectedUser?.email || "-"}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(selectedUser?.orders || []).map((order) => (
                  <TableRow key={order.id || order._id}>
                    <TableCell>{order.id || order._id}</TableCell>
                    <TableCell>{order.status || order.orderStatus || "-"}</TableCell>
                    <TableCell>{order.totalAmount || order.total || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUser(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </AdminShell>
    </AdminGuard>
  );
}
