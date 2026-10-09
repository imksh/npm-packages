import { Construction } from "lucide-react";

export default function ExamplesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
      <div className="rounded-full bg-muted/50 p-6 border border-border">
        <Construction className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          We're currently building some awesome templates and examples for you. Check back soon!
        </p>
      </div>
    </div>
  );
}
