'use client'
import { GitHubSignIn } from "@/features/github-sign-in";
import { GoogleSignIn } from "@/features/google-sign-in";


export default function SignInViewPage () {
  return (
    <main className="w-full min-h-screen grid bg-white/65">
      <div className=" m-auto w-1/4 ">
        <h1 className="w-full font-bold text-3xl text-center text-blue-200 uppercase mb-3">
          Login Page
        </h1>
        <GoogleSignIn />
        <GitHubSignIn />
      </div>
    </main>
  );
}
