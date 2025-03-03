import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import "../globals.css";
import {
    Home,
    LineChart,
    ListMusic,
    MicVocal, Music, Music2,
    Package,
    Package2,
    PanelLeft,
    Settings,
    ShoppingCart,
    Users2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/components/nav-item";
import { User } from "@/components/user";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <TooltipProvider>
            <main className="flex min-h-screen w-full flex-col items-center sm:pl-14">
                <DesktopNav/>
                <div className="flex-1 w-full flex flex-col items-center bg-background">
                    <header className="sticky top-0 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background z-50">
                        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                            <div className="flex gap-5 items-center font-semibold">
                                <MobileNav/>
                            </div>
                            <div className="flex gap-5 items-center font-semibold">
                                <span>Songlinks</span>
                            </div>
                            <div className="flex gap-5 items-center">
                                <ThemeSwitcher />
                                <User/>
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-col max-w-full p-5 w-full items-stretch">
                        { children }
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
            <Toaster />
        </TooltipProvider>
    );
}

function DesktopNav() {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    href="/"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Music className="h-4 w-4 transition-all group-hover:scale-110"/>
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <NavItem href="/dashboard" label="Songs">
                            <ListMusic className="h-5 w-5"/>
                        </NavItem>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>

                <NavItem href="/dashboard/artists" label="Artists">
                    <MicVocal className="h-5 w-5"/>
                </NavItem>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <NavItem href="/dashboard/admin" label="Admin Area">
                    <Settings className="h-5 w-5"/>
                </NavItem>
            </nav>
        </aside>
    );
}

function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5"/>
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                        href="#"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110"/>
                        <span className="sr-only">Vercel</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Home className="h-5 w-5"/>
                        Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <ShoppingCart className="h-5 w-5"/>
                        Orders
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-foreground"
                    >
                        <Package className="h-5 w-5"/>
                        Products
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Users2 className="h-5 w-5"/>
                        Customers
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <LineChart className="h-5 w-5"/>
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
