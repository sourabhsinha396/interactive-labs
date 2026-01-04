"use client";
import { usePathname } from "next/navigation";
import SignUpPage from "@/app/auth/signup/page";
import LoginPage from "@/app/auth/login/page";


export default function Page() {
    const pathname = usePathname();
    const slug = pathname.split("/").pop();
    if (slug === "signup") {
        return <SignUpPage />;
    }

    if (slug === "login") {
        return <LoginPage />;
    }
    return <div className="flex items-center justify-center h-screen font-extrabold text-5xl">Page Not found</div>;
}