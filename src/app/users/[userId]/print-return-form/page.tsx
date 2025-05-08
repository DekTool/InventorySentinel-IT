
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { User } from '@/types/user';
import type { InventoryItem } from '@/types/inventory';
import { getUserById } from '@/lib/user-data';
import { getInventoryItemsByUserId } from '@/lib/inventory-data';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button'; 

type FormType = 'entrega' | 'devolucion' | 'entrega-devolucion';

export default function PrintReturnFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params?.userId as string;
  const formType = searchParams.get('type') as FormType | null;

  const [user, setUser] = useState<User | null>(null);
  const [assignedItems, setAssignedItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setError("ID de usuario no proporcionado.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
        const itemsData = await getInventoryItemsByUserId(userId);
        setAssignedItems(itemsData);
      } else {
        setError("Usuario no encontrado.");
      }
    } catch (err) {
      console.error("Error fetching data for print form:", err);
      setError("No se pudieron cargar los datos para el formulario.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (user && !isLoading && !error) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000); // Delay to allow rendering
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, error]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando formulario para impresión...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error al Cargar Formulario</h2>
        <p>{error}</p>
        <Button onClick={() => window.close()} variant="outline" className="mt-4">Cerrar</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="w-12 h-12 mb-4 text-muted-foreground" />
        <p>No se encontró la información del usuario.</p>
        <Button onClick={() => window.close()} variant="outline" className="mt-4">Cerrar</Button>
      </div>
    );
  }
  
  let mainTitle = "Formulario de Devolución y Entrega de Equipos IT";
  if (formType === 'entrega') {
    mainTitle = "Formulario de Entrega de Equipos IT";
  } else if (formType === 'devolucion') {
    mainTitle = "Formulario de Devolución de Equipos IT";
  }

  return (
    <div className="p-6 md:p-10 print-container bg-white text-black"> {/* Ensure white background for printing */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
            color-adjust: exact !important; /* Firefox, Edge */
            background-color: #ffffff !important;
          }
          body * {
            visibility: hidden;
            background-color: transparent !important; /* Ensure children backgrounds are transparent */
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px; /* Standard padding for print */
            box-sizing: border-box;
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem; /* Consistent spacing */
          }
          th, td {
            border: 1px solid #ccc; /* Lighter border for print */
            padding: 6px; /* Slightly reduced padding */
            text-align: left;
            font-size: 10pt; /* Standard print font size */
          }
          th {
            background-color: #e9ecef !important; /* Light gray background for headers */
            font-weight: bold;
          }
          h1, h2, h3 {
            color: #000 !important;
            margin-top: 0;
          }
          h1 { font-size: 18pt; margin-bottom: 1rem; }
          h2 { font-size: 14pt; margin-bottom: 0.75rem; }
          p { font-size: 10pt; margin-bottom: 0.5rem; line-height: 1.4; }
          .signature-section p { margin-bottom: 0.2rem; }
          .signature-line { border-bottom: 1px solid #000; height: 20px; margin-bottom: 5px; }
        }
        /* Screen styles for preview */
        .print-container { max-width: 800px; margin: 20px auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .print-container table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .print-container th, .print-container td { border: 1px solid #dee2e6; padding: 8px; text-align: left; }
        .print-container th { background-color: #f8f9fa; }
        .print-container h1 { font-size: 1.75rem; } .print-container h2 { font-size: 1.25rem; }
      `}</style>

      <header className="mb-6 text-center">
        <h1 className="text-xl font-bold">{mainTitle}</h1>
      </header>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Datos del Usuario</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>ID Usuario:</strong> {user.id}</p>
            <p><strong>Departamento:</strong> {user.department}</p>
            <p><strong>Fecha del Formulario:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      {(formType === 'devolucion' || formType === 'entrega-devolucion' || !formType) && (
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Equipos Devueltos por el Usuario</h2>
          {assignedItems.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Etiqueta Activo</th>
                  <th>Nombre Equipo</th>
                  <th>Tipo</th>
                  <th>N/S</th>
                  <th>Condición (al devolver)</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {assignedItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.serialNumber || 'N/A'}</td>
                    <td style={{ height: '30px', minWidth: '150px' }}></td> {/* Empty cell for handwritten condition */}
                    <td style={{ height: '30px', minWidth: '150px' }}></td> {/* Empty cell for handwritten notes */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay equipos actualmente asignados a este usuario para devolver.</p>
          )}
        </section>
      )}

      {(formType === 'entrega' || formType === 'entrega-devolucion' || !formType) && (
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Nuevos Equipos Entregados al Usuario {formType === 'entrega' ? '' : '(Opcional)'}</h2>
          <table>
            <thead>
              <tr>
                <th>Etiqueta Activo</th>
                <th>Nombre Equipo</th>
                <th>Tipo</th>
                <th>N/S</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => ( 
                <tr key={`new-${i}`}>
                  <td style={{ height: '30px' }}></td>
                  <td style={{ height: '30px' }}></td>
                  <td style={{ height: '30px' }}></td>
                  <td style={{ height: '30px' }}></td>
                  <td style={{ height: '30px' }}></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs mt-1">
             {formType === 'entrega'
              ? 'Rellenar esta sección con los equipos entregados.'
              : 'Rellenar esta sección si se entregan equipos de reemplazo o adicionales durante este proceso.'}
          </p>
        </section>
      )}


      <section className="mt-8 signature-section">
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem', paddingTop: '2rem' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="signature-line"></div>
            <p>Firma del Usuario</p>
            <p>Nombre: {user.name}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="signature-line"></div>
            <p>Firma del Representante IT</p>
            <p>Nombre: ____________________</p>
          </div>
        </div>
      </section>

      <footer className="mt-6 text-center text-xs text-gray-500 no-print">
        <p>Este es un documento generado por Inventory Sentinel. Si la impresión no se inicia automáticamente, por favor use la función de impresión de su navegador (Ctrl+P o Cmd+P).</p>
        <div className="mt-4 space-x-2">
            <Button onClick={() => window.print()}>Imprimir Manualmente</Button>
            <Button onClick={() => window.close()} variant="outline">Cerrar Pestaña</Button>
        </div>
      </footer>
    </div>
  );
}
