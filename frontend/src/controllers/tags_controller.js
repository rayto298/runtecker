import { API_URL } from "config/setting";

export class TagsController {
  getTagById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/tags/${id}`, {
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
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}