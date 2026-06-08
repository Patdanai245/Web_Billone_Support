import oracledb from "oracledb";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {

  try {

    const { searchParams } =
      new URL(req.url);

    const msisdn =
      searchParams.get("msisdn");

    const limit =
      Number(searchParams.get("limit")) || 10;

    const conn = await connectDB();

    const result = await conn.execute(
      `
      SELECT *
      FROM (
        SELECT DATETIME,
               MSISDNA,
               MSISDNB,
               RECHARGE_AMOUNT
        FROM RECHARGE_TRANSFER
        WHERE MSISDNA = :msisdn
        ORDER BY DATETIME DESC
      )
      WHERE ROWNUM <= :limit
      `,
      {
        msisdn,
        limit
      },
      {
        outFormat:
          oracledb.OUT_FORMAT_OBJECT
      }
    );

    await conn.close();

    return NextResponse.json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: error.message,
    });

  }

}