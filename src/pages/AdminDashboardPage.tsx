import { useState, useEffect } from "react";
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import {
  getCurrencyRates,
  setCurrencyRates,
  type CurrencyCode,
} from "../services/currencyService";
import { populateSampleProducts } from "../utils/populateProducts";
import { makeUserAdmin } from "../utils/userUtils";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import type { Product, ProductType } from "../types/product";
import { AdminHeader, AdminMessage, AdminProductTable } from "../components/admin";

interface ProductFormData {
  name: string;
  brand: string;
  type: ProductType;
  price: string;
  oldPrice: string;
  gender: "men" | "women" | "unisex" | "kids";
  imageUrl: string;
  images: string[];
  description: string;
  slug: string;
  frameMaterial: string;
  frameColor: string;
  frameShape: string;
  lensColor: string;
  isNew: boolean;
  isBestSeller: boolean;
  blueLightFilter: boolean;
}

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProductType | "all">("all");

  const [currencyRates, setCurrencyRatesState] = useState<
    Record<CurrencyCode, number>
  >({ EUR: 1, USD: 1.08, ALL: 104 });
  const [currencyRatesLoading, setCurrencyRatesLoading] = useState(false);
  const [currencyRatesSaving, setCurrencyRatesSaving] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    brand: "",
    type: "glasses",
    price: "",
    oldPrice: "",
    gender: "unisex",
    imageUrl: "",
    images: [],
    description: "",
    slug: "",
    frameMaterial: "",
    frameColor: "",
    frameShape: "",
    lensColor: "",
    isNew: false,
    isBestSeller: false,
    blueLightFilter: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCurrencyRatesLoading(true);
    getCurrencyRates()
      .then((data) => {
        if (!cancelled) setCurrencyRatesState(data.rates);
      })
      .finally(() => {
        if (!cancelled) setCurrencyRatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts);
      setMessage(`Loaded ${allProducts.length} products`);
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error loading products: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validFrameMaterials = [
        "metal",
        "plastic",
        "acetate",
        "titanium",
        "mixed",
        "nylon",
        "carbon fiber",
        "TR90",
        "recycled acetate",
        "acetate/metal",
      ];

      const validFrameShapes = [
        "round",
        "square",
        "cat-eye",
        "oval",
        "aviator",
        "rectangular",
        "oversized",
        "pilot",
        "rounded square",
        "wrapped",
        "sport",
        "browline",
      ];

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
        imageUrl: formData.imageUrl || undefined,
        images: (() => {
          const valid = formData.images.filter(Boolean);
          return valid.length > 0 ? valid : undefined;
        })(),
        rating: 0,
        reviewCount: 0,
        frameMaterial:
          formData.frameMaterial &&
          validFrameMaterials.includes(formData.frameMaterial)
            ? (formData.frameMaterial as any)
            : undefined,
        frameShape:
          formData.frameShape && validFrameShapes.includes(formData.frameShape)
            ? (formData.frameShape as any)
            : undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success(t("toast.admin.productUpdated"));
        setMessage("Product updated successfully");
        setEditingProduct(null);
      } else {
        await createProduct(productData);
        toast.success(t("toast.admin.productCreated"));
        setMessage("Product created successfully");
        setShowAddForm(false);
      }

      resetForm();
      loadProducts();
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      type: product.type,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || "",
      gender: product.gender || "unisex",
      imageUrl: product.imageUrl || "",
      images: product.images ?? [],
      description: product.description || "",
      slug: product.slug,
      frameMaterial: product.frameMaterial || "",
      frameColor: product.frameColor || "",
      frameShape: product.frameShape || "",
      lensColor: product.lensColor || "",
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      blueLightFilter: product.blueLightFilter || false,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setIsLoading(true);
    try {
      await deleteProduct(id);
      toast.success(t("toast.admin.productDeleted"));
      setMessage("Product deleted successfully");
      loadProducts();
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error deleting product: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateSampleProducts = async () => {
    if (
      !window.confirm(
        "This will add 10 sample products from mockProducts.ts. Continue?"
      )
    )
      return;

    setIsLoading(true);
    try {
      await populateSampleProducts(10);
      toast.success(t("toast.admin.sampleDataAdded"));
      setMessage("Successfully populated 10 sample products");
      loadProducts();
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error populating products: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) {
      toast.error("No user logged in");
      setMessage("No user logged in");
      return;
    }

    if (
      !window.confirm(
        `Make user ${user.email} an admin? This is a one-time setup action.`
      )
    )
      return;

    setIsLoading(true);
    try {
      await makeUserAdmin(user.id);
      toast.success("User promoted to admin! Please refresh the page.");
      setMessage("User promoted to admin! Please refresh the page.");
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error making user admin: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      type: "glasses",
      price: "",
      oldPrice: "",
      gender: "unisex",
      imageUrl: "",
      images: [],
      description: "",
      slug: "",
      frameMaterial: "",
      frameColor: "",
      frameShape: "",
      lensColor: "",
      isNew: false,
      isBestSeller: false,
      blueLightFilter: false,
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleSaveCurrencyRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrencyRatesSaving(true);
    try {
      await setCurrencyRates(currencyRates);
      toast.success("Currency rates updated.");
      setMessage("Currency rates saved.");
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error saving rates: ${errorMessage}`);
    } finally {
      setCurrencyRatesSaving(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower);
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleAddForm={() => setShowAddForm(!showAddForm)}
        showAddForm={showAddForm}
        onPopulateSample={handlePopulateSampleProducts}
        onMakeAdmin={user && user.role !== "admin" ? handleMakeAdmin : undefined}
        isLoading={isLoading}
        canMakeAdmin={!!user && user.role !== "admin"}
      />

      <AdminMessage message={message} />

      {/* Currency rates (1 EUR = ...) */}
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Currency rates (base: EUR)
        </h2>
        {currencyRatesLoading ? (
          <p className="text-sm text-slate-500">Loading rates...</p>
        ) : (
          <form
            onSubmit={handleSaveCurrencyRates}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                1 EUR = USD
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={currencyRates.USD}
                onChange={(e) =>
                  setCurrencyRatesState((prev) => ({
                    ...prev,
                    USD: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                1 EUR = ALL
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={currencyRates.ALL}
                onChange={(e) =>
                  setCurrencyRatesState((prev) => ({
                    ...prev,
                    ALL: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={currencyRatesSaving}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {currencyRatesSaving ? "Saving..." : "Save rates"}
            </button>
          </form>
        )}
      </div>

      {/* Product Form */}
      {showAddForm && (
        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as ProductType,
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="glasses">Glasses</option>
                <option value="sunglasses">Sunglasses</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value as any })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Price * ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Old Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) =>
                  setFormData({ ...formData, oldPrice: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Image URL (thumbnail for cart, cards, listings)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Images (one URL per line, for product detail slider)
              </label>
              <textarea
                value={formData.images.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: e.target.value.split("\n").map((s) => s.trim()),
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                rows={4}
                placeholder="One URL per line. Shown in slider on product page."
              />
              {formData.images.filter(Boolean).length > 0 && (
                <p className="text-xs text-slate-500">
                  {formData.images.filter(Boolean).length} image(s) in slider.
                </p>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Frame Material
              </label>
              <select
                value={formData.frameMaterial}
                onChange={(e) =>
                  setFormData({ ...formData, frameMaterial: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select material</option>
                <option value="metal">Metal</option>
                <option value="plastic">Plastic</option>
                <option value="acetate">Acetate</option>
                <option value="titanium">Titanium</option>
                <option value="mixed">Mixed</option>
                <option value="nylon">Nylon</option>
                <option value="carbon fiber">Carbon Fiber</option>
                <option value="TR90">TR90</option>
                <option value="recycled acetate">Recycled Acetate</option>
                <option value="acetate/metal">Acetate/Metal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Frame Color
              </label>
              <input
                type="text"
                value={formData.frameColor}
                onChange={(e) =>
                  setFormData({ ...formData, frameColor: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Frame Shape
              </label>
              <select
                value={formData.frameShape}
                onChange={(e) =>
                  setFormData({ ...formData, frameShape: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select shape</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="cat-eye">Cat-eye</option>
                <option value="oval">Oval</option>
                <option value="aviator">Aviator</option>
                <option value="rectangular">Rectangular</option>
                <option value="oversized">Oversized</option>
                <option value="pilot">Pilot</option>
                <option value="rounded square">Rounded Square</option>
                <option value="wrapped">Wrapped</option>
                <option value="sport">Sport</option>
                <option value="browline">Browline</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Lens Color
              </label>
              <input
                type="text"
                value={formData.lensColor}
                onChange={(e) =>
                  setFormData({ ...formData, lensColor: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) =>
                    setFormData({ ...formData, isNew: e.target.checked })
                  }
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">New Product</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    setFormData({ ...formData, isBestSeller: e.target.checked })
                  }
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">Best Seller</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.blueLightFilter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      blueLightFilter: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">
                  Blue Light Filter
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <AdminProductTable
        products={filteredProducts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminDashboardPage;
