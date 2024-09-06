import { usePathname, useRouter } from "next/navigation";
import NavButton from "./nav-button";
import { useMedia } from "react-use";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
const routes =[
    {
        href: "/",
        label: "主页"
    },
    {
        href: "/transactions",
        label: "交易"
    },
    {
        href: "/accounts",
        label: "账户"
    },
    {
        href: "/categories",
        label: "类别"
    } 
];

const Navigation = () => {
    const pathname = usePathname();
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    const isMobile = useMedia("(max-width: 1024px)",false)
    const onClick = (href: string) => {
        router.push(href)
        setIsOpen(false)
    }
    if(isMobile){
        return <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button 
                        variant="outline"
                        size="sm"
                        className="focus-visible:ring-offset-0 focus-visible:ring-transparent font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none outline-none text-white focus:bg-white/30 transition"
                    >
                        <Menu className="h-4 w-4"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button
                                onClick={()=>onClick(route.href)}
                                key={route.href}
                                variant={route.href===pathname ? "secondary": "ghost"}
                                className="w-full justify-start" 
                            >
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
        </Sheet>
    }
    return ( 
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            ))} 
        </nav> 
    );
}
export default Navigation;
 
