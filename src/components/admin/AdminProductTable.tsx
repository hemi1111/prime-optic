import type { Product, ProductType } from "../../types/product";
import { AnimatePresence, motion } from "framer-motion";
import { getProductThumbnail } from "../../utils/productDetail";
import { useCurrency } from "../../hooks/useCurrency";
import { stateSwapVariants } from "../../config/motion";
import Button from "../ui/Button";

type AdminProductTableProps = {
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: ProductType | "all";
  onTypeFilterChange: (value: ProductType | "all") => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
};

const AdminProductTable = ({
  products,
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onEdit,
  onDelete,
  isLoading,
}: AdminProductTableProps) => {
  const { formatPrice } = useCurrency();
  const stateKey = isLoading ? "loading" : "content";
  return (
    <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Products
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {products.length}
          </span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) =>
              onTypeFilterChange(e.target.value as ProductType | "all")
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="glasses">Glasses</option>
            <option value="sunglasses">Sunglasses</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stateKey}
          variants={stateSwapVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-slate-500">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/70">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        {getProductThumbnail(product) ? (
                          <img
                            src={getProductThumbnail(product)}
                            alt={product.name}
                            className="h-11 w-11 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                      <td className="px-4 py-3 text-slate-600">{product.brand}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                          {product.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                          <span className="ml-2 text-xs text-slate-400 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(product)}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 ring-1 ring-blue-200"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onDelete(product.id)}
                            className="bg-red-50 text-red-700 hover:bg-red-100 ring-1 ring-red-200"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminProductTable;