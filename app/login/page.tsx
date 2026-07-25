"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/lib/auth-client";
import Link from "next/link";
import Container from "../components/Container";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const res = await signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      router.push("/");
    }
  }

  return (
    <Container>
      <div className="py-16">
        <h1 className="font-display text-3xl mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto gap-4">
          <input name="email" type="email" placeholder="Email" required className="border-2 border-ink rounded px-3 py-2" />
          <input name="password" type="password" placeholder="Password" required className="border-2 border-ink rounded px-3 py-2" />
          {error && <p className="text-brand">{error}</p>}
          <button type="submit" disabled={loading} className="max-w-fit bg-brand text-background rounded-full px-6 py-2 uppercase tracking-wider cursor-pointer">
            {loading ? "Logging in..." : "Log In"}
          </button>
          <p>
            Need an account?{" "}
            <Link href="/register" className="text-brand hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
}
