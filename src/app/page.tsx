
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Package, Users, ScanBarcode, AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Bienvenido a Inventory Sentinel</h1>
        <p className="text-muted-foreground">Tu Panel de Control de Gestión de Inventario IT</p>
      </header>

      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Totales en Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              equipos actualmente rastreados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Asignados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">
              usuarios con equipo asignado
            </p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad Reciente</CardTitle>
             <ScanBarcode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Escaneos Hoy</div>
             <p className="text-xs text-muted-foreground">
              Registros de entrada y salida
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Equipos con Stock Bajo</div>
            <p className="text-xs text-muted-foreground">
              Revisa los niveles de inventario
            </p>
          </CardContent>
        </Card>

      </main>

      {/* Add more dashboard components as needed */}
       <footer className="mt-auto pt-8 text-center text-xs text-muted-foreground">
         Panel de Control v1.0
       </footer>
    </div>
  );
}
