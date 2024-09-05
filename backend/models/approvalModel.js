import mongoose from "mongoose";

const approvalSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    update: {
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
    status: {
      type: String,
      enum: ["PENDING", "REJECTED", "APPROVED"],
      default: "PENDING",
    },
  },

  { timestamps: true }
);

const Approval = mongoose.model("Approval", approvalSchema);

export { approvalSchema };
export default Approval;
