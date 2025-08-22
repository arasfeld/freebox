import Link from 'next/link';

import LoginBtn from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4 flex-1">
            <h1 className="text-4xl font-bold">Freebox</h1>
            <p className="text-muted-foreground text-lg">
              A marketplace where everything is free
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LoginBtn />
            <ModeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Component</CardTitle>
              <CardDescription>
                Testing different button variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input Component</CardTitle>
              <CardDescription>Testing input fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Component</CardTitle>
              <CardDescription>This is a card component</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards are great for organizing content into sections.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Freebox</CardTitle>
            <CardDescription>
              This is a test page to verify that shadcn/ui components are
              working correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The Freebox app will be a marketplace where users can give away
              items they no longer need and find items they want, all for free.
              Users will be able to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Post items with descriptions and images</li>
              <li>Create groups for access control</li>
              <li>Claim items with optional messages</li>
              <li>Set expiration dates for items</li>
              <li>Manage their profile and pickup information</li>
            </ul>

            <div className="mt-6 pt-4 border-t">
              <Link href="/test-auth">
                <Button variant="outline">Test Authentication</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
