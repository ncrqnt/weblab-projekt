import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function useUserId() {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);

            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;

            if (user) {
                setUserId(user.id);
            }
        } catch (error) {
            toast.error("Failed to fetch user");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        void fetchUser();
    }, [fetchUser]);

    return { userId, loading };
}
