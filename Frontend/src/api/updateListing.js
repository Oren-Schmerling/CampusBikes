export async function updateListing(endpointOrData, maybeData) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const defaultEndpoint = "/listing/update";

    let endpoint, data;

    if (typeof endpointOrData === "string") {
        endpoint = endpointOrData;
        data = maybeData;
    } else {
        endpoint = defaultEndpoint;
        data = endpointOrData;
    }

    if (!data || typeof data !== "object") {
        return { success: false, message: "Invalid signup data." };
    }

    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

    const token = localStorage.getItem("authToken");

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // add the bearer token here
            },
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
                    ? "didnt work"
                    : " failed. Please try again.");


            alert(msg);
            return { success: false, message: msg, status: res.status };
        }

        console.debug("create success", parsed);
        return { success: true, data: parsed };
    } catch (err) {
        console.error("create network error:", err);
        alert(
            "Network error: Could not reach backend. Please check your connection or server."
        );
        return { success: false, message: "Network error" };
    }
}
