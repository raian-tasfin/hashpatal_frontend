"use client";
import { sdk } from "@/lib/client/sdk-client";
import { useEffect, useState } from "react";

export function useMe() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("hashpatal_accessToken");
        if (!token) throw new Error("No access token");

        const result = await sdk.query({
          me: {
            user: { uuid: true, email: true, name: true, birthDate: true },
            upcoming_appointments: true,
            past_visits: true,
            upcoming_appointment_list: {
              uuid: true,
              date: true,
              shift: true,
              startTime: true,
              endTime: true,
              status: true,
            },
          },
        });

        if (isMounted) setData(result.me);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
