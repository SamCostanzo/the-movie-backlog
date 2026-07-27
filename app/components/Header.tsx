"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }
  const pathname = usePathname();

  return (
    <>
      {/* Utility bar */}
      <div className="bg-ink/95 text-muted-invert text-xs">
        <div className="max-w-6xl mx-auto px-4 flex justify-end items-center gap-4 py-1.5">
          {isPending ? null : session ? (
            <>
              <span className="text-muted-invert">Hi, {session.user.name}</span>
              <button onClick={handleSignOut} className="uppercase tracking-wide hover:text-marigold cursor-pointer">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="uppercase tracking-wide hover:text-marigold">
                Log In
              </Link>
              <Link href="/register" className="uppercase tracking-wide hover:text-marigold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Main Header */}
      <header className="bg-ink">
        <div className="flex items-center justify-between max-w-6xl mx-auto py-4 px-4">
          <Link href="/">
            <h1 className="font-display text-2xl text-white">The Movie Backlog</h1>
          </Link>
          <nav className="flex gap-4 text-text-invert uppercase cursor-pointer">
            <Link href="/" className={pathname === "/" ? "text-marigold" : "hover:text-marigold transition-colors duration-300"}>
              Browse
            </Link>
            {session && (
              <Link href="/lists" className={pathname === "/lists" ? "text-marigold" : "hover:text-marigold transition-colors duration-300"}>
                Lists
              </Link>
            )}
            {/* <Link href="/watchlist" className={pathname === "/watchlist" ? "text-marigold" : "hover:text-marigold transition-colors duration-300"}>
              Watchlist
            </Link>
            <Link href="/watched" className={pathname === "/watched" ? "text-marigold" : "hover:text-marigold transition-colors duration-300"}>
              Watched
            </Link> */}
          </nav>
        </div>
      </header>
      <div className="rainbow-bar h-1.5" />
    </>
  );
}
