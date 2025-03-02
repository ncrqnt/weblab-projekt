import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SongsTable } from "@/app/(dashboard)/dashboard/songs-table";
import { SongItem } from "@/app/(dashboard)/dashboard/song";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default async function DashboardPage(
    props: {
        searchParams: Promise<{ page: number }>;
    }
) {
    const supabase = await createClient();
    const { page = 1 } = await props.searchParams;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    let songs;

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
                <SongsTable page={ page } owned={false} />
            </TabsContent>
            <TabsContent value="owned">
                <SongsTable page={page} owned={true}/>
            </TabsContent>
        </Tabs>
    );
}
