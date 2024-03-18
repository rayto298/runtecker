export const GetUserData = async ({ id, setUser, setError }) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${apiUrl}/api/v1/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('ネットワークレスポンスがOKではありません');
    }
    const data = await response.json();

    // 足りない部分をダミーデータで補完
    const supplementedData = {
      ...data,
      user_tags: [
        { id: 1, name: "Ruby"},
        { id: 2, name: "Ruby on Railssssssssssssssss"}, 
        { id: 3, name: "JavaScript"},
        { id: 4, name: "TypeScript"},
        { id: 5, name: "Vue.js"},
        { id: 6, name: "Nuxt.js"},
        { id: 7, name: "React"},
        { id: 8, name: "Next.js"},
        { id: 9, name: "Docker"},
        { id: 10, name: "AWS"}, 
        { id: 11, name: "php"}, 
        { id: 12, name: "Laravel"},
        { id: 13, name: "Python"},
      ]
    };
    setUser(supplementedData); // 補完されたデータをセット
  } catch (err) {
    console.error("ユーザーデータの取得中にエラーが発生しました:", err);
    setError(err.message);
    setTimeout(() => navigate(RoutePath.Users.path), 3000);
  }
};