"use client";

import { useEffect, useState } from "react";

interface DeploymentStatus {
  hasOpenAIKey: boolean;
  environment: string;
}

export function useDeploymentStatus() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setStatus(data);
      })
      .catch(() => {
        if (!active) return;
        setStatus(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    status,
    loading,
  };
}

