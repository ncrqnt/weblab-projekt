import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
    const schema = process.env.DATABASE_SCHEMA || "public";

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { db: { schema: process.env.NEXT_PUBLIC_DATABASE_SCHEMA! } },
    );
}

