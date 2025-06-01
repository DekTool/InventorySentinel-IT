
"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Settings, LayoutDashboard, ScanBarcode, KeyRound, ShoppingCart, ClipboardCheck, Smartphone } from 'lucide-react'; 
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
           <svg 
             xmlns="http://www.w3.org/2000/svg" 
             viewBox="0 0 80 60" 
             fill="#ff7f00" 
             className="w-6 h-6">
             <path d="M0,0 L18,0 L39,58 L40,60 L41,58 L62,0 L80,0 L40,60 Z" />
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
                  {/* Replaced Package icon with a generic placeholder or consider a more abstract one if Package is too specific */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
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
            <Link href="/entregas" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/entregas')}
                tooltip="Entregas"
              >
                <a>
                  <ClipboardCheck />
                  <span>Entregas</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/mobile-lines" passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive('/mobile-lines')}
                tooltip="Líneas Móviles"
              >
                <a>
                  <Smartphone />
                  <span>Líneas Móviles</span>
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
