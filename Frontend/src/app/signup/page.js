import NavBar from "@/components/nav/navBar";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-lighterGray flex flex-col">
      {/* NavBar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center">
        {/* Signup Box */}
        <div className="bg-gray-100 rounded-2xl p-10 w-full max-w-md shadow-lg">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-nearBlack mb-8 text-center">
            Sign Up
          </h1>

          {/* Form */}
          <form className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Username"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen"
            />

            {/* Sign Up Button */}
            <button
              type="submit"
              className="bg-waxwingGreen text-white py-3 rounded-lg hover:bg-waxwingLightGreen active:bg-waxwingDarkGreen transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Login Prompt */}
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