import type { Product, ProductType } from "../../types/product";

import { Button } from "../ui/Button";

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

export function AdminProductTable({
  products,
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onEdit,
  onDelete,
  isLoading,
}: AdminProductTableProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Products ({products.length})
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={typeFilter}
            onChange={(e) =>
              onTypeFilterChange(e.target.value as ProductType | "all")
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="glasses">Glasses</option>
            <option value="sunglasses">Sunglasses</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-700">
                  Image
                </th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">
                  Name
                </th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">
                  Brand
                </th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">
                  Type
                </th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">
                  Price
                </th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100">
                  <td className="py-3 px-2">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="py-3 px-2 font-medium">{product.name}</td>
                  <td className="py-3 px-2">{product.brand}</td>
                  <td className="py-3 px-2 capitalize">{product.type}</td>
                  <td className="py-3 px-2">
                    ${product.price}
                    {product.oldPrice && (
                      <span className="ml-2 text-slate-500 line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="!px-3 !py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="!px-3 !py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 border-0"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
