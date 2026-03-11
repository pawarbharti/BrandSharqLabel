"use client";

import { useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";

import { COLLECTION_OPTIONS, formatCurrency } from "./productFormUtils";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function ProductListTab({
  products,
  categories,
  categoryFilter,
  collectionFilter,
  onCategoryFilterChange,
  onCollectionFilterChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const gridRef = useRef(null);

  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await onDeleteProduct(deleteId);
    setDeleteId(null);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Image",
        width: 90,
        sortable: false,
        filter: false,
        cellRenderer: ({ data }) =>
          data?.images?.[0] ? (
            <img
              src={data.images[0]}
              alt={data?.name}
              style={{
                width: 44,
                height: 44,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            "-"
          ),
      },

      {
        field: "name",
        headerName: "Product",
        flex: 1.5,
        minWidth: 180,
        cellRenderer: ({ value }) => (
          <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        ),
      },

      {
        field: "category",
        headerName: "Category",
        width: 140,
      },

      {
        field: "collection",
        headerName: "Collection",
        width: 140,
      },

      {
        field: "price",
        headerName: "Price",
        width: 120,
        valueFormatter: (p) => formatCurrency(p.value || 0),
      },

      {
        field: "mrp",
        headerName: "MRP",
        width: 120,
        valueFormatter: (p) => formatCurrency(p.value || 0),
      },

      {
        field: "stock",
        headerName: "Stock",
        width: 120,
        cellRenderer: ({ value }) =>
          value <= 5 ? (
            <Chip
              icon={<WarningIcon />}
              label={value}
              color="error"
              size="small"
            />
          ) : (
            <Chip label={value} color="success" size="small" />
          ),
      },

      {
        headerName: "Sizes",
        width: 120,
        valueGetter: ({ data }) =>
          data?.sizes?.length ? data.sizes.join(", ") : "-",
      },

      {
        headerName: "Colors",
        width: 140,
        valueGetter: ({ data }) =>
          data?.colors?.length ? data.colors.join(", ") : "-",
      },

      {
        field: "rating",
        headerName: "Rating",
        width: 110,
        valueFormatter: (p) =>
          p.value ? `${p.value} (${p.data.reviewCount})` : "-",
      },

      {
        field: "viewCount",
        headerName: "Views",
        width: 110,
      },

      {
        headerName: "Actions",
        width: 140,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const id = params.data?._id || params.data?.id;

          return (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="View">
                <IconButton
                  size="small"
                  component="a"
                  href={`/shop/${params.data?.slug || id}`}
                  target="_blank"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Edit">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEditProduct(params.data)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip> */}

              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeleteId(id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [onEditProduct],
  );

  return (
    <Paper sx={{ p: 3 }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h6">Products</Typography>
          <Typography sx={{ opacity: 0.7 }}>
            Manage your product catalog
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onAddProduct}>
            Add Product
          </Button>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c._id || c.id} value={c.slug}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Collection</InputLabel>
            <Select
              label="Collection"
              value={collectionFilter}
              onChange={(e) => onCollectionFilterChange(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {COLLECTION_OPTIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* SEARCH */}
      <TextField
        size="small"
        placeholder="Search products..."
        onChange={(e) => gridRef.current?.api?.setQuickFilter(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, maxWidth: 300 }}
      />

      {/* GRID */}
      <Box
        className="ag-theme-quartz"
        sx={{
          width: "100%",
          height: 620,
          borderRadius: 3,
          overflow: "hidden",

          /* Grid sizing */
          "--ag-row-height": "72px",
          "--ag-header-height": "60px",
          "--ag-font-size": "14px",

          /* Colors */
          "--ag-border-color": "rgba(0,0,0,0.06)",
          "--ag-header-background-color": "#f5f6f8",
          "--ag-header-foreground-color": "#222",

          /* Zebra rows */
          "--ag-odd-row-background-color": "#ffffff",
          "--ag-even-row-background-color": "#f9fafb",

          /* Hover */
          "--ag-row-hover-color": "rgba(25,118,210,0.06)",

          /* Selection */
          "--ag-selected-row-background-color": "rgba(25,118,210,0.12)",

          /* Font */
          "--ag-font-family": "Inter, Roboto, sans-serif",

          /* Shadow */
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",

          /* Header style */
          "& .ag-header-cell-label": {
            fontWeight: 600,
            fontSize: "13px",
          },

          /* Row cells */
          "& .ag-cell": {
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
          },

          /* Remove harsh borders */
          "& .ag-row": {
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          },
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={products}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={10}
          animateRows
          rowHeight={72}
          headerHeight={60}
          getRowId={(params) => String(params.data?._id || params.data?.id)}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 130,
          }}
        />
      </Box>

      {/* DELETE CONFIRMATION */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Product?</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
