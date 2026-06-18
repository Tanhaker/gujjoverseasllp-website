import UsersManager from "@/components/superadmin/UsersManager";

export const metadata = {
 title: "User Management | SuperAdmin Portal",
};

export default function SuperAdminUsersPage() {
 return (
 <div className="p-8">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
 <p className="text-slate-500">Manage admin and superadmin accounts, and their access status.</p>
 </div>
 <UsersManager />
 </div>
 );
}
