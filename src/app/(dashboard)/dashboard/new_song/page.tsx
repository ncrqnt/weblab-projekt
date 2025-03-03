import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SongForm from "@/app/(dashboard)/dashboard/new_song/song-form";


export default async function NewSongPage() {

    const supabase = await createClient();

    // Check login
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Song Link</CardTitle>
                <CardDescription>
                    Add a new song link here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SongForm />
            </CardContent>
        </Card>
    );
}
