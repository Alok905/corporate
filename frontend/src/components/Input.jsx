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
      className={`rounded-md border-gray-900 border-[2px] p-2  ${className}`}
    >
      <label htmlFor="email" className="mb-[2rem] text-base">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full text-base font-semibold text-gray-900 border-b-[#0f1418] border-b-[2px] border-t-0 border-l-0 border-r-0 shadow-none focus:ring-0 focus:border-b-[#232e38]`}
      />
    </div>
  );
};

export default Input;
