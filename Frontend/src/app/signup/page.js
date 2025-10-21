"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/nav/navBar";
import Link from "next/link";
import {signup }from "@/api/signup"; 

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const mountedRef = useRef(false);
  const submitStartRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    console.debug("SignupPage mounted");

    return () => {
      mountedRef.current = false;
      console.debug("SignupPage unmounted");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.debug(`field change: ${name} = ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Start timing for request
    submitStartRef.current = Date.now();
    console.debug("Submitting signup", { payload: formData });

    try {
      const result = await signup(formData);
      const duration = Date.now() - submitStartRef.current;
      console.log("Signup successful", { result, duration });

      if (!mountedRef.current) {
        console.warn("Component unmounted before handling success");
        return;
      }

      setMessage("Signup successful! Redirecting to login...");
      // brief delay so user sees message
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      const duration = Date.now() - (submitStartRef.current || Date.now());
      console.log("Signup error caught", { error, duration });

      // If this is a fetch/axios-like error, try to log response details
      try {
        if (error && error.response) {
          console.error("Error response details", {
            status: error.response.status,
            headers: error.response.headers,
            data: error.response.data,
          });
          setMessage(
            `Signup failed: ${error.response.status} - ${
              error.response.data?.message || JSON.stringify(error.response.data)
            }`
          );
        } else if (error && error.request) {
          // request was made but no response
          console.error("No response received for signup request", error.request);
          setMessage("Signup failed: no response from server. Check network or server logs.");
        } else {
          // generic JS error
          console.error("Unexpected signup error", error);
          setMessage(error.message || "Signup failed. Please try again.");
        }
      } catch (inspectError) {
        console.error("Error while inspecting signup error", inspectError);
        setMessage("Signup failed and error inspection failed. Check console for details.");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lighterGray flex flex-col">
      {/*<NavBar />*/}

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-gray-100 rounded-2xl p-10 w-full max-w-md shadow-lg">
          <h1 className="text-4xl font-bold text-nearBlack mb-8 text-center">
            Sign Up
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
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
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
          )}

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-waxwingGreen font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
