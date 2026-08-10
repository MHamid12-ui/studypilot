import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft">
        <Compass className="h-8 w-8 text-white" aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This page drifted off course. Head back to your dashboard and keep studying.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-br from-primary to-accent px-6 py-3 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-110 active:scale-[0.97]"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
