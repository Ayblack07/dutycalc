// src/lib/useUser.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

const supabase = createClientComponentClient();

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(
    async (userId?: string) => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setProfile(data);
        return data;
      } else {
        setProfile(null);
        return null;
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
    if (data.user?.id) {
      await fetchProfile(data.user.id);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      if (data.user?.id) {
        await fetchProfile(data.user.id);
      }
      setLoading(false);
    })();

    // basic auth state listener to refresh when auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // refresh profiles when auth state changes
      refresh();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, refresh]);

  return { user, profile, loading, refreshProfile: refresh };
}