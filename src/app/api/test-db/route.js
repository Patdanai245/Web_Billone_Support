import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const conn = await connectDB();

    const result = await conn.execute(
      `SELECT SYSDATE FROM dual`
    );

    await conn.close();

    return NextResponse.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: error.message,
    });

  }

}