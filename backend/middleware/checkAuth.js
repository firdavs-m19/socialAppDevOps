import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the token is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    console.log("Authorization Header:", authHeader);
    console.log("Extracted Token:", token); // Log extracted token

    // Verify token synchronously
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded); // Log the decoded token
    req.userId = decoded.userId; // Attach the user ID to the request
    next(); // Continue to the route
  } catch (err) {
    console.error("Token verification failed:", err); // Log the error
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
