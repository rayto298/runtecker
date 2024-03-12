export class PrefecturesController {
  getPrefectures = async () => {
    const response = await fetch("http://localhost:3000/api/v1/prefectures", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const data = await response.json();
    return data;
  }
}