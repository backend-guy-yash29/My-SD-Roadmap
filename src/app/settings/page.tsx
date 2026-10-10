import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { SettingsForm } from "@/components/settings-form";
import { getMyProfile } from "@/server/profile";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/settings");
  const profile = await getMyProfile(db, session.user.id);
  const timezones = Intl.supportedValuesOf("timeZone");
  if (!timezones.includes(profile.timezone)) timezones.unshift(profile.timezone);
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsForm profile={profile} timezones={timezones} />
    </div>
  );
}
