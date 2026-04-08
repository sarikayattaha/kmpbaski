"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("kmp_admin") === "1") {
      setAuthed(true);
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  if (authed === null) return null;
  return <>{children}</>;
}
