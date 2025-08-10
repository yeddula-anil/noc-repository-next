// app/api/verify-otp/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Otp from "../../../../models/otp";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

function determineRole(email) {
  if (email.endsWith("@rguktrkv.ac.in")) return "STUDENT";
  if (email.startsWith("vikasyeddula")) return "CARETAKER";
  if (email.endsWith("@caretaker.com")) return "DEAN";
  return "STUDENT";
}

export async function POST(req) {
  const { fullName, email, password, otp } = await req.json();
  await mongoose.connect(process.env.MONGODB_URI);

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = determineRole(email);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    verified: true,
  });

  await Otp.deleteMany({ email });

  return NextResponse.json({
    message: "Registration successful!",
    user: { email: newUser.email, role: newUser.role },
  });
}
