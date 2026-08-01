import type { Metadata } from "next";

import ProfileSettings from "@/app/components/shared/account/ProfileSettings";
import NavBar from "@/app/components/shared/navigation/NavBar";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your SneakyOwl account details and tool preferences.",
};

export default function ProfilePage() {
  return (
    <div className="site-page-shell min-h-screen">
      <NavBar />
      <main
        className="mx-auto min-h-screen pb-20 pt-[120px]
          max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
          lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
      >
        <ProfileSettings />
      </main>
    </div>
  );
}
