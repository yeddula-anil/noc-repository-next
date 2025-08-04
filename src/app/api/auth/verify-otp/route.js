import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Otp from "../../../../models/Otp";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { fullName, email, password, otp } = await req.json();
  await mongoose.connect(process.env.MONGODB_URI);

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: "student", // default role
    verified: true,
  });

  // Cleanup OTP
  await Otp.deleteMany({ email });

  return NextResponse.json({
    message: "Registration successful!",
    user: { email: newUser.email, role: newUser.role },
  });
}
