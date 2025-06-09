import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import prisma from "prisma";

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET!;
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Access token required",
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
    (req as any).user = user;
    next();
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
