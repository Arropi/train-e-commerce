"use client"

import { GitHubSignIn } from "@/features/github-sign-in";
import { GoogleSignIn } from "@/features/google-sign-in";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { addUser } from "@/action/action";

type Profile = {
    email: string,
    password: string
}


const formSchema = z.object({
  email: z.email("Email is not valid"),
  password: z.string().min(8, "Please enter at least 8 character")
})

export default function SignInViewPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Profile>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: ""
      }
    })
    const onSubmit: SubmitHandler<Profile> = async(data) => {
        const newUser = await addUser(data)
        console.log(newUser)
    }
  return (
    <main className="w-full min-h-screen grid bg-white/65">
      <div className=" m-auto w-1/4 ">
        <h1 className="w-full font-bold text-3xl text-center text-blue-200 uppercase mb-3">
          Login Page
        </h1>
        <form className="bg-white shadow-2xl p-16 border border-black/20 rounded-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label className="text-black text-xl font-semibold">Email</label>
            <input
              className="bg-cyan-500 p-1.5 rounded-lg border-3 border-black/30"
              type="email"
              {...register("email")}
            />
            { errors.email && <span className="text-red-500 font-medium text-sm">{errors.email.message}</span>}
            <label className="text-black text-xl font-semibold">Password</label>
            <input
              className="bg-cyan-500 p-1.5 rounded-lg border-3 border-black/30"
              type="password"
              {...register("password")}
            />
            { errors.password && <span className="text-red-500 font-medium text-sm">{errors.password.message}</span>}
            <div className="flex mt-3">
              <input type="checkbox" className="mr-2" />
              <h1 className="font-medium text-black text-lg">Remember Me!</h1>
            </div>
            <input
              type="submit"
              className="p-3 mt-2 w-full bg-emerald-400 rounded-lg text-black text-2xl cursor-pointer hover:shadow-2xl transition"
            />
            <div className="flex mt-3 gap-2">
              <span className="font-medium text-black">
                Don't have an account?{" "}
              </span>
              <Link
                href="/register"
                className="font-semibold text-md text-black"
              >
                Register Now
              </Link>
            </div>
            <h1 className="text-black text-center w-full font-semibold text-xl my-1.5">Or Login Using</h1>
            <div className="flex gap-2">

            <GoogleSignIn />
            <GitHubSignIn />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
