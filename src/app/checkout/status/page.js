"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { AppButton } from "@/components/common";

export default function CheckoutStatusPage() {
  const searchParams = useSearchParams();
  const result = searchParams.get("result") || "failed";
  const message = searchParams.get("message") || "Something went wrong.";
  const orderId = searchParams.get("orderId") || "";
  const isSuccess = result === "success";

  return (
    <Box sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={isSuccess ? "Order Confirmed" : "Order Failed"}
                color={isSuccess ? "success" : "error"}
              />
              {orderId ? <Chip label={`Order ID: ${orderId}`} variant="outlined" /> : null}
            </Stack>

            <Typography variant="h5" sx={{ mb: 1 }}>
              {isSuccess ? "Thank you for your order" : "Unable to complete order"}
            </Typography>
            <Typography sx={{ opacity: 0.8, mb: 2 }}>{message}</Typography>

            <Stack direction="row" spacing={1}>
              {isSuccess ? (
                <AppButton component={Link} href="/account">
                  Go to My Orders
                </AppButton>
              ) : (
                <AppButton component={Link} href="/checkout">
                  Try Again
                </AppButton>
              )}
              <AppButton component={Link} href="/shop" variant="outlined">
                Continue Shopping
              </AppButton>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
