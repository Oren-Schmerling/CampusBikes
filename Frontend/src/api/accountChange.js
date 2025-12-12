export default async function changeAccount(endpointOrData, maybeData){
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const defaultEndpoint = "/profile/change";

    let endpoint, data;

    if (typeof endpointOrData === "string") {
        endpoint = endpointOrData;
        data = maybeData;
    } else {
        endpoint = defaultEndpoint;
        data = endpointOrData;
    }

    if (!data || typeof data !== "object") {
        return { success: false, message: "Invalid data for changing account" };
    }

    // Prepare the payload to match the DTO structure
    const payload = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.currentPassword || null,
        new_password: data.newPassword || null
    };

    // If no new password is provided, set both password fields to null
    if (!payload.new_password || payload.new_password.trim() === '') {
        payload.password = null;
        payload.new_password = null;
    }

    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
    const token = localStorage.getItem("authToken");

    console.log("Sending payload: ", payload);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
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
                    ? "Account change failed"
                    : "Request failed. Please try again.");

            alert(msg);
            return { success: false, message: msg, status: res.status };
        }

        console.debug("Account change success", parsed);
        return { success: true, data: parsed };
    } catch (err) {
        console.error("Account change network error:", err);
        alert(
            "Network error: Could not reach backend. Please check your connection or server."
        );
        return { success: false, message: "Network error" };
    }
}