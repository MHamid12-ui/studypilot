import { Rocket } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

/**
 * Shared empty-state used by every Task 1 page placeholder. Real pages
 * replace these in later tasks.
 */
export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft">
        <Rocket className="h-8 w-8 text-white" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
    </section>
  );
}
