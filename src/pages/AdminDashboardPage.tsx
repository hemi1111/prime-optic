const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Admin dashboard
        </h1>
        <p className="text-sm text-slate-500">
          This interface will be connected to Firebase Auth roles and Firestore
          collections (`products`, `orders`, `pages`) for real management
          capabilities.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="space-y-2 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Products</h2>
          <p className="text-xs text-slate-500">
            Add and edit glasses and sunglasses, manage stock and pricing.
          </p>
          <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            No products to manage yet. Once connected to Firestore, products
            will appear here in a table with filters.
          </div>
        </section>

        <section className="space-y-2 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Orders</h2>
          <p className="text-xs text-slate-500">
            Track customer orders, update statuses and view order details.
          </p>
          <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            No orders yet. When checkout is wired to Firestore, new orders will
            be listed here.
          </div>
        </section>

        <section className="space-y-2 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Content</h2>
          <p className="text-xs text-slate-500">
            Manage home page banners, services pages and blog articles.
          </p>
          <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            CMS pages and blog posts will be editable here through Firestore.
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
