"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import LoginPage from "../modules/login";

export default function Home() {
  const { data: session, status } = useSession();
  const [backendToken, setBackendToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);
  const fetchData = async () => {
    try {
      console.log(process.env.BACKEND_URL);
      const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      const result = await data.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const sendToBackend = async () => {
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/login`, {
        email: session?.user?.email,
        username: session?.user?.name,
      });
      console.log(response.data);
      if (response.data.success) {
        setBackendToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.error("Backend auth error:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = session?.user.accessToken;
      console.log(token);
      console.log(process.env.BACKEND_URL);
      const response = await axios.get(`${process.env.BACKEND_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log(response.data);
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <LoginPage />
    </>
  );
}
