

export const getDataRooms = async(accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });
  const rooms = await res.json()
  return rooms.data;
}