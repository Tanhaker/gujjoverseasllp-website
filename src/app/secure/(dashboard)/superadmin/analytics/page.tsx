import AnalyticsDashboard from "@/components/superadmin/AnalyticsDashboard";

export const metadata = {
  title: "Analytics | SuperAdmin Portal",
};

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-500">Platform metrics, product popularity, and inquiry sources.</p>
        </div>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
