import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const user = data.user;
  const user_details = {
    email: user.email,
    role: user.app_metadata?.role || "N/A",
    name: user.user_metadata?.name || "N/A",
    phone: user.user_metadata?.phone || "N/A",
    provider: user.app_metadata?.provider || "email",
    createdAt: user.created_at
      ? new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A",
    isEmailVerified: user.user_metadata?.email_verified || false,
    isPhoneVerified: user.user_metadata?.phone_verified || false,
  };

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-black px-6 py-8 text-white text-center">
          <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow">
            {user_details.name !== "N/A"
              ? user_details.name.charAt(0).toUpperCase()
              : user_details.email?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">
            Welcome, {user_details.name !== "N/A" ? user_details.name : "User"}!
          </h1>
          <p className="text-blue-100 text-sm mt-1">{user_details.email}</p>
        </div>

        {/* Profile Details List */}
        <div className="p-6 space-y-4 text-black">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Profile Details
          </h2>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Full Name</span>
              <span className="font-semibold text-gray-900">{user_details.name}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Role</span>
              <span className="font-semibold text-gray-900">{user_details.role}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Email Address</span>
              <span className="font-semibold text-gray-900">{user_details.email}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Phone</span>
              <span className="font-semibold text-gray-900">{user_details.phone}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Auth Provider</span>
              <span className="font-semibold uppercase tracking-wide text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">
                {user_details.provider}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Account Created</span>
              <span className="font-semibold text-gray-900">{user_details.createdAt}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Email Verified</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  user_details.isEmailVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {user_details.isEmailVerified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Phone Verified</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  user_details.isPhoneVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user_details.isPhoneVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>

          {/* Sign Out Action */}
          <div className="pt-4 border-t border-gray-200">
            <form action={handleSignOut}>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-xl transition duration-150"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
