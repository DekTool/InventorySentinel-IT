
"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Users, Settings, LayoutDashboard, ScanBarcode, KeyRound, ShoppingCart, PackageSearch } from 'lucide-react'; 
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
           <PackageSearch className="w-6 h-6 text-primary" />
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

