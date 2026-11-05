# Sistema Unificado de Registro, Verificación de Código, Checkout y Diagnóstico WebRTC

Plan integral para Punta Cana Academy que conecta el hero email bar, unifica el flujo de registro paso a paso (datos de cuenta → verificación de código por correo → pasarela de pago $0.00/curso) dentro del mismo modal blanco, corrige la visualización y retroceso en tablets/computadoras, y añade un módulo interactivo de diagnóstico de permisos nativos WebRTC en el Aula Virtual.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones confirmadas por el usuario en la fase de clarificación:**
> - **Flujo de Registro y Checkout**: Proceso guiado en 3 etapas fluidas dentro del modal de registro: (1) Datos de cuenta validados, (2) Verificación de código PIN con plantilla oficial de bienvenida, (3) Pasarela de pago integrada ($0.00 en prueba o monto del curso) y entrada automática al Dashboard de Estudiante.
> - **Verificación de Correo Electrónico**: Modal interactivo de alta fidelidad que simula la bandeja de entrada institucional con logotipo oficial de Punta Cana Academy, mensaje de bienvenida y código de 6 dígitos con botón de copiado y autofill.
> - **Diagnóstico de Permisos de Cámara y Micrófono**: Componente de diagnóstico nativo en el Aula Virtual y en la cabina de video que solicita explícitamente los permisos `navigator.mediaDevices.getUserMedia`, detecta denegación o bloqueo de políticas de iframe, y guía al usuario paso a paso con botones de reintento.

---

### 1. Overview & Core Concept

- **Qué hace**:
  1. **Hero Email Capture Conectado**: Al ingresar el correo en el hero bar y presionar la flecha o pulsar Enter, abre inmediatamente el modal de registro con el correo ya colocado en el campo de texto.
  2. **Flujo Unificado de Inscripción y Pago**: Todo botón de "Obtén una prueba gratis", "Se Pro Caribe / Gratis con Pro Caribe" o compra de curso conduce al mismo modal de registro blanco configurado. Primero registra los datos del usuario, luego verifica el código enviado al correo en una plantilla visual con el logo institucional, y pasa inmediatamente al pago (cargando $0.00 en prueba gratis o el precio del curso), registrando la transacción en el historial de facturación y llevando directamente al Dashboard de Estudiante.
  3. **Seguridad y Validación de Credenciales**: El formulario de registro exige confirmación de contraseña (`confirmPassword`) y valida que contenga caracteres especiales (`!@#$%^&*`, etc.), mayúsculas, minúsculas y longitud mínima, mostrando retroalimentación en tiempo real.
  4. **Corrección de Diseño Responsivo en Registro**:
     - *Columna izquierda (escritorio)*: Ajuste de proporciones, padding y espaciado para que el titular, la propuesta de valor, el testimonio y los datos de la sede Friusa encajen sin cortarse en pantallas de computadora y laptops.
     - *Modo Tablet y Móvil*: Incorporación de un botón de retroceso/cierre visible en la cabecera superior derecha/izquierda del modal en todas las resoluciones.
  5. **Diagnóstico y Activación de Permisos del Navegador**: El navegador no siempre lanza el prompt de permisos si el iframe no tiene interacción explícita del usuario o si se encuentra bloqueado. Agregamos un asistente de diagnóstico con botón directo "Solicitar Permisos de Cámara y Micrófono", comprobando el estado de hardware de `navigator.mediaDevices` y mostrando instrucciones claras en pantalla si el acceso fue bloqueado.
  6. **Autenticación y Persistencia Completa**: Al registrarse, el perfil del estudiante se crea con su ID, correo, plan seleccionado, historial de cobro $0.00 inicial, y se inicia la sesión automáticamente sin pantallas intermedias huérfanas.

---

### 2. User Experience & Visual Design

#### A. Flujo de Usuario Paso a Paso (Paso 1 → Paso 2 → Paso 3 → Dashboard)

```
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 1: REGISTRO DE CUENTA                                             │
│ · Nombre, Correo (prellenado desde el Hero), Teléfono/WhatsApp        │
│ · Contraseña segura (con indicador de caracteres especiales)           │
│ · Confirmación de contraseña exacta                                    │
│ · Botón: "Continuar a Verificación"                                    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 2: VERIFICACIÓN DE CÓDIGO POR CORREO ELECTRÓNICO                 │
│ · Modal / Vista con plantilla de correo de bienvenida de Punta Cana     │
│   Academy (Logo oficial, saludo personalizado, código PIN de 6 dígitos) │
│ · Input de 6 dígitos con auto-enfoque y botón "Copiar e Ingresar"     │
│ · Botón: "Verificar y Continuar al Pago"                              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 3: PASARELA DE PAGO INTEGRADA ($0.00 o Curso Seleccionado)        │
│ · Resumen claro: "Prueba 12 Días Gratis ($0.00 hoy)"                   │
│ · Nota: "Sin permanencia · Cancela cuando quieras antes del día 12"    │
│ · Tarjeta de crédito simulada / real con sellos de seguridad dorados   │
│ · Botón: "Activar Acceso y Entrar al Dashboard"                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SESIÓN INICIADA: REDIRECCIÓN AUTOMÁTICA AL DASHBOARD DE ESTUDIANTE     │
│ · Factura de $0.00 reflejada en la pestaña "Facturación"               │
│ · Cabina de cámara WebRTC y cursos matriculados disponibles            │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Identidad Visual y Correcciones de Layout

- **Columna Izquierda del Registro (Dark Academy Luxe)**:
  - Fondo azul oscuro con textura de campus y degradado sutil.
  - Tipografía equilibrada: Reducción del tamaño del titular de `5xl` a `text-2xl sm:text-3xl` para que nunca desborde el contenedor vertical.
  - Tarjeta de testimonio compacta con micro-avatar y mención a la Sede Friusa fija al pie sin superposición.
- **Botón de Retroceso en Tablet y Móvil**:
  - Botón de flecha atrás y botón `X` de cierre colocados en la barra superior fija del modal en pantallas móviles y tablets (`md:`, `max-lg:`).
- **Plantilla Oficial de Correo de Bienvenida**:
  - Encabezado con el logotipo transparente de Punta Cana Academy (`/assets/aistudio/logo_7f87d68b.png`).
  - Asunto: *"¡Bienvenido a Punta Cana Academy! Tu código de activación es [123456]"*.
  - Tarjeta central con código PIN en números grandes y legibles, fecha de emisión y sede Friusa.
- **Diagnóstico WebRTC en Aula Virtual**:
  - Modal o banner flotante de diagnóstico: *"Verificando cámara y micrófono..."*
  - Si el navegador tiene permisos denegados o iframe restringido, muestra el botón *"Permitir Cámara y Micrófono"* y pasos para hacer clic en el candado de la barra de direcciones de Google Chrome/Edge.

---

### 3. Key Product Decisions & Trade-Offs

- **Modal de Registro Multietapa vs Modales Separados**:
  - *Decisión*: Integrar los pasos (Registro → Código PIN → Pago) dentro del mismo componente `AuthModal` o mediante navegación de estado sincronizada, en lugar de cerrar un modal y abrir otro repentinamente.
  - *Razón*: Evita parpadeos, pérdidas de foco y desorientación del usuario, garantizando que el correo ingresado en el Hero nunca se pierda.
- **Monto de Cobro Inicial $0.00**:
  - *Decisión*: Al seleccionar la prueba gratis de 12 días, el cobro inmediato se registra como `$0.00`, con una notificación clara de que el plan de $49/mes o la membresía seleccionada solo se aplicará al finalizar los 12 días.
  - *Razón*: Cumple exactamente con la solicitud del usuario y genera confianza en el estudiante.
- **Validación de Caracteres Especiales**:
  - *Decisión*: Exigir al menos un carácter especial (`[!@#$%^&*(),.?":{}|<>]`), al menos 8 caracteres y validación en vivo mientras el usuario escribe, con un indicador visual verde/rojo.

---

### 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           HeroSection.tsx                                 │
│  [ Input: "Ingresa tu correo" ] ──(Submit/Arrow)──> onOpenSignUp(email)   │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                      │
│  State: authModalOpen, authInitialEmail, authTargetPlan                   │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                            AuthModal.tsx                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Step 1: Account Form (Name, Email, Phone, Pass + Confirm + Special) │ │
│  └──────────────────────────────────┬───────────────────────────────────┘ │
│                                     ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Step 2: Email Verification Code (Interactive PCA Welcome Template)   │ │
│  └──────────────────────────────────┬───────────────────────────────────┘ │
│                                     ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Step 3: Integrated Checkout ($0.00 / Course Price + Billing Record)  │ │
│  └──────────────────────────────────┬───────────────────────────────────┘ │
│                                     │                                     │
│               createStudentProfile() & onLoginSuccess()                   │
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       StudentDashboard.tsx                                │
│  · Facturación actualizada con cargo de $0.00                             │
│  · Acceso al Aula Virtual y cursos                                        │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      VirtualClassroom.tsx                                 │
│  · WebRTC Diagnostic Assistant (navigator.mediaDevices check)             │
│  · Native Permission Trigger button + Step-by-step unblock guide          │
└───────────────────────────────────────────────────────────────────────────┘
```

#### Plan de Archivos y Componentes

1. `src/components/HeroSection.tsx`:
   - Conectar el formulario del Hero para que `handleSubscribe` envíe el correo a `onOpenSignUp(email)`.
2. `src/components/AuthModal.tsx`:
   - Agregar prop `initialEmail?: string`.
   - Modificar layout para evitar recorte en pantalla completa de escritorio y habilitar scrollbar fluido.
   - Agregar botón de retroceso/cierre visible en tablet y móvil.
   - Agregar campo "Confirmar Contraseña" y validador de caracteres especiales (`/[!@#$%^&*(),.?":{}|<>]/`).
   - Implementar paso 2 de verificación con plantilla visual de correo oficial con el logo de PCA.
   - Implementar paso 3 con la pasarela de pago embebida ($0.00 en prueba o precio de curso).
   - Crear el usuario de inmediato y añadir la factura de $0.00 al historial de pagos del alumno.
3. `src/components/VirtualClassroom.tsx` y `src/lib/webrtcHelper.ts`:
   - Agregar comprobación explícita de `navigator.permissions.query({ name: 'camera' as any })` y `getUserMedia`.
   - Implementar el asistente de diagnóstico interactivo con botón directo "Solicitar Permisos de Cámara y Micrófono" que dispara el diálogo del navegador.
   - Si el hardware está bloqueado o denegado, mostrar una guía visual con iconos para desbloquear la cámara en la barra de direcciones de Chrome/Firefox/Safari.
4. `src/App.tsx`:
   - Manejar el estado `signUpEmail` al abrir `AuthModal` desde el Hero, botones de planes de membresía o catálogo de cursos.
