import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// expanding the name space interface for request
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// verification handling middleware
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // request the JWT cookies in the browsers local storage
  const token = req.cookies["auth_token"];
  // if there is no token in the browser
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  // there is a cookie with the name "auth_token"
  try {
    // decode the token with the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    // extract the userId from the decoded token
    req.userId = (decoded as JwtPayload).userId;

    // call the next function after the authentication
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;
