import { createClient } from '@supabase/supabase-js';

export const createAdminClient = async () => {
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabase_url, service_role_key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};