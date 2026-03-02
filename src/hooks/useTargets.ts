"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreateTargetInput,
  EvangelismTarget,
  TargetStatus,
} from "@/types/target";

const STORAGE_KEY = "apolo_targets";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function sortTargets(targets: EvangelismTarget[]) {
  return [...targets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `target-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTargets() {
  const [targets, setTargets] = useState<EvangelismTarget[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTargets(sortTargets(JSON.parse(raw)));
      }
    } catch {
      setTargets([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = useCallback((next: EvangelismTarget[]) => {
    const sorted = sortTargets(next);
    setTargets(sorted);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    } catch {}
  }, []);

  const addTarget = useCallback(
    (input: CreateTargetInput) => {
      const now = new Date().toISOString();
      const target: EvangelismTarget = {
        id: createId(),
        name: input.name.trim(),
        relationship: input.relationship,
        situation: input.situation.trim(),
        interest: input.interest,
        notes: input.notes?.trim() || "",
        status: "praying",
        createdAt: now,
        updatedAt: now,
        prayerDates: [],
      };
      persist([target, ...targets]);
      return target;
    },
    [persist, targets]
  );

  const updateTarget = useCallback(
    (
      id: string,
      patch: Partial<
        Omit<EvangelismTarget, "id" | "createdAt" | "updatedAt" | "prayerDates">
      > & {
        prayerDates?: string[];
      }
    ) => {
      persist(
        targets.map((target) =>
          target.id === id
            ? {
                ...target,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : target
        )
      );
    },
    [persist, targets]
  );

  const removeTarget = useCallback(
    (id: string) => {
      persist(targets.filter((target) => target.id !== id));
    },
    [persist, targets]
  );

  const prayToday = useCallback(
    (id: string) => {
      const key = todayKey();
      persist(
        targets.map((target) => {
          if (target.id !== id) return target;
          const prayerDates = target.prayerDates.includes(key)
            ? target.prayerDates
            : [...target.prayerDates, key].sort();
          const status: TargetStatus =
            target.status === "praying" ? "approaching" : target.status;

          return {
            ...target,
            prayerDates,
            status,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [persist, targets]
  );

  const getPrayStreak = useCallback((target: EvangelismTarget) => {
    const prayedDates = new Set(target.prayerDates);
    let streak = 0;
    const cursor = new Date();

    while (prayedDates.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }, []);

  const getLastPrayerDate = useCallback((target: EvangelismTarget) => {
    if (!target.prayerDates.length) return null;
    return [...target.prayerDates].sort().at(-1) || null;
  }, []);

  return {
    targets,
    hydrated,
    addTarget,
    updateTarget,
    removeTarget,
    prayToday,
    getPrayStreak,
    getLastPrayerDate,
  };
}

