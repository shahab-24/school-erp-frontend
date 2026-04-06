// lib/utils/csrf.ts
let csrfToken: string | null = null;

export const csrfUtils = {
  // Fetch CSRF token from server
  async fetchToken(): Promise<string | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf-token`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();

      if (data.success) {
        csrfToken = data.csrfToken;
        // Store in sessionStorage for persistence
        sessionStorage.setItem("csrfToken", data.csrfToken);
        console.log("✅ CSRF token fetched:", data.csrfToken);
      }

      return csrfToken;
    } catch (error) {
      console.error("❌ Failed to fetch CSRF token:", error);
      return null;
    }
  },

  // Get current token (from memory or sessionStorage)
  getToken(): string | null {
    if (csrfToken) return csrfToken;

    if (typeof window !== "undefined") {
      csrfToken = sessionStorage.getItem("csrfToken");
    }

    return csrfToken;
  },

  // Ensure token exists (fetch if not)
  async ensureToken(): Promise<string | null> {
    const token = this.getToken();
    if (token) return token;

    return await this.fetchToken();
  },

  // Clear token (on logout)
  clearToken(): void {
    csrfToken = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("csrfToken");
    }
  },
};
