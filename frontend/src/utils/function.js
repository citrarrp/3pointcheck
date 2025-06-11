// export function fetchApiData(inputValue) {
//   const datas = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/`)
//     .then((response) => response.json())
//     .catch((error) => console.error(error));
//   return datas
//     .filter((data) => {
//       return data.name.toLowerCase().includes(inputValue.toLowerCase());
//     })
//     .sort((a, b) => {
//       return a.name > b.name;
//     });
// }

export async function fetchData() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
