"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const applySession = (session: Session | null) => {
      if (!active) return;
      if (session) {
        setAuthed(true);
      } else {
        setAuthed(false);
        router.replace("/admin/login");
      }
    };

    supabase.auth
      .getSession?.()
      .then(({ data }: { data: { session: Session | null } }) => applySession(data?.session ?? null));

    const listener = supabase.auth.onAuthStateChange?.((_event: string, session: Session | null) =>
      applySession(session)
    );

    return () => {
      active = false;
      listener?.data?.subscription?.unsubscribe?.();
    };
  }, [router]);

  if (authed !== true) return null;
  return <>{children}</>;
}
