export default function handler(req, res) {
  // Destroy session in server (depends on your session lib)
  // Example: req.session.destroy()

  // Clear the cookie
  res.setHeader(
    "Set-Cookie",
    `session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
  );

  res.status(200).json({ message: "Logged out" });
}
