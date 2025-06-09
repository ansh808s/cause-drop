import type { RequestHandler } from "express";
import prisma from "prisma";
import jwt from "jsonwebtoken";
import { signinSchema } from "./validation";
import { verifySignature } from "utils/verifySignature";

const JWT_SECRET = process.env.JWT_SECRET!;

export const signin: RequestHandler = async (req, res) => {
  const validatedData = signinSchema.safeParse(req.body);

  if (!validatedData.success) {
    res.status(400).json({
      success: false,
      error: "Validation error",
    });
    return;
  }
  const { publicKey, signature, message } = validatedData.data;
  const isValidSignature = verifySignature(publicKey, signature, message);

  if (!isValidSignature) {
    res.status(401).json({
      success: false,
      error: "Invalid signature",
    });
    return;
  }
  try {
    let user = await prisma.user.findFirst({
      where: {
        address: publicKey,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          address: publicKey,
        },
      });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        publicKey: publicKey,
      },
      JWT_SECRET
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          createdAt: user.createdAt,
        },
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};

export const verify: RequestHandler = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(403).json({
      success: false,
      error: "You are not logged in",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      publicKey: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        user: {
          id: user.id,
        },
      },
    });
    return;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};
