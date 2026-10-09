import { NextResponse } from "next/server";
import { currentUserId } from "@/auth";
import { db } from "@/db";
import { openResource } from "@/server/resources";

/** Logs a resource open for signed-in users and redirects to the resource's URL. */
export async function GET(_req: Request, { params }: { params: Promise<{ resourceId: string }> }) {
  const id = Number((await params).resourceId);
  if (!Number.isSafeInteger(id) || id <= 0) return new NextResponse("Not found", { status: 404 });
  const url = await openResource(db, id, await currentUserId());
  if (!url) return new NextResponse("Not found", { status: 404 });
  return NextResponse.redirect(url, 302);
}
