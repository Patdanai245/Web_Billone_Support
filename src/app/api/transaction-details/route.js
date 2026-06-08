import oracledb from "oracledb";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  let conn;

  try {
    const { searchParams } = new URL(req.url);

    const msisdn = searchParams.get("msisdn") || "";
    const txid = searchParams.get("txid") || "";
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 100, 1), 1000);

    // Parse apiurls array
    let parsedAPIs = [];
    try {
      const apiurls = searchParams.get("apiurls");
      if (apiurls) parsedAPIs = JSON.parse(apiurls);
    } catch {
      parsedAPIs = [];
    }

    conn = await connectDB();

    let sql = `
      SELECT *
      FROM (
        SELECT
          API_URL,
          TX_DATETIME,
          MSISDN,
          TX_ID
        FROM TRANSACTION_DETAILS
        WHERE 1=1
    `;

    const binds = {};

    if (msisdn) {
      sql += ` AND MSISDN LIKE :msisdn `;
      binds.msisdn = `%${msisdn}%`;
    }

    if (txid) {
      sql += ` AND TX_ID LIKE :txid `;
      binds.txid = `%${txid}%`;
    }

    if (parsedAPIs.length > 0) {
      const placeholders = parsedAPIs.map((_, i) => `:apiurl${i}`).join(", ");
      sql += ` AND API_URL IN (${placeholders}) `;
      parsedAPIs.forEach((url, i) => {
        binds[`apiurl${i}`] = url;
      });
    }

    sql += `
        ORDER BY TX_DATETIME DESC
      )
      WHERE ROWNUM <= :limit
    `;

    binds.limit = limit;

    const result = await conn.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    return NextResponse.json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error("[transaction-details] error:", error.message);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );

  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error("[transaction-details] close error:", closeErr.message);
      }
    }
  }
}