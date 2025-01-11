import React from "react";

function Modal({ children, setIsModalOpen }) {
  // Function to close the modal when clicked outside.
  const handleClickModal = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className="absolute w-full h-full bg-slate-400/30 top-0 left-0 flex justify-center items-center px-4"
      onClick={handleClickModal}
    >
      {children}
    </div>
  );
}

export default Modal;
