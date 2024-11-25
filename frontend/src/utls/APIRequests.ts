import { LoginResponse } from "./types";

export const RegisterUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const url = "http://localhost:3000/register";
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error: unknown) {
    console.error(error);
  }
};

export const fetchUserAndToken = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const url = "http://localhost:3000/auth";
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(`Response status: , ${response.status}`);
    }
    const json = await response.json();
    return json as LoginResponse;
    console.log(json);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const refetchUser = async (token: string): Promise<LoginResponse> => {
  const url = "http://localhost:3000/auth/verify";
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //use if backend expects it
      },
      method: "POST",
      //body: JSON.stringify({ token }),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(`${response.status}: ${json.error || "Unknown error"}`);
    }
    return json as LoginResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
