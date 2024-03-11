export class PrefecturesController  {
  getPrefectures = async () => {
    const response = await fetch("http://localhost:3000/api/v1/prefectures");
    const data = await response.json();
    return data;
  }
}