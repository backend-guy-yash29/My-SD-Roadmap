import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUserId } from "@/auth";
import { db } from "@/db";
import { AppearanceForm } from "@/components/appearance-form";
import { Card } from "@/components/page-header";
import { getAppearance } from "@/server/appearance";

export const metadata: Metadata = { title: "Appearance" };

export default async function AppearanceSettingsPage() {
  const userId = await currentUserId();
  if (!userId) redirect("/sign-in?callbackUrl=/settings/appearance");
  const appearance = await getAppearance(db, userId);
  return (
    <Card className="!p-6">
      <h2 className="mb-1 text-[1.0625rem] font-semibold">Appearance</h2>
      <p className="mb-5 text-sm text-ink-3">
        Saved to your account, so it follows you to every device you sign in on.
      </p>
      <AppearanceForm initial={appearance} />
    </Card>
  );
}
