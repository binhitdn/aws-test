import withAuth from "../hoc/withAuth";
import axios from "@/lib/axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/profile");
        setUser(res.data.user);
      } catch (err) {
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios.post("/api/logout");
    router.push("/login");
  };

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </nav>
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p className="mt-2">
          <strong>Email:</strong> {user.email}
        </p>
        
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
