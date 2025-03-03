import { createClient } from "@/utils/supabase/server";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SongsTable } from "@/app/(dashboard)/dashboard/songs-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardTabs, SongsTableProps } from "@/lib/types";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Check login
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Query data
    const { data, error, count } = await supabase
        .from('songs_dashboard')
        .select(`*`, { count: "exact" })
        .order("created_at", { ascending: false }
        );

    const { data: userData, error: userError } = await supabase.from('users').select('*').eq("id", user.id).single();

    if (error) return <p className="text-red-500">Failed to load songs: { error.message }</p>;
    if (userError) return <p className="text-red-500">Failed to load user data: { userError.message }</p>;

    // Map song data
    const tableData: SongsTableProps = {
        songs: data || [],
        totalSongs: count || 0,
        totalOwned: data?.filter(song => song.created_by === userData.user_name).length || 0,
        user: userData.user_name,
    }

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center mb-2">
                <TabsList>
                    <TabsTrigger value="all">All ({tableData.totalSongs})</TabsTrigger>
                    <TabsTrigger value="owned">Owned ({tableData.totalOwned})</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" asChild>
                        <Link href="/dashboard/new_song"><PlusCircle className="h-3.5 w-3.5"/>Add Song Link</Link>
                    </Button>
                </div>
            </div>
            <TabsContent value="all">
                <SongsTable data={ tableData } tab={ DashboardTabs.ALL }/>
            </TabsContent>
            <TabsContent value="owned">
                <SongsTable data={ tableData } tab={ DashboardTabs.OWNED }/>
            </TabsContent>
        </Tabs>
    );
}
