import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/types/database";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const user = data.user;

  // Fetch current user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If user is not an admin, deny access and send to dashboard
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all user profiles for admin view
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <span className="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Admin Area
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Logged in as {user.email} (Role: {profile.role})
            </p>
          </div>

          <Link
            href="/dashboard"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl text-sm transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
            <p className="text-sm text-gray-500">
              Manage accounts and access roles registered in the system.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">User</th>
                  <th className="py-3.5 px-6 font-semibold">Email</th>
                  <th className="py-3.5 px-6 font-semibold">Role</th>
                  <th className="py-3.5 px-6 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {allProfiles && allProfiles.length > 0 ? (
                  allProfiles.map((p: Profile) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {p.name || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{p.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                            p.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No profiles found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
