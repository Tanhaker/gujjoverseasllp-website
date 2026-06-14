import CategoriesManager from "@/components/admin/CategoriesManager";

export const metadata = {
  title: "Manage Categories | Admin Portal",
};

export default function AdminCategoriesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Categories</h1>
        <p className="text-slate-500">Manage product categories, icons, and visibility.</p>
      </div>
      <CategoriesManager />
    </div>
  );
}
