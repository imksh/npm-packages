import { Button, Input, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Avatar, Checkbox } from '@imksh/ui';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">UI Playground</h1>
          <p className="mt-2 text-gray-500">
            Showcase of <code className="font-semibold text-blue-600">@imksh/ui</code> components.
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Default Input" />
            <Input placeholder="Disabled Input" disabled />
            <Input placeholder="Error Input" error />
          </div>
        </section>

        {/* Checkboxes & Avatars */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Checkboxes</h2>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm font-medium text-gray-700 leading-none cursor-pointer">
                Accept terms and conditions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled" disabled />
              <label htmlFor="disabled" className="text-sm font-medium text-gray-400 leading-none cursor-not-allowed">
                Disabled checkbox
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Avatars</h2>
            <div className="flex items-end space-x-4">
              <Avatar size="sm" initials="SM" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=1" />
              <Avatar size="lg" initials="LG" />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Cards</h2>
          <Card className="max-w-md">
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
        </section>

      </div>
    </div>
  );
}

export default App;
