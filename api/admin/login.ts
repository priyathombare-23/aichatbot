export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const { username, password } = req.body || {};

  // Temporary test credentials
  if (username === "admin@kjsit.edu" && password === "admin123") {
    return res.status(200).json({
      success: true,
      token: "kjsit-admin-session",
    });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid admin credentials.",
  });
}
