
"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Users, Settings, LayoutDashboard, ScanBarcode, KeyRound, ShoppingCart } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button'; 

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar(); 
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 5.25a3.75 3.75 0 0 0 7.5 0v3h-7.5v-3Zm-3.75 3V18a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5v-8.25a.75.75 0 0 0-.75-.75h-12a.75.75 0 0 0-.75.75Zm1.5 1.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.023 3.023a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm-.023 3a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
          {hasMounted && state === 'expanded' && <span className="font-semibold text-lg">INVENTARIT</span>}
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/')}
                tooltip="Panel Principal"
              >
                <a>
                  <LayoutDashboard />
                  <span>Panel Principal</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/inventory" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/inventory')}
                tooltip="Inventario"
              >
                <a>
                  <Package />
                  <span>Inventario</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/licencias" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/licencias')}
                tooltip="Licencias"
              >
                <a>
                  <KeyRound />
                  <span>Licencias</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/pedidos" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/pedidos')}
                tooltip="Pedidos"
              >
                <a>
                  <ShoppingCart />
                  <span>Pedidos</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/scan" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/scan')}
                tooltip="Escanear Código"
              >
                <a>
                  <ScanBarcode />
                  <span>Escanear Código</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/users" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/users')}
                tooltip="Usuarios"
              >
                <a>
                  <Users />
                  <span>Usuarios</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/settings')}
                tooltip="Configuración"
              >
                <a>
                  <Settings />
                  <span>Configuración</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="md:hidden">
              <SidebarTrigger tooltip="Alternar barra lateral" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
