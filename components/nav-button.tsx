import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";


type Props = {
    href: string;
    label:string;
    isActive?: boolean;
};

export const NavButton = ({
    href, label, isActive,
}:Props) => {
    return (    
        <Link
            href={href}
            className={cn(
                "inline-flex items-center px-3 py-2 text-sm font-normal hover:bg-current/20 hover:text-current border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-current focus:bg-current/30 transition rounded-md shadow-none",
                isActive ? "bg-current/10 text-current" : "bg-transparent",
            )}
        >
            {label}
        </Link>
    )
}