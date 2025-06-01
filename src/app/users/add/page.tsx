
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus } from 'lucide-react';
import { addUser } from '@/lib/user-data';
import type { UserRole } from '@/types/user';
import { userRoles } from '@/lib/user-data';
import { Separator } from '@/components/ui/separator';

const booleanOptions = [
  { label: "Sí", value: "true" },
  { label: "No", value: "false" },
];

const formSchema = z.object({
  // Core fields
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  department: z.string().min(2, { message: "El departamento debe tener al menos 2 caracteres." }),
  phone: z.string().optional().nullable(),
  joinDate: z.string().optional().nullable(),
  role: z.enum(userRoles as [UserRole, ...UserRole[]]),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }).optional().or(z.literal('')),

  // Información General de Cuenta y Empleado
  tipoCuenta: z.string().optional().nullable(),
  estadoCuenta: z.string().optional().nullable(),
  empresa: z.string().optional().nullable(),
  ubicacion: z.string().optional().nullable(),
  pais: z.string().optional().nullable(),
  fechaSalidaBaja: z.string().optional().nullable(),
  puestoTrabajo: z.string().optional().nullable(),
  responsableManager: z.string().optional().nullable(),
  entornoCorporativo: z.string().optional().nullable(),

  // Cuenta de Directorio Activo (DA) / O365
  cuentaDAcreada: z.string().transform(val => val === "true").optional(),
  nombreCuentaWindowsO365: z.string().optional().nullable(),
  fichaDArellena: z.string().transform(val => val === "true").optional(),
  licenciaO365asignada: z.string().transform(val => val === "true").optional(),
  asignadoListasDistribucionO365: z.string().transform(val => val === "true").optional(),
  citaEnCalendario: z.string().transform(val => val === "true").optional(),
  contrasenaPersonalizada: z.string().transform(val => val === "true").optional(),
  contrasenaInicialEstablecida: z.string().optional().nullable(),
  tarjetaRFIDaccesoMadrid: z.string().optional().nullable(),
  accesoRepositorioOtorgado: z.string().transform(val => val === "true").optional(),
  rutaRepositorioAcceso: z.string().optional().nullable(),
  emailOnboardingEnviado: z.string().transform(val => val === "true").optional(),
  usuarioAsignadoNetworkOperatorDA: z.string().transform(val => val === "true").optional(),

  // Endpoint (Equipo Informático)
  endpointTipo: z.string().optional().nullable(),
  ficheroPlataformadoEntregado: z.string().transform(val => val === "true").optional(),
  usuarioAdminLocalEstablecido: z.string().optional().nullable(),
  equipoInformaticoAsignado: z.string().optional().nullable(),
  marcaModeloEndpoint: z.string().optional().nullable(),
  codigoBitlockerRepositorio: z.string().transform(val => val === "true").optional(),
  numeroSerieEndpoint: z.string().optional().nullable(),
  macWifiEndpoint: z.string().optional().nullable(),
  macEthernetEndpoint: z.string().optional().nullable(),
  marcaModeloCargadorEndpoint: z.string().optional().nullable(),
  nombreAsignadoEndpoint: z.string().optional().nullable(),
  endpointEnDominio: z.string().transform(val => val === "true").optional(),
  homepageFactorialNavegadores: z.string().transform(val => val === "true").optional(),
  bitlockerActivo: z.string().transform(val => val === "true").optional(),
  teamviewerCorporativoInstalado: z.string().transform(val => val === "true").optional(),
  teamviewerEnEndpoint: z.string().transform(val => val === "true").optional(),
  idTeamviewerEndpoint: z.string().optional().nullable(),
  sevenZipInstalado: z.string().transform(val => val === "true").optional(),
  antimalwareInstalado: z.string().transform(val => val === "true").optional(),
  adobeAcrobatReaderInstalado: z.string().transform(val => val === "true").optional(),
  forticlientVpnInstalado: z.string().transform(val => val === "true").optional(),
  office365instalado: z.string().transform(val => val === "true").optional(),
  accesoOffice365correcto: z.string().transform(val => val === "true").optional(),
  onedriveInstalado: z.string().transform(val => val === "true").optional(),
  deshabilitarOnedriveBackupEscritorio: z.string().transform(val => val === "true").optional(),
  teamsInstalado: z.string().transform(val => val === "true").optional(),
  restauracionSistemaActivo: z.string().transform(val => val === "true").optional(),
  bginfoInstaladoConfigurado: z.string().transform(val => val === "true").optional(),
  googleEarthProInstalado: z.string().transform(val => val === "true").optional(),
  softphoneEnEndpoint: z.string().transform(val => val === "true").optional(),
  qgisInstalado: z.string().transform(val => val === "true").optional(),
  pdf24instalado: z.string().transform(val => val === "true").optional(),
  idiomaWindowsEstablecido: z.string().optional().nullable(),
  firefoxChromeInstalado: z.string().transform(val => val === "true").optional(),
  statusActividad: z.string().optional().nullable(),
  visorDwgInstalado: z.string().transform(val => val === "true").optional(),
  windows11instalado: z.string().transform(val => val === "true").optional(),
  softwareInstaladoAdicional: z.string().optional().nullable(),

  // Impresora
  numeroPlantaImpresora: z.string().optional().nullable(),
  driverImpresoraInstalado: z.string().transform(val => val === "true").optional(),
  codigoUsuarioImpresora: z.string().optional().nullable(),
  impresoraConfigurada: z.string().transform(val => val === "true").optional(),

  // Periféricos
  monitorAsignado: z.string().optional().nullable(),
  monitorEntregado: z.string().transform(val => val === "true").optional(),
  tecladoEntregado: z.string().transform(val => val === "true").optional(),
  tecladoAsignado: z.string().optional().nullable(),
  ratonEntregado: z.string().transform(val => val === "true").optional(),
  ratonAsignado: z.string().optional().nullable(),

  // Telefonía Móvil
  imeisMovil: z.string().optional().nullable(),
  smartphoneAsignado: z.string().optional().nullable(),
  marcaModeloMovil: z.string().optional().nullable(),
  direccionMacWifiMovil: z.string().optional().nullable(),
  gmailAppleIdCreada: z.string().transform(val => val === "true").optional(),
  nombreCuentaGmailAppleId: z.string().optional().nullable(),
  movilAsignadoNumero: z.string().optional().nullable(),
  numeroSerieMovil: z.string().optional().nullable(),
  outlookDesplegadoMovil: z.string().transform(val => val === "true").optional(),
  teamsDesplegadoMovil: z.string().transform(val => val === "true").optional(),
  harmonyMobileInstalado: z.string().transform(val => val === "true").optional(),
  mdmFullParcial: z.string().optional().nullable(),
  jamfInstalado: z.string().transform(val => val === "true").optional(),
  pruebaLlamadasMovil: z.string().transform(val => val === "true").optional(),
  teamviewerEnMovil: z.string().transform(val => val === "true").optional(),
  idTeamviewerMovil: z.string().optional().nullable(),
  movilDesasignado: z.string().transform(val => val === "true").optional(),
  terminalFijoTelefonia: z.string().transform(val => val === "true").optional(),
  platDireccionMacTerminalFijo: z.string().optional().nullable(),

  // Comentarios
  comentarioEntregaMaterial: z.string().optional().nullable(),
});

type UserFormData = z.infer<typeof formSchema>;

function renderSelectBooleanField(form: any, name: keyof UserFormData, label: string) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value === true ? "true" : field.value === false ? "false" : undefined}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


export default function AddUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      phone: "",
      joinDate: "",
      role: "Usuario",
      password: "",
      // Default values for new fields
      tipoCuenta: "",
      estadoCuenta: "Activa",
      empresa: "",
      ubicacion: "",
      pais: "",
      fechaSalidaBaja: "",
      puestoTrabajo: "",
      responsableManager: "",
      entornoCorporativo: "",
      cuentaDAcreada: "false",
      nombreCuentaWindowsO365: "",
      fichaDArellena: "false",
      licenciaO365asignada: "false",
      asignadoListasDistribucionO365: "false",
      citaEnCalendario: "false",
      contrasenaPersonalizada: "false",
      contrasenaInicialEstablecida: "",
      tarjetaRFIDaccesoMadrid: "",
      accesoRepositorioOtorgado: "false",
      rutaRepositorioAcceso: "",
      emailOnboardingEnviado: "false",
      usuarioAsignadoNetworkOperatorDA: "false",
      endpointTipo: "",
      ficheroPlataformadoEntregado: "false",
      usuarioAdminLocalEstablecido: "",
      equipoInformaticoAsignado: "",
      marcaModeloEndpoint: "",
      codigoBitlockerRepositorio: "false",
      numeroSerieEndpoint: "",
      macWifiEndpoint: "",
      macEthernetEndpoint: "",
      marcaModeloCargadorEndpoint: "",
      nombreAsignadoEndpoint: "",
      endpointEnDominio: "false",
      homepageFactorialNavegadores: "false",
      bitlockerActivo: "false",
      teamviewerCorporativoInstalado: "false",
      teamviewerEnEndpoint: "false",
      idTeamviewerEndpoint: "",
      sevenZipInstalado: "false",
      antimalwareInstalado: "false",
      adobeAcrobatReaderInstalado: "false",
      forticlientVpnInstalado: "false",
      office365instalado: "false",
      accesoOffice365correcto: "false",
      onedriveInstalado: "false",
      deshabilitarOnedriveBackupEscritorio: "false",
      teamsInstalado: "false",
      restauracionSistemaActivo: "false",
      bginfoInstaladoConfigurado: "false",
      googleEarthProInstalado: "false",
      softphoneEnEndpoint: "false",
      qgisInstalado: "false",
      pdf24instalado: "false",
      idiomaWindowsEstablecido: "Español",
      firefoxChromeInstalado: "false",
      statusActividad: "Activo",
      visorDwgInstalado: "false",
      windows11instalado: "false",
      softwareInstaladoAdicional: "",
      numeroPlantaImpresora: "",
      driverImpresoraInstalado: "false",
      codigoUsuarioImpresora: "",
      impresoraConfigurada: "false",
      monitorAsignado: "",
      monitorEntregado: "false",
      tecladoEntregado: "false",
      tecladoAsignado: "",
      ratonEntregado: "false",
      ratonAsignado: "",
      imeisMovil: "",
      smartphoneAsignado: "",
      marcaModeloMovil: "",
      direccionMacWifiMovil: "",
      gmailAppleIdCreada: "false",
      nombreCuentaGmailAppleId: "",
      movilAsignadoNumero: "",
      numeroSerieMovil: "",
      outlookDesplegadoMovil: "false",
      teamsDesplegadoMovil: "false",
      harmonyMobileInstalado: "false",
      mdmFullParcial: "",
      jamfInstalado: "false",
      pruebaLlamadasMovil: "false",
      teamviewerEnMovil: "false",
      idTeamviewerMovil: "",
      movilDesasignado: "false",
      terminalFijoTelefonia: "false",
      platDireccionMacTerminalFijo: "",
      comentarioEntregaMaterial: "",
    },
  });

  async function onSubmit(values: UserFormData) {
    setIsSubmitting(true);
    
    const transformedValues = {
        ...values,
        cuentaDAcreada: values.cuentaDAcreada === "true",
        fichaDArellena: values.fichaDArellena === "true",
        licenciaO365asignada: values.licenciaO365asignada === "true",
        asignadoListasDistribucionO365: values.asignadoListasDistribucionO365 === "true",
        citaEnCalendario: values.citaEnCalendario === "true",
        contrasenaPersonalizada: values.contrasenaPersonalizada === "true",
        accesoRepositorioOtorgado: values.accesoRepositorioOtorgado === "true",
        emailOnboardingEnviado: values.emailOnboardingEnviado === "true",
        usuarioAsignadoNetworkOperatorDA: values.usuarioAsignadoNetworkOperatorDA === "true",
        ficheroPlataformadoEntregado: values.ficheroPlataformadoEntregado === "true",
        codigoBitlockerRepositorio: values.codigoBitlockerRepositorio === "true",
        endpointEnDominio: values.endpointEnDominio === "true",
        homepageFactorialNavegadores: values.homepageFactorialNavegadores === "true",
        bitlockerActivo: values.bitlockerActivo === "true",
        teamviewerCorporativoInstalado: values.teamviewerCorporativoInstalado === "true",
        teamviewerEnEndpoint: values.teamviewerEnEndpoint === "true",
        sevenZipInstalado: values.sevenZipInstalado === "true",
        antimalwareInstalado: values.antimalwareInstalado === "true",
        adobeAcrobatReaderInstalado: values.adobeAcrobatReaderInstalado === "true",
        forticlientVpnInstalado: values.forticlientVpnInstalado === "true",
        office365instalado: values.office365instalado === "true",
        accesoOffice365correcto: values.accesoOffice365correcto === "true",
        onedriveInstalado: values.onedriveInstalado === "true",
        deshabilitarOnedriveBackupEscritorio: values.deshabilitarOnedriveBackupEscritorio === "true",
        teamsInstalado: values.teamsInstalado === "true",
        restauracionSistemaActivo: values.restauracionSistemaActivo === "true",
        bginfoInstaladoConfigurado: values.bginfoInstaladoConfigurado === "true",
        googleEarthProInstalado: values.googleEarthProInstalado === "true",
        softphoneEnEndpoint: values.softphoneEnEndpoint === "true",
        qgisInstalado: values.qgisInstalado === "true",
        pdf24instalado: values.pdf24instalado === "true",
        firefoxChromeInstalado: values.firefoxChromeInstalado === "true",
        visorDwgInstalado: values.visorDwgInstalado === "true",
        windows11instalado: values.windows11instalado === "true",
        driverImpresoraInstalado: values.driverImpresoraInstalado === "true",
        impresoraConfigurada: values.impresoraConfigurada === "true",
        monitorEntregado: values.monitorEntregado === "true",
        tecladoEntregado: values.tecladoEntregado === "true",
        ratonEntregado: values.ratonEntregado === "true",
        gmailAppleIdCreada: values.gmailAppleIdCreada === "true",
        outlookDesplegadoMovil: values.outlookDesplegadoMovil === "true",
        teamsDesplegadoMovil: values.teamsDesplegadoMovil === "true",
        harmonyMobileInstalado: values.harmonyMobileInstalado === "true",
        jamfInstalado: values.jamfInstalado === "true",
        pruebaLlamadasMovil: values.pruebaLlamadasMovil === "true",
        teamviewerEnMovil: values.teamviewerEnMovil === "true",
        movilDesasignado: values.movilDesasignado === "true",
        terminalFijoTelefonia: values.terminalFijoTelefonia === "true",
    };
    console.log("Form Submitted (transformed):", transformedValues);


    try {
      // @ts-ignore
      const newUser = await addUser(transformedValues);
      toast({
        title: "Usuario Añadido Correctamente",
        description: `El usuario ${newUser.name} (ID: ${newUser.id}) ha sido creado.`,
        variant: "default",
      });
      router.push('/users');
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error al Añadir Usuario",
        description: "Hubo un problema al guardar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6"/> Añadir Nuevo Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-user-form">
              
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Información Principal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre y Apellidos</FormLabel><FormControl><Input placeholder="e.g., Juan Pérez" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Corporativo</FormLabel><FormControl><Input type="email" placeholder="e.g., jperez@ejemplo.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" placeholder="Introduce una contraseña" {...field} /></FormControl><FormDescription>Mínimo 8 caracteres.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Departamento</FormLabel><FormControl><Input placeholder="e.g., Ingeniería" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="role" render={({ field }) => (<FormItem><FormLabel>Rol</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger></FormControl><SelectContent>{userRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Número de Teléfono</FormLabel><FormControl><Input type="tel" placeholder="e.g., 123-456-7890" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="joinDate" render={({ field }) => (<FormItem><FormLabel>Fecha de Incorporación/Alta</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                 </div>
              </section>
              
              <Separator />
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Detalles de Cuenta y Empleado</h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="tipoCuenta" render={({ field }) => (<FormItem><FormLabel>Tipo de Cuenta</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="estadoCuenta" render={({ field }) => (<FormItem><FormLabel>Estado de la Cuenta</FormLabel><FormControl><Input placeholder="Activa, Bloqueada..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="empresa" render={({ field }) => (<FormItem><FormLabel>Empresa</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="ubicacion" render={({ field }) => (<FormItem><FormLabel>Ubicación</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="pais" render={({ field }) => (<FormItem><FormLabel>País</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="fechaSalidaBaja" render={({ field }) => (<FormItem><FormLabel>Fecha de Salida/Baja</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="puestoTrabajo" render={({ field }) => (<FormItem><FormLabel>Puesto de Trabajo</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="responsableManager" render={({ field }) => (<FormItem><FormLabel>Responsable (Manager)</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="entornoCorporativo" render={({ field }) => (<FormItem><FormLabel>Entorno Corporativo</FormLabel><FormControl><Input placeholder="Producción, Desarrollo..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </section>

              <Separator />
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Cuenta Directorio Activo (DA) / O365</h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderSelectBooleanField(form, "cuentaDAcreada", "Cuenta en DA Creada")}
                    <FormField control={form.control} name="nombreCuentaWindowsO365" render={({ field }) => (<FormItem><FormLabel>Nombre Cuenta Windows/O365</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "fichaDArellena", "Ficha en DA Rellena")}
                    {renderSelectBooleanField(form, "licenciaO365asignada", "Licencia O365 Asignada")}
                    {renderSelectBooleanField(form, "asignadoListasDistribucionO365", "Asignado a Listas Distribución O365")}
                    {renderSelectBooleanField(form, "citaEnCalendario", "Cita en Calendario")}
                    {renderSelectBooleanField(form, "contrasenaPersonalizada", "Contraseña Personalizada")}
                    <FormField control={form.control} name="contrasenaInicialEstablecida" render={({ field }) => (<FormItem><FormLabel>Contraseña Inicial Establecida</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tarjetaRFIDaccesoMadrid" render={({ field }) => (<FormItem><FormLabel>Tarjeta RFID Acceso - Madrid</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "accesoRepositorioOtorgado", "Acceso a Repositorio Otorgado")}
                    <FormField control={form.control} name="rutaRepositorioAcceso" render={({ field }) => (<FormItem><FormLabel>Ruta Repositorio para Acceso</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "emailOnboardingEnviado", "Email de Onboarding Enviado")}
                    {renderSelectBooleanField(form, "usuarioAsignadoNetworkOperatorDA", "Usuario Asignado a 'Network Operator' en DA")}
                 </div>
              </section>

              <Separator />
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Endpoint (Equipo Informático)</h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="endpointTipo" render={({ field }) => (<FormItem><FormLabel>Tipo de Endpoint</FormLabel><FormControl><Input placeholder="Portátil, Torre..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "ficheroPlataformadoEntregado", "Fichero Plataformado Entregado")}
                    <FormField control={form.control} name="usuarioAdminLocalEstablecido" render={({ field }) => (<FormItem><FormLabel>Usuario Admin Local Establecido</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipoInformaticoAsignado" render={({ field }) => (<FormItem><FormLabel>Equipo Informático Asignado (ID Activo)</FormLabel><FormControl><Input placeholder="ASSET-XXX" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="marcaModeloEndpoint" render={({ field }) => (<FormItem><FormLabel>Marca y Modelo Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "codigoBitlockerRepositorio", "Código BitLocker en Repositorio")}
                    <FormField control={form.control} name="numeroSerieEndpoint" render={({ field }) => (<FormItem><FormLabel>Número de Serie de Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="macWifiEndpoint" render={({ field }) => (<FormItem><FormLabel>MAC WiFi Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="macEthernetEndpoint" render={({ field }) => (<FormItem><FormLabel>MAC Ethernet Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="marcaModeloCargadorEndpoint" render={({ field }) => (<FormItem><FormLabel>Marca y Modelo Cargador Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="nombreAsignadoEndpoint" render={({ field }) => (<FormItem><FormLabel>Nombre Asignado al Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "endpointEnDominio", "Endpoint en Dominio")}
                    {renderSelectBooleanField(form, "homepageFactorialNavegadores", "Homepage (Factorial) en Navegadores")}
                    {renderSelectBooleanField(form, "bitlockerActivo", "BitLocker Activo")}
                    {renderSelectBooleanField(form, "teamviewerCorporativoInstalado", "TeamViewer Corporativo Instalado")}
                    {renderSelectBooleanField(form, "teamviewerEnEndpoint", "TeamViewer en Endpoint")}
                    <FormField control={form.control} name="idTeamviewerEndpoint" render={({ field }) => (<FormItem><FormLabel>ID TeamViewer Endpoint</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "sevenZipInstalado", "7Zip Instalado")}
                    {renderSelectBooleanField(form, "antimalwareInstalado", "Antimalware Instalado")}
                    {renderSelectBooleanField(form, "adobeAcrobatReaderInstalado", "Adobe Acrobat Reader Instalado")}
                    {renderSelectBooleanField(form, "forticlientVpnInstalado", "FortiClient VPN Instalado")}
                    {renderSelectBooleanField(form, "office365instalado", "Office 365 Instalado")}
                    {renderSelectBooleanField(form, "accesoOffice365correcto", "Acceso a Office 365 Correcto")}
                    {renderSelectBooleanField(form, "onedriveInstalado", "OneDrive Instalado")}
                    {renderSelectBooleanField(form, "deshabilitarOnedriveBackupEscritorio", "Deshabilitar OneDrive Backup Escritorio")}
                    {renderSelectBooleanField(form, "teamsInstalado", "Teams Instalado")}
                    {renderSelectBooleanField(form, "restauracionSistemaActivo", "Restauración Sistema Activo")}
                    {renderSelectBooleanField(form, "bginfoInstaladoConfigurado", "BGInfo Instalado y Configurado")}
                    {renderSelectBooleanField(form, "googleEarthProInstalado", "Google Earth Pro Instalado")}
                    {renderSelectBooleanField(form, "softphoneEnEndpoint", "Softphone en Endpoint")}
                    {renderSelectBooleanField(form, "qgisInstalado", "QGIS Instalado")}
                    {renderSelectBooleanField(form, "pdf24instalado", "PDF24 Instalado")}
                    <FormField control={form.control} name="idiomaWindowsEstablecido" render={({ field }) => (<FormItem><FormLabel>Idioma Windows Establecido</FormLabel><FormControl><Input placeholder="Español" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "firefoxChromeInstalado", "Firefox y/o Chrome Instalado")}
                    <FormField control={form.control} name="statusActividad" render={({ field }) => (<FormItem><FormLabel>Status Actividad Endpoint</FormLabel><FormControl><Input placeholder="Active" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "visorDwgInstalado", "Visor DWG Instalado")}
                    {renderSelectBooleanField(form, "windows11instalado", "Windows 11 Instalado")}
                    <FormField control={form.control} name="softwareInstaladoAdicional" render={({ field }) => (<FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>Software Adicional Instalado</FormLabel><FormControl><Textarea placeholder="Listar software adicional..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                 </div>
              </section>
              
              <Separator />
              <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b pb-2">Impresora</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="numeroPlantaImpresora" render={({ field }) => (<FormItem><FormLabel>Número de Planta de Impresora</FormLabel><FormControl><Input placeholder="N/A" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                      {renderSelectBooleanField(form, "driverImpresoraInstalado", "Driver Impresora Instalado")}
                      <FormField control={form.control} name="codigoUsuarioImpresora" render={({ field }) => (<FormItem><FormLabel>Código Usuario Impresora</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                      {renderSelectBooleanField(form, "impresoraConfigurada", "Impresora Configurada")}
                  </div>
              </section>

              <Separator />
              <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b pb-2">Periféricos</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="monitorAsignado" render={({ field }) => (<FormItem><FormLabel>Monitor Asignado (ID Activo)</FormLabel><FormControl><Input placeholder="ASSET-YYY" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                      {renderSelectBooleanField(form, "monitorEntregado", "Monitor Entregado")}
                      <FormField control={form.control} name="tecladoAsignado" render={({ field }) => (<FormItem><FormLabel>Teclado Asignado (ID Activo)</FormLabel><FormControl><Input placeholder="ASSET-ZZZ" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                      {renderSelectBooleanField(form, "tecladoEntregado", "Teclado Entregado")}
                      <FormField control={form.control} name="ratonAsignado" render={({ field }) => (<FormItem><FormLabel>Ratón Asignado (ID Activo)</FormLabel><FormControl><Input placeholder="ASSET-AAA" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                      {renderSelectBooleanField(form, "ratonEntregado", "Ratón Entregado")}
                  </div>
              </section>

              <Separator />
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Telefonía Móvil</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="imeisMovil" render={({ field }) => (<FormItem><FormLabel>IMEIs del Móvil</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="smartphoneAsignado" render={({ field }) => (<FormItem><FormLabel>Smartphone Asignado (ID Activo)</FormLabel><FormControl><Input placeholder="ASSET-MOB" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="marcaModeloMovil" render={({ field }) => (<FormItem><FormLabel>Marca y Modelo de Móvil</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="direccionMacWifiMovil" render={({ field }) => (<FormItem><FormLabel>Dirección MAC WiFi Móvil</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "gmailAppleIdCreada", "GMAIL O APPLE ID PARA MÓVIL CREADA")}
                    <FormField control={form.control} name="nombreCuentaGmailAppleId" render={({ field }) => (<FormItem><FormLabel>Nombre Cuenta Gmail o Apple ID</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="movilAsignadoNumero" render={({ field }) => (<FormItem><FormLabel>Número de Móvil Asignado</FormLabel><FormControl><Input placeholder="N/A o número" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="numeroSerieMovil" render={({ field }) => (<FormItem><FormLabel>Número de Serie del Móvil</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "outlookDesplegadoMovil", "Outlook Desplegado en Móvil")}
                    {renderSelectBooleanField(form, "teamsDesplegadoMovil", "Teams Desplegado en Móvil")}
                    {renderSelectBooleanField(form, "harmonyMobileInstalado", "Harmony Mobile Instalado")}
                    <FormField control={form.control} name="mdmFullParcial" render={({ field }) => (<FormItem><FormLabel>MDM Full o Parcial</FormLabel><FormControl><Input placeholder="Full, Parcial, Ninguno" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "jamfInstalado", "JAMF Instalado")}
                    {renderSelectBooleanField(form, "pruebaLlamadasMovil", "Prueba de Llamadas Móvil OK")}
                    {renderSelectBooleanField(form, "teamviewerEnMovil", "TeamViewer en Móvil")}
                    <FormField control={form.control} name="idTeamviewerMovil" render={({ field }) => (<FormItem><FormLabel>ID TeamViewer Móvil</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "movilDesasignado", "Móvil Desasignado")}
                    {renderSelectBooleanField(form, "terminalFijoTelefonia", "Terminal Fijo de Telefonía Entregado")}
                    <FormField control={form.control} name="platDireccionMacTerminalFijo" render={({ field }) => (<FormItem><FormLabel>Plataforma/MAC Terminal Fijo</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </section>
              
              <Separator />
              <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b pb-2">Comentario y Entrega de Material</h3>
                  <FormField control={form.control} name="comentarioEntregaMaterial" render={({ field }) => (<FormItem><FormLabel>Comentarios Adicionales</FormLabel><FormControl><Textarea placeholder="Cualquier comentario sobre la entrega de material, estado, etc." className="min-h-[100px]" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
              </section>

            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="mr-2">
                Cancelar
            </Button>
            <Button type="submit" form="add-user-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Usuario'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
