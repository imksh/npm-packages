export default function CliPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CLI</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Use the CLI to easily add components to your project.
        </p>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>
          We are currently building a powerful CLI tool that will allow you to quickly add components 
          without manually copying and pasting.
        </p>
        <p>In the future, you will be able to run commands like:</p>
        <pre className="bg-muted/50 p-4 rounded-md text-foreground text-sm border border-border shadow-sm">
          <code>{`imksh ui add button
imksh ui add card`}</code>
        </pre>
        <p>Stay tuned for more updates on the CLI tool!</p>
      </div>
    </div>
  );
}
