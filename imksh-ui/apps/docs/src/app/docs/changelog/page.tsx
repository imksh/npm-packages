export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Latest updates and announcements.
        </p>
      </div>
      <div className="space-y-8">
        <div className="border-l-2 border-primary pl-4">
          <h2 className="text-xl font-bold">v0.1.0</h2>
          <p className="text-sm text-muted-foreground">July 16, 2026</p>
          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Initial release of `@imksh/ui`.</li>
            <li>Added `Button`, `Input`, `Badge`, `Card`, `Avatar`, and `Checkbox` components.</li>
            <li>Setup Next.js documentation site.</li>
            <li>Full TypeScript support.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
