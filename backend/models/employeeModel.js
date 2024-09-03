import mongoose from "mongoose";

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
    userUpdateApprovals: [
      {
        userDetails: {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
          },
          updatingEmployeeDetails: {
            personalEmail: {
              type: String,
              default: null,
            },
            password: {
              type: String,
              default: null,
            },
            mobile: {
              type: String,
              default: null,
            },
          },
        },
        status: {
          type: String,
          enum: ["PENDING", "REJECTED", "APPROVED"],
          default: "PENDING",
        },
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
