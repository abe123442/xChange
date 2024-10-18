"use client";

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";
import { useLocalStorage } from "usehooks-ts";
import { BACKEND_URL } from "@/lib/utils";
import { Separator } from "../ui/separator";

const UserMenu: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken, removeToken] = useLocalStorage('token', '');

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const logout = async () => {
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });

    if (response.ok) {
      removeToken();
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => {}}
          className="
            hidden
            md:block
            text-sm
            font-semibold
            py-3
            px-4
            rounded-full
            hover:bg-muted
            transition
            cursor-pointer
          "
        >
          Connext
        </div>
        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px]
          border-c_blue-100
          flex
          flex-row
          items-center
          gap-3
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={null} />
          </div>
        </div>
      </div>

      {!token && isOpen && (
        <div
          className="
              absolute
              rounded-xl
              shadow-md
              w-[40vw]
              md:w-3/4
              bg-white
              overflow-hidden
              right-0
              top-12
              text-sm
            "
        >
          <div className="flex flex-col bg-c_white-500 cursor-pointer">
            <MenuItem
              label="Login"
              onClick={
                /*loginModal.onOpen*/ () => {
                  window.location.href = "/auth/login";
                }
              }
            />
            <Separator className="w-auto" />
            <MenuItem
              label="Register"
              onClick={
                /*registerModal.onOpen*/ () => {
                  window.location.href = "/auth/register";
                }
              }
            />
          </div>
        </div>
      )}

      {token && isOpen && (
        <div
          className="
              absolute
              rounded-xl
              shadow-md
              w-[40vw]
              md:w-3/4
              bg-white
              overflow-hidden
              right-0
              top-12
              text-sm
            "
        >
          <div className="flex flex-col bg-c_white-500 cursor-pointer">
            <div className="text-center">Logged in</div>
            <Separator className="w-auto" />
            <MenuItem
              label="Logout"
              onClick={logout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
