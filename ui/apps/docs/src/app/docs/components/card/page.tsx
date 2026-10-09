import { ComponentPreview } from "@/components/component-preview";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from "@imksh/ui";

export default function CardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Card</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Displays a card with header, content, and footer.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Usage</h2>
        <ComponentPreview
          preview={
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Name of your project" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Deploy</Button>
              </CardFooter>
            </Card>
          }
          code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from "@imksh/ui"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Name of your project" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Deploy</Button>
      </CardFooter>
    </Card>
  )
}`}
        />
      </div>
    </div>
  );
}
