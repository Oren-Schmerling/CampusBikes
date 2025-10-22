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

    submitStartRef.current = Date.now();
    console.debug("Submitting signup", { payload: formData });

    const result = await signup(formData); // no try/catch needed if signup() never throws
    const duration = Date.now() - submitStartRef.current;
    console.log("Signup response", { result, duration });

    if (!mountedRef.current) return;
    setLoading(false);

    if (result.success) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage(result.message || "Signup failed. Please try again.");
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
