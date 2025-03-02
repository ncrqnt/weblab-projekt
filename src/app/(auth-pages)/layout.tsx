import Link from "next/link";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold">
                            <Link href={ "/" }>Songlinks</Link>
                        </div>
                        { !hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/> }
                    </div>
                    <div className="flex gap-5 items-center">
                        <ThemeSwitcher/>
                    </div>
                </nav>
                <div className="max-w-7xl flex flex-col gap-12 items-start">
                    { children }
                </div>

                <footer
                    className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                    <p>
                        <a
                            href="https://github.com/ncrqnt/weblab-projekt"
                            target="_blank"
                            className="font-bold hover:underline"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </p>
                </footer>
            </div>
        </main>

    );
}
