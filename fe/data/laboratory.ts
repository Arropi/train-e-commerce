const generateDummyLaboratory = () => {
  const dataLab = [
    {
      id: 1,
      name: "Elektronika",
      iconPath: "/icons/laboratories/elektronika.svg",
    },
    { id: 2, name: "IDK", iconPath: "/icons/laboratories/idk.svg" },
    { id: 3, name: "TAJ", iconPath: "/icons/laboratories/taj.svg" },
    { id: 4, name: "RPL", iconPath: "/icons/laboratories/rpl.svg" },
    { id: 5, name: "TL", iconPath: "/icons/laboratories/tl.svg" },
  ];
  return dataLab;
};

export const getDataLaboratory = async (accessToken: string) => {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
    }/laboratories`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch laboratories");
    return generateDummyLaboratory();
  }

  const data = await res.json();
  const laboratory = data.data.map((lab: any) => {
    let iconPath = ""
    switch (lab.name) {
      case "Elektronika":
        iconPath = "/icons/logo elektronika.svg";
        break;
      case "IDK":
        iconPath = "/icons/lab_idk.svg";
        break;
      case "TAJ":
        iconPath = "/icons/lab_taj.svg";
        break;
      case "RPL":
        iconPath = "/icons/lab_rpl.svg";
        break;
      case "TL":
        iconPath = "/icons/lab_tl.svg";
        break;
      default:  
        iconPath="/icons/logo.svg"
    }
    return {
      id: lab.id,
      title: lab.name,
      iconPath: iconPath,
    };
  })
  return laboratory;
};
