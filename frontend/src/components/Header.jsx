import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, getUserDetails } from "../Utils/Utils";
import { useUserChatData } from "../context/ChatContext";
import { RiMenu3Fill, RiLockPasswordLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { useSocket } from "../hooks/socket";
import { useAuthenticate } from "../hooks/useAuthenticate";

function Header() {
  const { pathname } = useLocation();
  const { clearAllData } = useUserChatData();
  const { signOutUser } = useAuthenticate();
  const navigate = useNavigate();
  const token = getToken();
  const { userId, name, pic } = getUserDetails(token);
  const [toggleDropdownList, setToggleDropdownList] = useState(false);
  const { emitEvent } = useSocket(userId);

  const dropdownRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Function to close dropdown menu when clicked outside.
  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      menuBtnRef.current &&
      !dropdownRef.current.contains(e.target) &&
      !menuBtnRef.current.contains(e.target)
    ) {
      setToggleDropdownList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to handle sign out. It removes the token from the local storage and redirects the user to the sign-in page
  const handleSignOut = () => {
    emitEvent("user offline", userId);
    signOutUser();
    localStorage.removeItem("knnectToken");
    navigate("/sign-in");
    clearAllData();
  };

  return (
    <header className="h-[10vh] flex items-center py-4 w-full bg-gray-200/95">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/">
          <img
            src="/knnect-logo.png"
            className="h-12 md:h-14"
            alt="knnect logo"
          />
        </Link>
        {token ? (
          <div className="flex items-center gap-4">
            <button
              ref={menuBtnRef}
              onClick={() => setToggleDropdownList(!toggleDropdownList)}
              className="lg:border-2 border-slate-400 lg:rounded-full"
            >
              <img
                className="hidden lg:block size-10 rounded-full"
                src={pic}
                alt={name}
              />
              <RiMenu3Fill className="size-6 lg:hidden" />
            </button>
            {toggleDropdownList && (
              <ul
                className="absolute px-2 py-6 lg:p-0 h-screen lg:h-fit w-full max-w-md right-0 top-0 z-10 lg:top-14 lg:right-2 lg:mt-2 lg:w-48 bg-white rounded flex flex-col shadow-sm shadow-slate-400 font-medium text-sm"
                ref={dropdownRef}
              >
                <li
                  className="self-end cursor-pointer mb-4 lg:hidden px-4"
                  onClick={() => setToggleDropdownList(false)}
                >
                  <RxCross1 className="size-6" />
                </li>
                <li className="self-center mb-5 flex flex-col gap-2 lg:self-auto lg:mb-0 lg:items-center lg:px-4 lg:py-2.5">
                  <img
                    src={pic}
                    className="rounded-full size-32 lg:size-14"
                    alt={name}
                  />
                </li>
                <li
                  className="cursor-pointer hover:bg-slate-100 px-4 py-2 flex items-center gap-2"
                  onClick={() => {
                    navigate(`/my-profile`);
                  }}
                >
                  <CgProfile className="size-5" />
                  My Profile
                </li>
                <li
                  className="cursor-pointer hover:bg-slate-100 px-4 py-2 flex items-center gap-2"
                  onClick={() => navigate("/change-password")}
                >
                  <RiLockPasswordLine className="size-5" />
                  Change Password
                </li>
                <li
                  className="cursor-pointer hover:bg-slate-100 px-4 py-2 flex items-center gap-2 mt-auto"
                  onClick={handleSignOut}
                >
                  <TbLogout2 className="size-5" />
                  Sign Out
                </li>
              </ul>
            )}
          </div>
        ) : pathname === "/sign-in" ? (
          <Link to="/sign-up">
            <button className="bg-cyan-600 text-white py-1 px-4 rounded">
              Sign Up
            </button>
          </Link>
        ) : (
          <Link to="/sign-in">
            <button className="bg-cyan-600 text-white py-1 px-4 rounded">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
