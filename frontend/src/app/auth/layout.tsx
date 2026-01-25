import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" flex flex-col items-center justify-center  mx-auto min-h-screen">
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
