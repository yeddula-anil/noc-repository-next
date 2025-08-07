import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Otp from "../../../models/Otp";

export async function POST(req) {
  const { email } = await req.json();
  await mongoose.connect(process.env.MONGODB_URI);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, otp, expiresAt });

  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_SERVER,
    port: process.env.GMAIL_PORT,
    secure: process.env.GMAIL_SECURE === "true",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });

  return NextResponse.json({ message: "OTP sent" });
}
