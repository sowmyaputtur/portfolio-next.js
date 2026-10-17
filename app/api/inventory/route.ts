import sql from "mssql";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getDatabaseConfig(): sql.config | null {
  const { DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_SERVER || !DB_NAME || !DB_USER || !DB_PASSWORD) return null;

  return {
    server: DB_SERVER,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(process.env.DB_PORT || 1433),
    options: {
      encrypt: process.env.DB_ENCRYPT !== "false",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
  };
}

function hasAdminAccess(request: Request) {
  const expected = process.env.INVENTORY_ADMIN_KEY;
  const supplied = request.headers.get("x-inventory-admin-key");
  if (!expected || !supplied) return false;

  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

export async function POST(request: Request) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json({ error: "Admin access key is missing or invalid." }, { status: 401 });
  }

  const config = getDatabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Database settings are not configured on the server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid inventory request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const action = input.action;
  const sku = input.sku;
  if (
    !["INSERT", "UPDATE", "DELETE"].includes(String(action)) ||
    !Number.isInteger(sku) ||
    Number(sku) <= 0
  ) {
    return NextResponse.json({ error: "Invalid inventory action or SKU." }, { status: 400 });
  }

  if (action !== "DELETE") {
    if (
      (action === "INSERT" && (
        typeof input.itemName !== "string" ||
        input.itemName.trim().length === 0 ||
        input.itemName.length > 200
      )) ||
      typeof input.itemPrice !== "number" ||
      !Number.isFinite(input.itemPrice) ||
      input.itemPrice < 0 ||
      !Number.isInteger(input.inventoryBalance) ||
      Number(input.inventoryBalance) < 0
    ) {
      return NextResponse.json({ error: "Invalid item name, price, or inventory balance." }, { status: 400 });
    }
  }

  const pool = new sql.ConnectionPool(config);
  try {
    await pool.connect();
    const command = pool.request().input("Action", sql.VarChar(10), action);
    command.input("Sku", sql.Int, sku);
    if (action !== "DELETE") {
      if (action === "INSERT") command.input("ItemName", sql.NVarChar(200), input.itemName);
      command
        .input("ItemPrice", sql.Decimal(10, 2), input.itemPrice)
        .input("InventoryBalance", sql.Int, input.inventoryBalance);
    }
    await command.execute("ManageStorefrontInventory");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inventory stored procedure failed.", error);
    return NextResponse.json({ error: "The inventory database operation failed." }, { status: 500 });
  } finally {
    await pool.close().catch(() => undefined);
  }
}