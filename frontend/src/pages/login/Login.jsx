import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { useLoginMutation } from "../../redux/api/employeeApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/employeeSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { info } = useSelector((state) => state.employee);

  useEffect(() => {
    if (info) {
      navigate("/");
    }
  }, [info]);

  const [login] = useLoginMutation();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await login({ email, password });
      dispatch(setCredentials({ ...res.data }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={submitHandler}
      className="rounded-md border-gray-900 border-[1px] p-2 mt-[1rem] w-full md:w-[49%] mx-auto max-w-[25rem] md:max-w-[45rem]"
    >
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
