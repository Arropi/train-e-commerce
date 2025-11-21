export const getDataTimeSession = async(accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/time-sessions`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  if (!res.ok) {
    throw new Error("Failed to fetch time sessions")
  }
  const timeSessions = await res.json()
  return timeSessions.data;
}