"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Auth() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/dashboard"); // Redirect to dashboard if logged in
            }
        };
        checkAuth();
    }, [router]);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) alert(error.message);
        else alert("Check your email for the login link!");
    };

    return (
        <div className="flex flex-col gap-4 p-10">
            <h1 className="text-xl font-bold">Sign In</h1>
            <input
                type="email"
                placeholder="Enter your email"
                className="border p-2 text-black"
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
            />
            <button className="bg-blue-500 text-white p-2" onClick={ handleLogin }>
                Sign In
            </button>
        </div>
    );
}
