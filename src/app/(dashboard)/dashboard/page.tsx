import { createClient } from "@/utils/supabase/server";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SongsTable } from "@/app/(dashboard)/dashboard/songs-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardTabs, SongsTableProps } from "@/lib/types";

export default async function DashboardPage(
    props: {
        searchParams: Promise<{ page: number, limit: number }>;
    }
) {
    const supabase = await createClient();
    const { page = 1, limit = 5 } = await props.searchParams;
    const start: number = (+page - 1) * +limit;
    const end:number = +start + +limit - 1;

    // Check login
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Query data
    const { data, error, count } = await supabase.from('songs_dashboard').select(`*`,{ count: "exact" }).range(start, end).order("created_at", { ascending: false });
    const { data: userData, error: userError } = await supabase.from('users').select('*').eq("id", user.id).single();

    if (error) return <p className="text-red-500">Failed to load songs: {error.message}</p>;
    if (userError) return <p className="text-red-500">Failed to load user data: {userError.message}</p>;

    // Map song data
    const tableData: SongsTableProps = {
        songs: data || [],
        totalSongs: count || 0,
        user: userData.user_name,
    }

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center mb-2">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="owned">Owned</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Song Link
                        </span>
                    </Button>
                </div>
            </div>
            <TabsContent value="all">
                <SongsTable data={tableData} tab={DashboardTabs.ALL}/>
            </TabsContent>
            <TabsContent value="owned">
                <SongsTable data={tableData} tab={DashboardTabs.OWNED}/>
            </TabsContent>
        </Tabs>
    );
}
