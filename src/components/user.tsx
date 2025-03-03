import { Button } from '@/components/ui/button';
import { signOutAction } from "@/app/actions";
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export async function User() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("User does not exist");
    }

    const { data: userDb, error: userErr } = await supabase.from('users').select('*').eq("id", user.id).single();

    if (userErr) {
        throw new Error("User does not exist");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Image
                        src='/placeholder_person.png'
                        width={36}
                        height={36}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userDb.user_name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                    <DropdownMenuItem>
                        <form action={signOutAction}>
                            <Button type="submit" variant={"outline"}>
                                Sign out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem>
                        <Link href="/sign-in">Sign In</Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
