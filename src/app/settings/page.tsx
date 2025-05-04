
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Users, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" /> Configuración
        </h1>
        <p className="text-muted-foreground">Gestiona los ajustes y preferencias de la aplicación.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5"/> Apariencia</CardTitle>
               <CardDescription>Personaliza el aspecto visual.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">Opciones de tema próximamente...</p>
                {/* Add theme toggle (Light/Dark) if needed */}
             </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> Notificaciones</CardTitle>
               <CardDescription>Configura las preferencias de alerta.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">Ajustes de notificaciones próximamente...</p>
             </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> Roles de Usuario</CardTitle>
               <CardDescription>Gestiona los permisos de usuario.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">Gestión de roles próximamente...</p>
             </CardContent>
         </Card>

          {/* Add more setting sections as needed */}

      </div>
    </div>
  );
}

```