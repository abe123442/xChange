"use client";

import { BACKEND_URL } from "@/lib/utils";
import { useRef, useState } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

export default function Form() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = useReadLocalStorage<string>("token");

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    evt.preventDefault();

    // const formData = new FormData();
    const file = fileInput?.current?.files?.[0];

    const response = await fetch(`${BACKEND_URL}/auth/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token ?? "",
      },
      body: JSON.stringify({
        file: file?.name ?? "",
      }),
    });

    if (!response.ok) {
      setError(true);
    }
  }

  return (
    <form className="mt-5 p-5 border border-c_red-500 border-solid rounded-[5px] bg">
      <h2 className="title">Upload a file</h2>

      <div className="mb-[15px]">
        <label>Title</label>
        <input type="file" name="file" ref={fileInput} />
      </div>

      {error && <p className="error">Something went wrong</p>}
      {success && <p className="success">File uploaded!</p>}

      <button className="button" type="submit" onClick={uploadFile}>
        <span>Send</span>
      </button>
    </form>
  );
}
