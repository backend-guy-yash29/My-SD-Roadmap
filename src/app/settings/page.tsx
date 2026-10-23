import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { Card, PageHeader, PageMain } from "@/components/page-header";
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
    <PageMain narrow>
      <PageHeader crumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]} />
      <h1 className="mb-1 mt-5 text-[26px] font-bold tracking-tight">Settings</h1>
      <p className="mb-5 text-ink-2">Your profile, timezone and who can see your progress.</p>
      <Card className="!p-6">
        <SettingsForm profile={profile} timezones={timezones} />
      </Card>
    </PageMain>
  );
}
