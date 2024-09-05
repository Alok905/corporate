import React, { useState } from "react";
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
  return (
    <form className="w-full bg-white  mx-auto p-2 flex flex-wrap justify-between">
      <h2 className="text-3xl w-full flex align-middle justify-center p-5 font-bold">
        Register Form
      </h2>
      <Input
        value={name}
        type="text"
        name="name"
        label="Enter your name"
        placeholder="John Doe"
        onChange={(e) => setName(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%] lg:w-[32%]"
      />
      <Input
        value={email}
        type="email"
        label="Enter your email"
        placeholder="abc@mycom.com"
        onChange={(e) => setEmail(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%] lg:w-[32%]"
      />
      <Input
        value={personalEmail}
        type="email"
        label="Enter your personal email"
        placeholder="abc@example.com"
        onChange={(e) => setPersonalEmail(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%] lg:w-[32%]"
      />
      <Input
        value={mobile}
        type="number"
        label="Enter your number"
        placeholder="9963466453"
        onChange={(e) => setMobile(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%] lg:w-[32%]"
      />
      <Input
        value={reporter}
        type="email"
        label="Enter your reporter email"
        placeholder="abc@mycom.com"
        onChange={(e) => setReporter(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%] lg:w-[32%]"
      />
      <Input
        value={password}
        type="password"
        name="password"
        label="Enter your password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        className="mt-[1rem] w-full md:w-[49%] lg:w-[32%]"
      />
      <div
        className={`rounded-md border-gray-900 border-[2px] p-2 mt-[1rem]  w-[49%]`}
      >
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select the role
        </label>
        <select
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose a role</option>
          <option value="SENIOR_MANAGER">Senior Manager</option>
          <option value="MANAGER">Manager</option>
          <option value="LEAD">Lead</option>
          <option value="FRESHER">Freaher</option>
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
