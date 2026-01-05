import mongoose from "mongoose";
const OtpSchema = new mongoose.Schema({
phone: {
    type: String,
    required: [true, "phone name is required"],
},
code: {
    type: String,
    required: [true, "code is required"],
},
kind: {
    // 👈 اصلاح شد
    type: Number, 
    required: [true, "kind is required"],
    default: 1,
    comment: "1 for register, 2 for login",
},
expiresAt: {
    type: Date,
    required: [true, "expireAt is required"],
},
},
{timestamps: true }
);


export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);