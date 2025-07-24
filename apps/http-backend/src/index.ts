import express, { Request, Response } from "express";
import { signinSchema, signupSchema } from "@repo/commons/authSchemas";
import bcrypt from "bcrypt";
import db from "@repo/db/prisma";
import jwt from "jsonwebtoken";
import middleware from "./middleware";
import "./types/express.d.ts";

const app = express();
app.use(express.json());


app.post("/signup", async (req: Request, res: Response) => {
    const userData = signupSchema.safeParse(req.body);
    if(!userData.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: userData.error.issues.map((issue) => issue.message),
        });
    }

    const { email, password, name } = userData.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    //make db call and register user
    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    })
    const token = jwt.sign({ userId: user.id, password: user.password }, process.env.JWT_SECRET as string);

    res.status(201).json({
        message: "User registered successfully",
        userName: user.name,
        token,
    });
    
});

app.post("/login", async (req: Request, res: Response) => {
    const loginData = signinSchema.safeParse(req.body);
    if(!loginData.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: loginData.error.issues.map((issue) => issue.message),
        });
    }
    const { email, password } = loginData.data;

    const user = await db.user.findUnique({
        where: { email },
    });

    if(!user){
        return res.status(401).json({
            message: "User not found",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }

    const token = jwt.sign({ userId: user.id, password: user.password }, process.env.JWT_SECRET as string);

    res.status(200).json({
        message: "Login successful",
        userName: user.name,
        token,
    });


});

app.post("/room",middleware, async (req: Request, res: Response) => {


})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});


