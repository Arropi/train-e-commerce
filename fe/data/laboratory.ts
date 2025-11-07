
const generateDummyLaboratory = () => {
    const dataLab = [
    { id: 1, name: "Elektronika" },
    { id: 2, name: "IDK" },
    { id: 3, name: "TAJ" },
    { id: 4, name: "RPL" },
    { id: 5, name: "TL" },
  ];
  return dataLab;
};

export const getDataLaboratory = async (accessToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/laboratories`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        }
    });
  
    if (!res.ok) {
        console.error("Failed to fetch laboratories");
      return generateDummyLaboratory();
    }
  
    const data = await res.json();
    return data.laboratories;
}
