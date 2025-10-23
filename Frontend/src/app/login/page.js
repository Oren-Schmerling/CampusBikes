"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/nav/navBar";
import Link from "next/link";
import { login } from "@/api/login"; // <-- we'll create this file next

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await login(formData); // call API
      console.log("Login successful:", result);

      // ✅ Save token in localStorage
      localStorage.setItem("authToken", result.token);

      window.dispatchEvent(new Event("authChange")); // to update navbar

      setMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/home"), 1500); // redirect to home page
    } catch (error) {
      console.error("Login failed:", error);
      setMessage(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lighterGray flex flex-col">
      {/*<NavBar />*/}

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-gray-100 rounded-2xl p-10 w-full max-w-md shadow-lg">
          <h1 className="text-4xl font-bold text-nearBlack mb-8 text-center">
            Log In
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-waxwingGreen text-white py-3 rounded-lg hover:bg-waxwingLightGreen active:bg-waxwingDarkGreen transition-colors disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {message && (
            <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
          )}

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-waxwingGreen font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
