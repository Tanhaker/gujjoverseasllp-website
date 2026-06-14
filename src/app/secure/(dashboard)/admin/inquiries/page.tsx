import InquiriesList from "@/components/admin/InquiriesList";

export const metadata = {
  title: "Inquiries | Admin Portal",
};

export default function AdminInquiriesPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Inquiries</h1>
          <p className="text-slate-500">Manage customer inquiries and track pipeline stages.</p>
        </div>
      </div>
      <InquiriesList />
    </div>
  );
}
