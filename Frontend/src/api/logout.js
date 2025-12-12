export async function logout() {
    try {
        const token = localStorage.getItem("authToken");

        // Clear the token from localStorage
        localStorage.removeItem("authToken");

        // Dispatch event to update navbar/other components
        window.dispatchEvent(new Event("authChange"));

        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}