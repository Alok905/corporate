import mongoose from "mongoose";
import { approvalSchema } from "./approvalModel.js";

const validateEmail = (isOfficial, email) => {
  const regex = new RegExp(
    isOfficial
      ? /^\w+([\.-]?\w+)*@mycom(\.\w{2,3})+$/
      : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );

  return regex.test(email);
};

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        (email) => validateEmail(true, email),
        "Please enter a correct email address.",
      ],
    },
    personalEmail: {
      type: String,
      unique: true,
      validate: [
        (email) => validateEmail(false, email),
        "Please enter a correct email address.\n",
      ],
    },
    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      length: 10,
    },
    role: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    approvals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Approval",
      },
    ],
    reportees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
