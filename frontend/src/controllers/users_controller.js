import { API_URL } from "config/settings";

export class UsersController {
  getUsersAndTotalCount = async (params) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      const data = await response.json();
      return { users: data.users, total: data.total };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}