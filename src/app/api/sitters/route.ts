import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {}

export async function POST(request: Request) {}

// export default async function submitSitter(req, res) {
//   if (req.method === "POST") {
//     infoSave(req, res);
//   } else {
//     throw new Error(
//       `The HTTP ${req.method} method is not supported at this route.`
//     );
//   }
// }

// async function infoSave(xId, res) {
//   const info = await prisma.Sitter.create({});

//   res.statusCode = 200;
//   res.setHeader("Content-Type", "application/json");
//   res.setHeader("Cache-Control", "max-age=180000");
//   res.end(JSON.stringify(info));
// }
