import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; 

export function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
