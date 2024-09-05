import React, { useState } from "react";
import Input from "../../components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form className="w-full max-w-[40rem] bg-white  mx-auto p-2">
      <h2 className="text-3xl flex align-middle justify-center p-5 font-bold">
        Login Form
      </h2>
      <Input
        value={email}
        type="email"
        name="email"
        label="Enter your email"
        placeholder="abc@mycom.com"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        value={password}
        type="password"
        name="password"
        label="Enter your password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        className="mt-[1rem]"
      />
      <button
        type="submit"
        className="bg-blue-600 w-full mt-[2rem] p-3 text-lg font-bold text-white rounded-lg hover:cursor-pointer border-[2px] border-blue-600"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
