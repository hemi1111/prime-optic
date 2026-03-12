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
import type { Product, ProductType, StoreStockEntry } from "../types/product";
import type { StoreLocation } from "../data/storeLocations";
import {
  createStore,
  updateStore,
  deleteStore,
  populateSampleStores,
} from "../services/storeService";
import { useStoreLocations } from "../hooks/useStoreLocations";
import { AdminHeader, AdminMessage, AdminNav, AdminProductTable } from "../components/admin";

const defaultStoreStock = (stores: StoreLocation[]): StoreStockEntry[] =>
  stores.map((s) => ({ storeId: s.id, quantity: 0 }));

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
  storeStock: StoreStockEntry[];
}

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const toast = useToast();
  const { stores, isLoading: storesLoading, refetch: refetchStores } = useStoreLocations();
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

  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [storeFormData, setStoreFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    isAvailable: true,
  });
  const [storesSaving, setStoresSaving] = useState(false);

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
    storeStock: [],
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
        storeStock: formData.storeStock,
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
    const storeStock = product.storeStock?.length && stores.length
      ? stores.map((store) => {
          const entry = product.storeStock!.find((e) => e.storeId === store.id);
          return { storeId: store.id, quantity: entry?.quantity ?? 0 };
        })
      : defaultStoreStock(stores);
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
      storeStock,
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
      storeStock: defaultStoreStock(stores),
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleToggleAddForm = () => {
    if (!showAddForm) resetForm();
    setShowAddForm((prev) => !prev);
  };

  const openAddStoreForm = () => {
    setStoreFormData({
      name: "",
      address: "",
      phone: "",
      hours: "",
      isAvailable: true,
    });
    setEditingStore({
      id: "",
      name: "",
      address: "",
      phone: "",
      hours: "",
      isAvailable: true,
    });
  };

  const handleEditStore = (store: StoreLocation) => {
    setStoreFormData({
      name: store.name,
      address: store.address,
      phone: store.phone,
      hours: store.hours,
      isAvailable: store.isAvailable,
    });
    setEditingStore(store);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoresSaving(true);
    try {
      if (editingStore?.id) {
        await updateStore(editingStore.id, storeFormData);
        toast.success("Store updated.");
        setMessage("Store updated successfully.");
      } else {
        await createStore(storeFormData);
        toast.success("Store added.");
        setMessage("Store added successfully.");
      }
      setEditingStore(null);
      refetchStores();
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setStoresSaving(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!window.confirm("Delete this store? Product stock entries for this store will no longer match a location.")) return;
    setStoresSaving(true);
    try {
      await deleteStore(id);
      toast.success("Store deleted.");
      setMessage("Store deleted.");
      setEditingStore(null);
      refetchStores();
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setStoresSaving(false);
    }
  };

  const handlePopulateStores = async () => {
    if (!window.confirm("Add 5 sample store locations (ids 1–5)? Existing stores with these ids will be overwritten.")) return;
    setStoresSaving(true);
    try {
      await populateSampleStores();
      toast.success("Sample stores added.");
      setMessage("Sample stores added. Refreshing list.");
      refetchStores();
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setStoresSaving(false);
    }
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

  const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="space-y-6">
      <AdminNav />
      <AdminHeader
        onToggleAddForm={handleToggleAddForm}
        showAddForm={showAddForm}
        onPopulateSample={handlePopulateSampleProducts}
        onMakeAdmin={user && user.role !== "admin" ? handleMakeAdmin : undefined}
        isLoading={isLoading}
        canMakeAdmin={!!user && user.role !== "admin"}
      />

      <AdminMessage message={message} />

      {/* Currency rates */}
      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900">Currency rates <span className="text-sm font-normal text-slate-500">(base: EUR)</span></h2>
        </div>
        <div className="p-6">
          {currencyRatesLoading ? (
            <p className="text-sm text-slate-500">Loading rates...</p>
          ) : (
            <form onSubmit={handleSaveCurrencyRates} className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">1 EUR = USD</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currencyRates.USD}
                  onChange={(e) =>
                    setCurrencyRatesState((prev) => ({ ...prev, USD: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">1 EUR = ALL</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={currencyRates.ALL}
                  onChange={(e) =>
                    setCurrencyRatesState((prev) => ({ ...prev, ALL: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={currencyRatesSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {currencyRatesSaving ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save rates
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Store locations */}
      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              Store locations
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{stores.length}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddStoreForm}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add store
            </button>
            <button
              type="button"
              onClick={handlePopulateStores}
              disabled={storesSaving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {storesSaving ? "Populating..." : "Populate sample (5)"}
            </button>
          </div>
        </div>

        {storesLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-slate-500">
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading stores...
          </div>
        ) : (
          <div className="p-6">
            {editingStore !== null && (
              <form
                onSubmit={handleSaveStore}
                className="mb-6 rounded-xl border border-slate-200 bg-slate-50/60 p-5"
              >
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingStore.id ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                  </svg>
                  {editingStore.id ? "Edit store" : "New store"}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
                    <input type="text" value={storeFormData.name} onChange={(e) => setStoreFormData((prev) => ({ ...prev, name: e.target.value }))} className={inputCls} required />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">Address</label>
                    <input type="text" value={storeFormData.address} onChange={(e) => setStoreFormData((prev) => ({ ...prev, address: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">Phone</label>
                    <input type="text" value={storeFormData.phone} onChange={(e) => setStoreFormData((prev) => ({ ...prev, phone: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">Hours</label>
                    <input type="text" value={storeFormData.hours} onChange={(e) => setStoreFormData((prev) => ({ ...prev, hours: e.target.value }))} className={inputCls} placeholder="Mon-Sat: 9:00 AM - 8:00 PM" />
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <input type="checkbox" id="store-available" checked={storeFormData.isAvailable} onChange={(e) => setStoreFormData((prev) => ({ ...prev, isAvailable: e.target.checked }))} className="rounded border-slate-300 text-primary-600" />
                    <label htmlFor="store-available" className="text-sm text-slate-700">Available (open for business)</label>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
                  <button type="submit" disabled={storesSaving} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
                    {storesSaving ? "Saving..." : editingStore.id ? "Update store" : "Add store"}
                  </button>
                  <button type="button" onClick={() => setEditingStore(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Desktop table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/70">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-500">No stores. Add one or populate sample stores.</td>
                    </tr>
                  ) : (
                    stores.map((store) => (
                      <tr key={store.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">{store.name}</td>
                        <td className="px-4 py-3 text-slate-600">{store.address}</td>
                        <td className="px-4 py-3 text-slate-600">{store.phone}</td>
                        <td className="px-4 py-3 text-slate-600">{store.hours}</td>
                        <td className="px-4 py-3">
                          {store.isAvailable ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 ring-1 ring-green-200">Open</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 ring-1 ring-red-200">Closed</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => handleEditStore(store)} className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button type="button" onClick={() => handleDeleteStore(store.id)} className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-100">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="space-y-3 sm:hidden">
              {stores.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">No stores. Add one or populate sample stores.</p>
              ) : (
                stores.map((store) => (
                  <div key={store.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{store.name}</p>
                        {store.address && <p className="mt-0.5 text-xs text-slate-500">{store.address}</p>}
                        {store.phone && <p className="text-xs text-slate-500">{store.phone}</p>}
                        {store.hours && <p className="text-xs text-slate-500">{store.hours}</p>}
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${store.isAvailable ? "bg-green-100 text-green-800 ring-green-200" : "bg-red-100 text-red-800 ring-red-200"}`}>
                        {store.isAvailable ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2 border-t border-slate-200 pt-3">
                      <button type="button" onClick={() => handleEditStore(store)} className="flex-1 rounded-lg border border-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">Edit</button>
                      <button type="button" onClick={() => handleDeleteStore(store.id)} className="flex-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Form */}
      {showAddForm && (
        <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Fields marked with <span className="text-red-500">*</span> are required.</p>
          </div>
          <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
            {/* Basic Info */}
            <div className="p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Basic Info</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Brand <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={inputCls} required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Type <span className="text-red-500">*</span></label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })} className={inputCls}>
                    <option value="glasses">Glasses</option>
                    <option value="sunglasses">Sunglasses</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Gender</label>
                  <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} className={inputCls}>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Price <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputCls} required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Old Price <span className="text-slate-400">(optional)</span></label>
                  <input type="number" step="0.01" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Slug <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className={inputCls} required />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputCls} rows={3} />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Specifications</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Frame Material</label>
                  <select value={formData.frameMaterial} onChange={(e) => setFormData({ ...formData, frameMaterial: e.target.value })} className={inputCls}>
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
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Frame Color</label>
                  <input type="text" value={formData.frameColor} onChange={(e) => setFormData({ ...formData, frameColor: e.target.value })} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Frame Shape</label>
                  <select value={formData.frameShape} onChange={(e) => setFormData({ ...formData, frameShape: e.target.value })} className={inputCls}>
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
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Lens Color</label>
                  <input type="text" value={formData.lensColor} onChange={(e) => setFormData({ ...formData, lensColor: e.target.value })} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Media</h3>
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Thumbnail URL <span className="text-slate-400">(cart, cards, listings)</span></label>
                  <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Slider Images <span className="text-slate-400">(one URL per line)</span></label>
                  <textarea
                    value={formData.images.join("\n")}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value.split("\n").map((s) => s.trim()) })}
                    className={`${inputCls} font-mono`}
                    rows={4}
                    placeholder="One URL per line. Shown in slider on product page."
                  />
                  {formData.images.filter(Boolean).length > 0 && (
                    <p className="text-xs text-slate-500">{formData.images.filter(Boolean).length} image(s) added.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stock & Flags */}
            <div className="p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Stock & Flags</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Quantity per store</label>
                  <div className="flex flex-wrap gap-3">
                    {stores.map((store) => {
                      const entry = formData.storeStock.find((e) => e.storeId === store.id);
                      const quantity = entry?.quantity ?? 0;
                      return (
                        <div key={store.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <span className="min-w-[120px] text-sm font-medium text-slate-700">{store.name}</span>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={quantity}
                            onChange={(e) => {
                              const next = Math.max(0, parseInt(e.target.value, 10) || 0);
                              setFormData({
                                ...formData,
                                storeStock: formData.storeStock.map((s) =>
                                  s.storeId === store.id ? { ...s, quantity: next } : s
                                ),
                              });
                            }}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: "isNew", label: "New Product" },
                    { key: "isBestSeller", label: "Best Seller" },
                    { key: "blueLightFilter", label: "Blue Light Filter" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                        className="rounded border-slate-300 text-primary-600"
                      />
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 px-6 py-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : editingProduct ? (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Product
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
