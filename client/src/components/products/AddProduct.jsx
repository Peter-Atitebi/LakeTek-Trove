import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  IconButton,
  Avatar,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import CategorySelector from "../CategorySelector";
// import { Formik, Form, Field } from "formik";

/**
 * AddProduct
 * Props:
 *  - open (bool)
 *  - onClose (fn)
 *  - onSave (fn) => receives (formData) // optional
 */

// Yup validation schemas for each step
const validationSchema = Yup.object().shape({
  // Step 1: Basic
  name: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
  customSubcategory: Yup.string().when("subcategory", {
    is: "Custom",
    then: Yup.string().required("Custom subcategory is required"),
    otherwise: Yup.string(),
  }),

  // Step 2: Pricing
  priceBefore: Yup.number()
    .typeError("Enter a valid number")
    .min(0, "Price before must be at least 0")
    .nullable(),
  price: Yup.number()
    .typeError("Enter a valid number")
    .min(0, "Price must be at least 0")
    .required("Price is required"),
  stock: Yup.number()
    .typeError("Enter a valid number")
    .integer("Stock must be an integer")
    .min(0, "Stock must be at least 0")
    .required("Stock quantity is required"),
  // Step 3: Media
  description: Yup.string().required("Description is required"),
  imageFile: Yup.mixed().required("Product image is required"),
});

// Stepper steps titles
const steps = ["Basic", "Pricing", "Media", "Review"];

const AddProduct = ({ open, onClose, onSave }) => {
  // Sample categories & subcategories
  const categories = useMemo(
    () => ({
      "Mobile & Accessories": [
        "Smartphones",
        "Feature Phones",
        "Tablets",
        "Power Banks",
        "Chargers",
        "Phone Cases & Covers",
        "Screen Protectors",
        "Memory Cards & Storage (SD cards, flash drives)",
        "Earphones, Headphones, Earbuds",
        "Bluetooth Speakers",
        "Smart Pens & Styluses",
        "Cables (USB-C, Lightning, HDMI, etc.)",
      ],

      "Computers & Laptops": [
        "Laptops",
        "Desktops",
        "Computer Accessories (mice, keyboards, cooling pads, laptop stands)",
        "Monitors",
        "External Storage (HDDs, SSDs, NAS)",
        "Networking Devices (Wi-Fi routers, mesh systems, modems, extenders)",
        "Docking Stations & Hubs",
        "Laptop Batteries & Chargers",
      ],

      "Wearables & Smart Devices": [
        "Smartwatches",
        "Fitness Bands",
        "AR/VR Headsets",
        "Smart Glasses",
        "Health Trackers",
      ],

      "Gaming & Entertainment": [
        "Gaming Consoles",
        "Gaming Accessories (controllers, headsets, racing wheels)",
        "PC Gaming Accessories (gaming mice, mechanical keyboards, RGB gear)",
        "Streaming Devices (Chromecast, Fire Stick, Apple TV, Roku)",
        "Projectors",
        "Drones",
      ],

      "Cameras & Photography": [
        "Digital Cameras",
        "Action Cameras (GoPro, Insta360)",
        "Lenses",
        "Tripods & Stabilizers",
        "Camera Drones",
        "Lighting Equipment (ring lights, softboxes, LED panels)",
        "Memory Cards & Readers",
        "Camera Bags & Cases",
      ],

      "Audio & Music Electronics": [
        "Home Audio Systems",
        "Bluetooth & Portable Speakers",
        "Professional Audio (mixers, studio monitors, microphones)",
        "Musical Electronics",
      ],

      "TVs & Display Tech": [
        "Televisions",
        "TV Accessories (remotes, wall mounts, stands)",
      ],

      "Home & Office Electronics": [
        "Printers & Scanners",
        "Projectors",
        "Smart Home Devices (CCTV, smart bulbs, smart plugs, Alexa, Google Home)",
        "Office Electronics (shredders, laminators, conference gadgets)",
      ],

      "Power & Energy Electronics": [
        "UPS (Uninterruptible Power Supplies)",
        "Inverters",
        "Stabilizers",
        "Solar Panels & Controllers",
        "Rechargeable Fans & Lamps",
      ],

      "Automotive Electronics": [
        "Car Stereos & Speakers",
        "Car Chargers & Mounts",
        "Dash Cameras",
        "GPS Navigation Systems",
        "Car Security Systems",
      ],
      Other: [],
    }),
    []
  );

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    customSubcategory: "",
    priceBefore: "",
    price: "",
    stock: "",
    description: "",
    imageFile: null,
    imagePreview: null,
  });

  // Update basic field
  const handleChange = useCallback(
    (key) => (e) => {
      const value = e.target.value;

      // Clear customSubcategory if category changes
      setForm((s) => ({
        ...s,
        [key]: value,
        ...(key === "category"
          ? { subcategory: "", customSubcategory: "" }
          : {}),
      }));
    },
    []
  );

  // Memoized custom subcategory change handler to prevent re-renders
  const handleCustomSubcategoryChange = useCallback((e) => {
    setForm((s) => ({
      ...s,
      customSubcategory: e.target.value,
    }));
  }, []);

  // When category changes, reset subcategory (simplified since CategorySelector handles all logic)
  useEffect(() => {
    if (!form.category) {
      setForm((s) => ({ ...s, subcategory: "", customSubcategory: "" }));
    }
  }, [form.category]);

  // Image handling
  useEffect(() => {
    return () => {
      // cleanup URL on unmount (if created)
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    };
  }, [form.imagePreview]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    // optional: validate file type/size
    const preview = URL.createObjectURL(file);
    // revoke old preview
    setForm((s) => {
      if (s.imagePreview) URL.revokeObjectURL(s.imagePreview);
      return { ...s, imageFile: file, imagePreview: preview };
    });
  }, []);

  const removeImage = useCallback(() => {
    setForm((s) => {
      if (s.imagePreview) URL.revokeObjectURL(s.imagePreview);
      return { ...s, imageFile: null, imagePreview: null };
    });
    // also clear input value if needed by using ref (not included here)
  }, []);

  // Step validation (returns true if current step is valid)
  const validateStep = useCallback(
    (stepIndex) => {
      if (stepIndex === 0) {
        // Basic: name, category, subcategory (always required since CategorySelector always provides options)
        if (!form.name.trim())
          return { ok: false, message: "Product name is required" };
        if (!form.category)
          return { ok: false, message: "Category is required" };
        if (!form.subcategory)
          return { ok: false, message: "Subcategory is required" };
        // Validate custom subcategory if selected
        if (form.subcategory === "Custom" && !form.customSubcategory?.trim())
          return { ok: false, message: "Custom subcategory is required" };
        return { ok: true };
      }
      if (stepIndex === 1) {
        // Pricing
        const price = parseFloat(form.price);
        const priceBefore = form.priceBefore
          ? parseFloat(form.priceBefore)
          : null;
        const stock = parseInt(form.stock ?? "", 10);

        if (isNaN(price) || price < 0)
          return { ok: false, message: "Enter a valid price" };

        if (form.priceBefore) {
          if (isNaN(priceBefore) || priceBefore < 0)
            return {
              ok: false,
              message: "Enter a valid 'price before' value",
            };
          if (priceBefore <= price)
            return {
              ok: false,
              message: "'Price before' should be greater than current price",
            };
        }
        if (isNaN(stock) || stock < 0)
          return { ok: false, message: "Enter valid stock quantity" };
        return { ok: true };
      }
      if (stepIndex === 2) {
        // Media: description and image required
        if (!form.description.trim())
          return { ok: false, message: "Description is required" };
        if (!form.imageFile)
          return { ok: false, message: "Product image is required" };
        return { ok: true };
      }
      return { ok: true };
    },
    [form]
  );

  const handleNext = useCallback(() => {
    const validation = validateStep(activeStep);
    if (!validation.ok) {
      setSnack({ open: true, severity: "error", message: validation.message });
      return;
    }
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  }, [activeStep, validateStep, steps.length]);

  const handleBack = useCallback(
    () => setActiveStep((s) => Math.max(0, s - 1)),
    []
  );

  const resetForm = useCallback(() => {
    setForm((s) => {
      if (s.imagePreview) URL.revokeObjectURL(s.imagePreview);
      return {
        name: "",
        category: "",
        subcategory: "",
        customSubcategory: "",
        priceBefore: "",
        price: "",
        stock: "",
        description: "",
        imageFile: null,
        imagePreview: null,
      };
    });
    setActiveStep(0);
  }, []);

  const handleSubmit = useCallback(async () => {
    // final validation
    for (let i = 0; i < 3; i++) {
      const v = validateStep(i);
      if (!v.ok) {
        setActiveStep(i);
        setSnack({ open: true, severity: "error", message: v.message });
        return;
      }
    }

    setSubmitting(true);

    try {
      // Build FormData for backend
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("category", form.category);

      // if subcategory is "Custom", replace with the custom input
      const finalSubcategory =
        form.subcategory === "Custom"
          ? form.customSubcategory
          : form.subcategory;
      payload.append("subcategory", finalSubcategory || "");

      payload.append("priceBefore", form.priceBefore || "");
      payload.append("price", form.price);
      payload.append("stock", form.stock);
      payload.append("description", form.description);
      if (form.imageFile) payload.append("image", form.imageFile);

      console.log("Submitting product (FormData):");
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]);
      }

      setSnack({
        open: true,
        severity: "success",
        message: "Product created successfully",
      });
      if (onSave) onSave(payload);
      resetForm();
      onClose?.();
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        severity: "error",
        message: "Failed to create product",
      });
    } finally {
      setSubmitting(false);
    }
  }, [form, validateStep, onSave, resetForm, onClose]);

  // Memoized step content to prevent re-renders
  const stepContent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            {/* Product Name */}
            <TextField
              fullWidth
              label="Product Name"
              value={form.name}
              onChange={handleChange("name")}
            />

            {/* Category Selector */}
            <CategorySelector
              categories={categories}
              selectedCategory={form.category}
              selectedSubcategory={form.subcategory}
              customSubcategory={form.customSubcategory}
              onCategoryChange={(value) =>
                setForm((s) => ({
                  ...s,
                  category: value,
                  subcategory: "",
                  customSubcategory: "",
                }))
              }
              onSubcategoryChange={(value) =>
                setForm((s) => ({
                  ...s,
                  subcategory: value,
                  ...(value !== "Custom" ? { customSubcategory: "" } : {}),
                }))
              }
              onCustomSubcategoryChange={(value) =>
                setForm((s) => ({
                  ...s,
                  customSubcategory: value,
                }))
              }
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Price before (Discount)"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={form.priceBefore}
              onChange={handleChange("priceBefore")}
            />

            <TextField
              fullWidth
              label="Price (NGN)"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={form.price}
              onChange={handleChange("price")}
            />

            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              inputProps={{ min: 0, step: "1" }}
              value={form.stock}
              onChange={handleChange("stock")}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange("description")}
            />

            <div className="flex items-center space-x-4">
              <input
                accept="image/*"
                id="product-image-file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="product-image-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Image
                </Button>
              </label>

              {form.imagePreview ? (
                <div className="flex items-center space-x-2">
                  <Avatar
                    variant="rounded"
                    src={form.imagePreview}
                    alt="preview"
                    sx={{ width: 72, height: 72 }}
                  />
                  <div>
                    <Typography variant="body2">
                      {form.imageFile?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(form.imageFile?.size / 1024).toFixed(0)} KB
                    </Typography>
                  </div>
                  <IconButton onClick={removeImage} aria-label="remove image">
                    <DeleteIcon />
                  </IconButton>
                </div>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No image selected
                </Typography>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Typography variant="h6">Review product</Typography>
            <div className="space-y-2">
              <div>
                <strong>Name:</strong> {form.name || "—"}
              </div>
              <div>
                <strong>Category:</strong> {form.category || "—"} /{" "}
                {form.subcategory === "Custom"
                  ? form.customSubcategory || "—"
                  : form.subcategory || "—"}
              </div>
              <div>
                <strong>Price before:</strong> {form.priceBefore || "—"}
              </div>
              <div>
                <strong>Price:</strong> {form.price || "—"}
              </div>
              <div>
                <strong>Stock:</strong> {form.stock || "—"}
              </div>
              <div>
                <strong>Description:</strong>
                <div className="mt-1 p-2 border border-gray-300 rounded whitespace-pre-wrap">
                  {form.description || "—"}
                </div>
              </div>
              {form.imagePreview && (
                <div className="space-y-1">
                  <Typography variant="subtitle2">Image preview</Typography>
                  <Avatar
                    variant="rounded"
                    src={form.imagePreview}
                    alt="preview"
                    sx={{ width: "100%", height: "100%" }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    activeStep,
    form,
    categories,
    handleChange,
    handleCustomSubcategoryChange,
    handleFileChange,
    removeImage,
  ]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle className="flex items-center justify-between">
          <span>Add new product</span>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box className="space-y-6">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className="p-4">{stepContent}</div>
          </Box>
        </DialogContent>

        <DialogActions className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep < steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Create product"}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setActiveStep(steps.length - 1);
                }}
              >
                Review
              </Button>
            )}
          </div>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

AddProduct.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default AddProduct;
