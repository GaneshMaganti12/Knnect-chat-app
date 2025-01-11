import React from "react";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="relative h-screen bg-background bg-cover">
      <Header />
      <main className="h-[90vh] container mx-auto p-0 pt-0.5 lg:p-2">
        {children}
      </main>
    </div>
  );
}

export default Layout;
