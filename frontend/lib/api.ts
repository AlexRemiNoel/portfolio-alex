const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function checkAuth(): Promise<boolean> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem("access_token");
    
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    
    localStorage.removeItem("access_token");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export async function getPortfolio() {
  const response = await fetch(`${API_URL}/portfolio`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch portfolio");
  }
  
  return response.json();
}

export async function updatePortfolio(data: any) {
  const token = localStorage.getItem("access_token");
  
  const response = await fetch(`${API_URL}/portfolio`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ data }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update portfolio");
  }
  
  return response.json();
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email); 
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}