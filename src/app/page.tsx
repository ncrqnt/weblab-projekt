import { ThemeSwitcher } from "@/components/theme-switcher";
import AuthButton from "@/components/header-auth";

export default async function Home() {
    return (
        <>
            <main className="flex min-h-screen w-full flex-col items-center">
                <div className="flex-1 w-full flex flex-col items-center bg-background">
                    <header
                        className="sticky top-0 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background z-50">
                        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">

                            <div className="flex gap-5 items-center font-semibold">
                                <span>Songlinks</span>
                            </div>
                            <div className="flex gap-5 items-center">
                                <AuthButton />
                                <ThemeSwitcher/>
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col max-w-full p-5 w-full items-center justify-center">
                        <h1 className="text-4xl font-bold mb-4">Songlinks</h1>
                        <h2 className="text-2xl font-light italic mb-8">Fancy landing page</h2>
                        <p>Login to get started</p>
                    </div>
                </div>
                <footer
                    className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 h-16">
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
            </main>
        </>
    );
}
