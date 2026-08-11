export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("sonique_jwt");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    // This catches pre-HTTP errors like CORS preflight failures, DNS errors, or server down.
    throw new Error(`[NETWORK] Network request failed. Backend may be unreachable or CORS preflight was rejected. (Raw: ${networkError.message})`);
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const rawBody = await response.text();
      try {
        const errorData = JSON.parse(rawBody);
        if (errorData.messages && Array.isArray(errorData.messages)) {
          errorMessage += ` | ${errorData.messages.join(", ")}`;
        } else if (errorData.message) {
          errorMessage += ` | ${errorData.message}`;
        } else {
          errorMessage += ` | Body: ${rawBody}`;
        }
      } catch (e) {
        errorMessage += ` | Raw Body: ${rawBody}`;
      }
    } catch (e) {
      errorMessage += ` | (Failed to read response body)`;
    }
    
    // Explicitly prepend status for App.tsx routing
    throw new Error(`[${response.status}] ${errorMessage}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
