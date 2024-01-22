import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

// api endpoint to login the user
router.post(
  "/login",
  // pre-validate the inputs to the api
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    
    //extract the errors as array from the pre-validation  
    const errors = validationResult(req);

    // if the errors array is not empty (there were errors) send the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    //destructure the email and password from the body of the request
    const { email, password } = req.body;

    try {
      // get the email asynchronously as the user
      const user = await User.findOne({ email });

      // if there is no user by the email in the DB
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // compare the password the user entered and the hashed password in the DB
      const isMatch = await bcrypt.compare(password, user.password);

      // the password does not match
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // sign the userId with secret and assign expiration date
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // assign a cookie of the name "auth_token" and value of token and 
      // pass the options to the response object
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      // send a statucode of 200 to the browser
      res.status(200).json({ userId: user._id });
    } catch (error) {
      // handle server side or DB side errors
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// api endpoint for validating the user with middleware
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// api endpoint for the logout
router.post("/logout", (req: Request, res: Response) => {
  // assign empty string to the cookie to remove it
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

export default router;
