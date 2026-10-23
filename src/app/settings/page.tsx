import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { AppearanceForm } from "@/components/appearance-form";
import { Card, PageHeader, PageMain } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";
import { getAppearance } from "@/server/appearance";
import { getMyProfile } from "@/server/profile";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/settings");
  const [profile, appearance] = await Promise.all([
    getMyProfile(db, session.user.id),
    getAppearance(db, session.user.id),
  ]);
  const timezones = Intl.supportedValuesOf("timeZone");
  if (!timezones.includes(profile.timezone)) timezones.unshift(profile.timezone);
  return (
    <PageMain narrow>
      <PageHeader crumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]} />
      <h1 className="mb-1 mt-5 text-[1.625rem] font-bold tracking-tight">Settings</h1>
      <p className="mb-5 text-ink-2">Your profile, privacy and how the app looks.</p>
      <Card className="!p-6">
        <h2 className="mb-4 text-[1.0625rem] font-semibold">Profile</h2>
        <SettingsForm profile={profile} timezones={timezones} />
      </Card>
      <Card className="mt-5 !p-6">
        <h2 className="mb-1 text-[1.0625rem] font-semibold">Appearance</h2>
        <p className="mb-5 text-sm text-ink-3">
          Saved to your account, so it follows you to every device you sign in on.
        </p>
        <AppearanceForm initial={appearance} />
      </Card>
    </PageMain>
  );
}
