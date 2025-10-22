export async function signup(endpointOrData, maybeData) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const defaultEndpoint = "/auth/register";

  let endpoint, data;

  // Allow flexible calls: signup(data) or signup('/custom', data)
  if (typeof endpointOrData === "string") {
    endpoint = endpointOrData;
    data = maybeData;
  } else {
    endpoint = defaultEndpoint;
    data = endpointOrData;
  }

  if (!data || typeof data !== "object") {
    alert("Signup error: Invalid form data.");
    return { success: false, message: "Invalid signup data." };
  }

  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  console.debug("signup() →", { url, payload: data });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    let parsed;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { message: text };
    }

    if (!res.ok) {
      const msg =
        parsed?.message ||
        (res.status === 409
          ? "Username or email already exists."
          : "Signup failed. Please try again.");


      alert(msg);
      return { success: false, message: msg, status: res.status };
    }

    console.debug("signup() success", parsed);
    alert("Signup successful!");
    return { success: true, data: parsed };
  } catch (err) {
    console.error("signup() network error:", err);
    alert(
      "Network error: Could not reach backend. Please check your connection or server."
    );
    return { success: false, message: "Network error" };
  }
}
