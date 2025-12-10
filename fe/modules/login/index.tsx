"use client";

import { signIn } from "next-auth/react";

const LoginPage = () => {

  return (
    <div className="min-h-screen flex relative">
      {/* background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.png')" }}
      ></div>
      {/* Bagian Kiri - Card yang melengkung dengan shadow */}
      <div className="hidden lg:block lg:w-5/12 relative">
        <div className="absolute top-0 bottom-10 left-6 right-6 bg-white rounded-b-[40px] rounded-t-none shadow-xl">
          <div className="flex flex-col items-center justify-center h-full p-12">
            <div className="text-center mb-10 mt-20">
              <h3 className="text-gray-600 text-xl mb-2">Welcome to,</h3>
              <div className="text-5xl">
                <span className="text-[#004CB0]">Lab</span>
                <span className="bg-[#004CB0] text-white px-3 py-0">Tedi</span>
              </div>
            </div>
            <img
              src="/images/logoUGM.png"
              alt="logo UGM"
              className="w-72 h-72 object-contain mt-4"
            />
            <div className="h-40"></div> {/* Spacer untuk memanjangkan card */}
          </div>
        </div>
      </div>

      {/* Bagian kanan dengan background biru */}
      <div className="flex-1 flex items-center justify-start p-8 lg:p-12 z-10">
        <div className="text-white">
          <div className="font-bold text-5xl mb-8">
            <h2>Hello</h2>
            <h2>
              Civitas Academica{" "}
              <span className="inline-block animate-pulse">👋</span>
            </h2>
          </div>

          <div className="mb-10 text-lg relative pl-4 border-l-4 border-white">
            <p>
              With just a few clicks, you can submit requests, track their
              status, and manage the tools you need to support your academic and
              research activities.
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="w-full bg-white text-[#004CB0] py-4 px-8 rounded-full font-semibold flex items-center justify-center hover:bg-gray-100 hover:text-blue-800 hover:scale-105 duration-300 transition-all shadow-lg text-lg"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Login dengan Email UGM
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
