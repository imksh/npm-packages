export default function InstallationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="text-lg text-muted-foreground mt-2">
          How to install dependencies and structure your app.
        </p>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <h3>1. Install the package</h3>
        <p>Ensure the package is in your `package.json` dependencies if working within the monorepo:</p>
        <pre className="bg-[#1e1e1e] p-4 rounded-md text-zinc-50 text-sm">
          <code>{`"dependencies": {
  "@imksh/ui": "workspace:*"
}`}</code>
        </pre>
        <h3>2. Configure Tailwind CSS</h3>
        <p>Import the UI styles directly into your main CSS file:</p>
        <pre className="bg-[#1e1e1e] p-4 rounded-md text-zinc-50 text-sm">
          <code>{`@import "tailwindcss";
@source "../../../packages/ui/src"; /* Adjust path accordingly */`}</code>
        </pre>
      </div>
    </div>
  );
}
