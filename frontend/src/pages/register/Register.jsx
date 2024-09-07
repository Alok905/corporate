import React, { useEffect, useState } from "react";
import Input from "../../components/Input";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [reporter, setReporter] = useState("");
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  useEffect(() => {
    console.log("hellooooooooo", role);
  }, [role]);
  return (
    <form className="w-full bg-white  mx-auto p-2 flex flex-wrap justify-between">
      <h2 className="text-3xl w-full flex align-middle justify-center p-5 font-bold max-width-[45rem]">
        Register Form
      </h2>
      <Input
        value={name}
        type="text"
        name="name"
        label="Enter your name"
        placeholder="John Doe"
        onChange={(e) => setName(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%]"
      />
      <Input
        value={email}
        type="email"
        label="Enter your email"
        placeholder="abc@mycom.com"
        onChange={(e) => setEmail(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%]"
      />
      <Input
        value={personalEmail}
        type="email"
        label="Enter your personal email"
        placeholder="abc@example.com"
        onChange={(e) => setPersonalEmail(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%]"
      />
      <Input
        value={mobile}
        type="number"
        label="Enter your number"
        placeholder="9963466453"
        onChange={(e) => setMobile(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%]"
      />
      <Input
        value={reporter}
        type="email"
        label="Enter your reporter email"
        placeholder="abc@mycom.com"
        onChange={(e) => setReporter(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%]"
      />
      <Input
        value={password}
        type="password"
        name="password"
        label="Enter your password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%]"
      />
      <div
        className={`rounded-md border-gray-900 border-[1px] p-2 mt-[1rem] w-full md:w-[49%]`}
      >
        <label
          for="countries"
          class="mb-[2rem] font-semibold text-base text-[#3e3838]"
        >
          Select the role
        </label>
        <select
          id="countries"
          class="w-full text-base text-gray-900 border-b-[#000000] border-b-[1.5px] border-t-0 border-l-0 border-r-0 shadow-none focus:ring-0 focus:border-b-[#232e38] "
          onChange={(e) => setRole(e.target.value)}
        >
          <option selected>Choose a role</option>
          <option value="SENIOR_MANAGER">Senior Manager</option>
          <option value="MANAGER">Manager</option>
          <option value="LEAD">Lead</option>
          <option value="FRESHER">Fresher</option>
          <option value="INTERN">Intern</option>
        </select>
      </div>
      <div className={`rounded-md border-none  p-2 mt-[1rem] w-full`}>
        <div class="flex items-center">
          <input
            id="checked-checkbox"
            type="checkbox"
            checked={isAdmin}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label
            for="checked-checkbox"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Admin
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 w-full mt-[2rem] p-3 text-lg font-bold text-white rounded-lg hover:cursor-pointer border-[2px] border-blue-600"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
