import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SongForm from "@/app/(dashboard)/dashboard/new_song/song-form";


export default async function NewSongPage() {

    const supabase = await createClient();

    // Get session data
    const { data: { user } } = await supabase.auth.getUser();

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
