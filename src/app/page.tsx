
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Package, Users, ScanBarcode, AlertCircle, KeyRound, ShoppingCart, ClipboardCheck, Smartphone } from "lucide-react";
import { getAllInventoryItems } from "@/lib/inventory-data";
import { getAllLicenses } from "@/lib/license-data";
import { getAllUsers } from "@/lib/user-data"; 
import { getAllOrders } from "@/lib/order-data";
import { getAllEntregas } from "@/lib/entrega-data";
import { getAllMobileLines } from "@/lib/mobile-line-data"; // Import for mobile lines
import { differenceInDays, parseISO } from 'date-fns';

export default async function Home() {
  // Fetch data
  const inventoryItems = await getAllInventoryItems();
  const licenses = await getAllLicenses();
  const users = await getAllUsers();
  const orders = await getAllOrders();
  const entregas = await getAllEntregas();
  const mobileLines = await getAllMobileLines(); // Fetch mobile lines

  // Calculate counts
  const totalInventoryCount = inventoryItems.length;
  const totalLicensesCount = licenses.length;
  const activeLicensesCount = licenses.filter(license => license.status === 'Activa').length;
  const totalUsersCount = users.length;
  
  const assignedUserIds = new Set();
  inventoryItems.forEach(item => {
    if (item.assignedToId) {
      assignedUserIds.add(item.assignedToId);
    }
  });
  const assignedUsersCount = assignedUserIds.size;

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(order => order.status === 'Solicitado' || order.status === 'Comprado').length;

  const totalEntregasCount = entregas.length;
  const pendingEntregasCount = entregas.filter(entrega => entrega.status === 'Pendiente' || entrega.status === 'En Proceso').length;

  const totalMobileLinesCount = mobileLines.length;
  const activeMobileLinesCount = mobileLines.filter(line => line.status === 'Activa').length;
  const assignedMobileLinesCount = mobileLines.filter(line => line.status === 'Activa' && line.assignedToUserId).length;


  // Calculate expiring licenses (within next 30 days)
  const today = new Date();
  const expiringLicenses = licenses.filter(license => {
    if (!license.expirationDate) return false;
    try {
      const expiration = parseISO(license.expirationDate);
      const daysUntilExpiration = differenceInDays(expiration, today);
      return daysUntilExpiration >= 0 && daysUntilExpiration <= 30;
    } catch (e) {
      console.warn(`Invalid expiration date format for license ${license.id}: ${license.expirationDate}`);
      return false;
    }
  });
  const expiringLicensesCount = expiringLicenses.length;
  
  const lowStockItemsCount = inventoryItems.filter(item => item.status === 'En Stock').length < 5 && inventoryItems.length > 0 ? 
                             inventoryItems.filter(item => item.status === 'En Stock').length 
                             : 0;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">DASHBOARD</h1>
        <p className="text-muted-foreground">Tu Panel de Control de Gestión de Inventario IT</p>
      </header>

      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Totales en Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInventoryCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalInventoryCount === 1 ? "equipo actualmente rastreado" : "equipos actualmente rastreados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licencias Totales</CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLicensesCount}</div>
            <p className="text-xs text-muted-foreground">
              ({activeLicensesCount} activas) gestionadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Líneas Móviles Totales</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMobileLinesCount}</div>
            <p className="text-xs text-muted-foreground">
              ({activeMobileLinesCount} activas, {assignedMobileLinesCount} asignadas)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsersCount}</div>
            <p className="text-xs text-muted-foreground">
              ({assignedUsersCount} con equipo asignado)
            </p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
             <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrdersCount}</div>
             <p className="text-xs text-muted-foreground">
              ({pendingOrdersCount} pendientes) registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entregas</CardTitle>
             <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntregasCount}</div>
             <p className="text-xs text-muted-foreground">
              ({pendingEntregasCount} pendientes) registradas
            </p>
          </CardContent>
        </Card>


        <Card className="md:col-span-2 lg:col-span-3 xl:col-span-2"> {/* Adjusted span to make space for new cards */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Alertas Importantes</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {lowStockItemsCount > 0 ? (
                <div className="text-lg font-bold">{lowStockItemsCount} Artículo(s) en Inventario con Stock Bajo</div>
            ) : (
                 totalInventoryCount > 0 && <div className="text-lg font-medium">Inventario ({totalInventoryCount} totales): Sin alertas de stock bajo.</div>
            )}
            <p className="text-xs text-muted-foreground mb-2">
              {lowStockItemsCount > 0 ? 
                `Revisa los niveles de inventario para los ${lowStockItemsCount} artículo(s) con pocas unidades.` : 
                totalInventoryCount > 0 ? "Los niveles de stock de inventario parecen estar bien." : "No hay artículos en el inventario para monitorizar stock."}
            </p>
            
            {expiringLicensesCount > 0 ? (
                <div className="text-lg font-bold">{expiringLicensesCount} Licencia(s) por Expirar (próximos 30 días)</div>
            ) : (
                 totalLicensesCount > 0 && <div className="text-lg font-medium">Licencias ({totalLicensesCount} totales, {activeLicensesCount} activas): Sin caducidades próximas.</div>
            )}
            <p className="text-xs text-muted-foreground mb-2">
              {expiringLicensesCount > 0 ? 
                `Renueva ${expiringLicensesCount === 1 ? 'la licencia que caduca' : 'las licencias que caducan'} pronto.` :
                totalLicensesCount > 0 ? "No hay licencias que caduquen en los próximos 30 días." : "No hay licencias registradas."
              }
            </p>
            
             {totalUsersCount === 0 && (
                 <div className="text-lg font-bold mt-2">Usuarios: No hay Usuarios Registrados</div>
             )}
             <p className="text-xs text-muted-foreground">
                {totalUsersCount > 0 ? `Usuarios: ${totalUsersCount} registrados, ${assignedUsersCount} con equipo.` : "Añade usuarios al sistema para empezar a asignar equipos y licencias."}
             </p>
              {totalOrdersCount === 0 && (
                <div className="text-lg font-bold mt-2">Pedidos: No hay Pedidos Registrados</div>
             )}
             <p className="text-xs text-muted-foreground">
                {totalOrdersCount > 0 ? `Pedidos: ${totalOrdersCount} registrados, ${pendingOrdersCount} pendientes.` : "Registra nuevos pedidos para hacer seguimiento de las compras de material."}
             </p>
             {totalEntregasCount === 0 && (
                <div className="text-lg font-bold mt-2">Entregas: No hay Entregas Registradas</div>
             )}
             <p className="text-xs text-muted-foreground">
                {totalEntregasCount > 0 ? `Entregas: ${totalEntregasCount} registradas, ${pendingEntregasCount} pendientes.` : "Registra nuevas entregas para hacer seguimiento del material entregado."}
             </p>
             {totalMobileLinesCount === 0 && (
                <div className="text-lg font-bold mt-2">Líneas Móviles: No hay Líneas Registradas</div>
             )}
             <p className="text-xs text-muted-foreground">
                {totalMobileLinesCount > 0 ? `Líneas Móviles: ${totalMobileLinesCount} totales, ${activeMobileLinesCount} activas.` : "Registra nuevas líneas móviles para su gestión."}
             </p>

          </CardContent>
        </Card>

      </main>

       <footer className="mt-auto pt-8 text-center text-xs text-muted-foreground">
         Panel de Control v1.0
       </footer>
    </div>
  );
}
