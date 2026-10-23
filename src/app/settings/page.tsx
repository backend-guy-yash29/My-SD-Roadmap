import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUserId } from "@/auth";
import { db } from "@/db";
import { Card } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";
import { getMyProfile } from "@/server/profile";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfileSettingsPage() {
  const userId = await currentUserId();
  if (!userId) redirect("/sign-in?callbackUrl=/settings");
  const profile = await getMyProfile(db, userId);
  const timezones = Intl.supportedValuesOf("timeZone");
  if (!timezones.includes(profile.timezone)) timezones.unshift(profile.timezone);
  return (
    <Card className="!p-6">
      <h2 className="mb-1 text-[1.0625rem] font-semibold">Profile</h2>
      <p className="mb-5 text-sm text-ink-3">
        How you appear, your timezone and who can see your progress.
      </p>
      <SettingsForm profile={profile} timezones={timezones} />
    </Card>
  );
}
