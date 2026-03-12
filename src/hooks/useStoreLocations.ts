import { useState, useEffect, useCallback } from "react";
import { fetchStores } from "../services/storeService";
import type { StoreLocation } from "../data/storeLocations";

export function useStoreLocations() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStores();
      setStores(data);
    } catch (err) {
      console.error("Error loading stores:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load store locations"
      );
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stores, isLoading, error, refetch };
}
