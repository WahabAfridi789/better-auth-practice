import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" flex flex-col items-center justify-center max-w-md mx-auto min-h-screen">
      <header>
        <h1 className="text-2xl font-bold">
          Med<span className="text-primary font-bold">AI</span> Image System
        </h1>
      </header>
      <section className="w-full">{children}</section>
      <footer className="text-center text-sm ">
        <p>
          © {new Date().getFullYear()} AI Medical Image Interpretation System. All rights reserved.
        </p>
      </footer>
    </main>
  );
};

export default AuthLayout;
