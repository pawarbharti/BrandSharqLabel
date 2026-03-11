"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

import ProductEditorTab from "./ProductEditorTab";

import {
  cloneProductForm,
  createEmptyVariant,
  createInitialForm,
  normalizeProductToForm,
  readFileAsDataUrl,
  toSlug,
  validateForm,
} from "./productFormUtils";

import { categoriesApi, productsApi } from "@/lib/api";

export default function ProductEditorScreen({ productId = "" }) {
  const router = useRouter();
  const isEditing = Boolean(productId);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(() => createInitialForm());
  const [initialForm, setInitialForm] = useState(() => createInitialForm());

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [uploading, setUploading] = useState(false);
  const [dragImageId, setDragImageId] = useState("");

  const [loading, setLoading] = useState(isEditing);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const totalStock = useMemo(
    () =>
      form.variants.reduce(
        (sum, variant) => sum + Math.max(0, Number(variant.stock || 0)),
        0
      ),
    [form.variants]
  );

  const selectedCategoryValue = useMemo(() => {
    if (form.categoryId) return form.categoryId;

    const match = categories.find(
      (category) => category.slug === form.category
    );

    return match ? match._id || match.id : "";
  }, [categories, form.category, form.categoryId]);

  /* ---------------- Load Categories ---------------- */

  useEffect(() => {
    categoriesApi
      .list()
      .then((data) =>
        setCategories(data?.categories || data?.data || data || [])
      )
      .catch((err) => setError(err.message || "Failed to load categories"));
  }, []);

  /* ---------------- Load Product ---------------- */

  useEffect(() => {
    if (!isEditing) {
      const nextForm = createInitialForm();
      setForm(nextForm);
      setInitialForm(cloneProductForm(nextForm));
      setLoading(false);
      return;
    }

    setLoading(true);

    productsApi
      .getById(productId)
      .then((data) => {
        const product = data?.product || data?.data || data;
        const normalized = normalizeProductToForm(product);

        setForm(normalized);
        setInitialForm(cloneProductForm(normalized));
      })
      .catch((err) => setError(err.message || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [isEditing, productId]);

  /* ---------------- Field Updates ---------------- */

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setFormErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateVariant = (index, key, value) => {
    setForm((prev) => {
      const nextVariants = prev.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant
      );
      return { ...prev, variants: nextVariants };
    });
  };

  /* ---------------- Category ---------------- */

  const handleCategoryChange = (value) => {
    const selected = categories.find(
      (category) => String(category._id || category.id) === String(value)
    );

    setForm((prev) => ({
      ...prev,
      categoryId: value,
      category: selected?.slug || "",
    }));

    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.category;
      return next;
    });
  };

  /* ---------------- Images ---------------- */

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await Promise.all(
        files.map(async (file, index) => ({
          id: `upload_${Date.now()}_${index}`,
          src: await readFileAsDataUrl(file),
          name: file.name,
        }))
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));

      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    } catch (err) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const moveImage = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;

    setForm((prev) => {
      const fromIndex = prev.images.findIndex((img) => img.id === fromId);
      const toIndex = prev.images.findIndex((img) => img.id === toId);

      if (fromIndex < 0 || toIndex < 0) return prev;

      const nextImages = [...prev.images];

      const [moved] = nextImages.splice(fromIndex, 1);

      nextImages.splice(toIndex, 0, moved);

      return { ...prev, images: nextImages };
    });
  };

  const removeImage = (imageId) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  /* ---------------- Variants ---------------- */

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants:
        prev.variants.length > 1
          ? prev.variants.filter((_, i) => i !== index)
          : prev.variants,
    }));
  };

  /* ---------------- Reset ---------------- */

  const handleReset = () => {
    setForm(cloneProductForm(initialForm));
    setFormErrors({});
    setDragImageId("");
    setError("");
  };

  /* ---------------- Payload ---------------- */

  const buildPayload = () => {
    const cleanedCare = form.careInstructions
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const variants = form.variants.map((variant, index) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color.trim(),
      colorHex: variant.colorHex || "#111111",
      stock: Math.max(0, Number(variant.stock || 0)),
      sku: `${toSlug(form.name) || "product"}-${variant.size}-${index + 1}`,
    }));

    return {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      categoryId: form.categoryId || undefined,
      collection: form.collection.trim(),
      price: Number(form.price || 0),
      mrp: Number(form.mrp || 0),
      originalPrice: Number(form.originalPrice || form.mrp || 0),
      stock: totalStock,
      images: form.images.map((image) => image.src).filter(Boolean),
      variants,
      colors: Array.from(new Set(variants.map((v) => v.color))),
      isNew: Boolean(form.isNew),
      isBestSeller: Boolean(form.isBestSeller),
      isLimited: Boolean(form.isLimited),
      slug: toSlug(form.slug || form.name),
      productSpecifications: {
        material: form.material.trim(),
        fit: form.fit.trim(),
        pattern: form.pattern.trim(),
        neckline: form.neckline.trim(),
        sleeveType: form.sleeveType.trim(),
        careInstructions: cleanedCare,
      },
      seo: {
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
      },
    };
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateForm(form);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      const firstError = Object.values(validationErrors)[0];

      setToast({
        open: true,
        message: firstError || "Fix the highlighted fields",
        severity: "error",
      });

      setTimeout(() => {
        document.querySelector(".Mui-error")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      return;
    }

    try {
      const payload = buildPayload();

      if (isEditing) {
        await productsApi.update(productId, payload);
      } else {
        await productsApi.create(payload);
      }

      setToast({
        open: true,
        message: isEditing
          ? "Product updated successfully"
          : "Product created successfully",
        severity: "success",
      });

      setTimeout(() => {
        router.push("/admin/products");
      }, 800);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to save product",
        severity: "error",
      });
    }
  };

  return (
    <>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {loading ? (
        <Alert severity="info">Loading product editor...</Alert>
      ) : (
        <ProductEditorTab
          form={form}
          formErrors={formErrors}
          categories={categories}
          selectedCategoryValue={selectedCategoryValue}
          totalStock={totalStock}
          uploading={uploading}
          dragImageId={dragImageId}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onBackToList={() => router.push("/admin/products")}
          onReset={handleReset}
          onFieldChange={updateField}
          onCategoryChange={handleCategoryChange}
          onImageUpload={handleImageUpload}
          onImageDragStart={setDragImageId}
          onImageDrop={(fromId, toId) => {
            moveImage(fromId, toId);
            setDragImageId("");
          }}
          onImageRemove={removeImage}
          onVariantChange={updateVariant}
          onVariantAdd={addVariant}
          onVariantRemove={removeVariant}
        />
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}