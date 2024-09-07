import React from "react";

const Input = ({
  name,
  type,
  value,
  onChange,
  label,
  placeholder,
  className,
}) => {
  return (
    <div
      className={`rounded-md border-gray-900 border-[1px] p-2  ${className}`}
    >
      <label
        htmlFor="email"
        className="mb-[2rem] font-semibold text-base text-[#3e3838]"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full text-base text-gray-900 border-b-[#000000] border-b-[1.5px] border-t-0 border-l-0 border-r-0 shadow-none focus:ring-0 focus:border-b-[#232e38]`}
      />
    </div>
  );
};

export default Input;
