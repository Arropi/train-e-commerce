"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import LoginPage from "../modules/login";
import Hero from "../modules/homeAdmin/heroAdmin";

export default function Home() {
  
  return (
    <>
      <LoginPage />
    </>
  );
}
