import React from "react";

function AuthLayout({ children, title }) {
  return (
    <div className="h-full flex justify-center items-center py-4 px-2">
      <div className="w-[450px] shadow-md rounded-lg bg-white p-6 space-y-4">
        <div className="flex flex-col gap-2 justify-center items-center mb-4 md:mb-10">
          <img src="/knnect.png" className="h-12 md:h-16" alt="knnect" />
          <h1 className="text-lg font-medium">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
