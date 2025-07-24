import express, { Request, Response } from "express";
import { signinSchema, signupSchema } from "@repo/commons/authSchemas";
import { createRoomSchema } from "@repo/commons/roomSchemas";
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
    const roomData = createRoomSchema.safeParse(req.body);
    if(!roomData.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: roomData.error.issues.map((issue) => issue.message),
        });
    }

    const { name, description, password,slug } = roomData.data;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const room = await db.room.create({
        data: {
            name,
            description,
            password: hashedPassword,   
            ownerId: req.userId || "",
            slug,
        }
    })

    res.status(201).json({
        message: "Room created successfully",
        roomName: room.name,
    });
})

app.get("/chat/:slug",middleware, async (req: Request, res: Response) => {
    const { slug } = req.params;
    if(!slug){
        return res.status(400).json({
            message: "Slug is required",
        });
    }
    const room = await db.room.findUnique({
        where: { slug: slug },
    });

    if(!room){
        return res.status(404).json({
            message: "Room not found for the given uid",
        });
    }

    const chats = await db.chat.findMany({
        where: {
            roomId: room.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    })

    res.status(200).json({
        message: "Chats fetched successfully",
        chats,
    });
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});


