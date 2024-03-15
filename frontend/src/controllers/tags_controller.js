export class TagsController {
  getTagById = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/tags/:id`, {
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