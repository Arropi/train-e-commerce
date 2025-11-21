
export const getDataSubjects = async(accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });
  const subjects = await res.json()
  return subjects.data;
}