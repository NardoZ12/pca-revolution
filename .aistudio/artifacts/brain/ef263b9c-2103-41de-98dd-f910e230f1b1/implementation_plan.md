# Plan de Implementación: Sistema Integral de Punta Cana Academy

Este plan detalla los pasos para resolver los 7 requerimientos solicitados: validación estricta de inicio de sesión docente, visibilidad y funcionalidad de duplicar/eliminar cursos para Nardo Zorrilla, migración total de datos a Firebase Firestore eliminando `localStorage`, control de acceso y transmisión en vivo para aulas virtuales, y enrutamiento con URLs limpias para cada página.

---

## 1. Validación de Autenticación de Profesores (Requisito 1)
- **Problema actual**: El acceso permitía ingresar con credenciales no registradas o no verificadas.
- **Solución**:
  - En `TeacherAuthModal.tsx` y `syncService.ts`, consultar la colección `users` en Firestore filtrando por correo y rol `'teacher'`.
  - Si el usuario no existe en Firestore o la contraseña no coincide, rechazar el inicio de sesión con un mensaje de alerta visible: *"Credenciales no registradas o cuenta no autorizada"*.
  - Exigir que la cuenta tenga estado verificado (`isVerified === true` o código confirmado).

---

## 2. Botones de Duplicar y Eliminar Cursos para Nardo Zorrilla (Requisito 2)
- **Problema actual**: El profesor Nardo Zorrilla (`nardo2736@gmail.com`) no visualizaba con claridad los botones de acción para duplicar y eliminar cursos en su panel.
- **Solución**:
  - En `TeacherDashboard.tsx`, asegurar que la verificación del profesor acepte a `nardo2736@gmail.com` y profesores autenticados sin restricciones de mayúsculas ni clases CSS ocultas (`hidden sm:inline`).
  - Colocar los botones de **"Duplicar Curso"** y **"Eliminar Curso"** de forma visible y directa en cada tarjeta de curso con iconos distintivos y modal de confirmación antes de borrar.
  - Sincronizar la duplicación y eliminación directamente en la colección `courses` de Firestore.

---

## 3. Migración a Base de Datos Firestore y Eliminación de LocalStorage (Requisitos 3 y 5)
- **Problema actual**: La aplicación dependía de claves en `localStorage` (`pca_courses`, `pca_user`, etc.) que no persisten en la nube ni se sincronizan entre usuarios reales.
- **Solución**:
  - Crear colecciones centralizadas en Firebase Firestore:
    - `users`: Perfiles de profesores y estudiantes, roles, información de pago.
    - `courses`: Catálogo unificado de cursos, contenido curricular, precio y estado de publicación.
    - `course_enrollments`: Inscripciones activas de cada estudiante a los cursos.
    - `tasks` y `submissions`: Tareas asignadas, entregas de estudiantes y calificaciones.
    - `live_sessions`: Estado en vivo de las aulas virtuales por curso.
  - Actualizar `syncService.ts` para que todas las lecturas y escrituras se realicen con Firestore (`getDocs`, `setDoc`, `updateDoc`, `deleteDoc` y `onSnapshot` para cambios en tiempo real).
  - Purgar el uso de `localStorage` para el almacenamiento de entidades de la aplicación.

---

## 4. Estructuración y Control de Aulas Virtuales en Vivo (Requisitos 4 y 6)
- **Problema actual**: Los estudiantes no tenían sincronizada el aula con el profesor en vivo, o podían entrar a aulas inactivas sin transmisión de video.
- **Solución**:
  - **Iniciación por el Profesor**:
    - Antes de transmitir, el profesor debe seleccionar obligatoriamente uno de sus cursos creados y definir el nombre de la sesión.
    - Al iniciar, se registra en Firestore (`live_sessions/{courseId}`) con `isLive: true`, `teacherId`, `teacherName`, `sessionTitle`, `startedAt`.
  - **Restricción de Acceso para Estudiantes**:
    - En el panel del estudiante, solo se muestran como activas las aulas de los cursos en los que el estudiante está inscrito.
    - Si el profesor no ha iniciado la sesión o finalizó la clase, se bloquea el acceso con un aviso explicativo y no se permite la entrada a aulas fantasma.
  - **Transmisión de Video en Vivo**:
    - Integrar captura de cámara y micrófono del profesor con canal de señalización en tiempo real (o WebRTC streaming) para proyectar el video del docente directamente en la pantalla de los estudiantes conectados a esa aula.

---

## 5. Enrutamiento con URLs Limpias y Páginas Separadas (Requisito 7)
- **Problema actual**: La aplicación cambiaba de vistas con una variable interna sin modificar la barra de direcciones del navegador.
- **Solución**:
  - Implementar un sistema de enrutamiento basado en HTML5 History API (`window.history.pushState` y escucha de `popstate`):
    - `/` -> Página de inicio (Landing page principal de Punta Cana Academy)
    - `/cursos` -> Catálogo completo y marketplace de cursos
    - `/profesores` -> Portal y dashboard del profesor
    - `/estudiantes` -> Portal y dashboard del estudiante
    - `/aula/:courseId` -> Aula virtual en vivo protegida
    - `/nosotros`, `/contacto`, `/terminos`, `/privacidad` -> Páginas independientes de pie de página
  - Permitir navegación directa, uso de botones atrás/adelante del navegador y recarga conservando la sección correspondiente.

---

## 6. Verificación y Pruebas
1. Ejecutar `compile_applet` y `lint_applet` para garantizar cero errores de TypeScript y compilación.
2. Comprobar inicio de sesión con profesor no registrado (rechazo inmediato).
3. Comprobar inicio de sesión con Nardo Zorrilla (visualización inmediata de botones de duplicar y eliminar cursos).
4. Iniciar clase en vivo como profesor y verificar que solo los estudiantes inscritos pueden verla y acceder a la transmisión.
5. Probar cambios de URL (`/cursos`, `/profesores`, `/estudiantes`, `/`) y navegación del historial del navegador.
