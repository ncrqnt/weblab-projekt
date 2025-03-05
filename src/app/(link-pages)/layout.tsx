import { ThemeSwitcher } from "@/components/theme-switcher";
import "../globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main className="flex min-h-screen w-full flex-col items-center">
            { children }
            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 h-16">
                <p><ThemeSwitcher/></p>
            </footer>
        </main>
    );
}
