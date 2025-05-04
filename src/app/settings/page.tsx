
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Users, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" /> Settings
        </h1>
        <p className="text-muted-foreground">Manage application settings and preferences.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5"/> Appearance</CardTitle>
               <CardDescription>Customize the look and feel.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">Theme options coming soon...</p>
                {/* Add theme toggle (Light/Dark) if needed */}
             </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications</CardTitle>
               <CardDescription>Configure alert preferences.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">Notification settings coming soon...</p>
             </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> User Roles</CardTitle>
               <CardDescription>Manage user permissions.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">Role management coming soon...</p>
             </CardContent>
         </Card>

          {/* Add more setting sections as needed */}

      </div>
    </div>
  );
}
