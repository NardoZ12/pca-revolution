# Plan de Implementación: Autenticación Real en Firebase, Sincronización Global de Cursos y Aula Virtual en Vivo

Este plan aborda de manera definitiva los problemas reportados: bloqueo estricto de usuarios no registrados mediante Firebase Auth, sincronización en tiempo real de los cursos de Nardo Zorrilla en toda la web (pública, catálogo y marketplace), corrección del cierre del modal de inicio de clase, solución al apagado de cámara en ambos dashboards y visualización garantizada de la clase en vivo para los estudiantes con alerta emergente.

---

## 1. Autenticación Real con Firebase Auth y Firestore (Requisito 3)
- **Problema actual**: Al digitar cualquier correo y contraseña inventados, la plataforma permitía el acceso porque existían fallbacks locales que creaban perfiles ficticios en memoria.
- **Solución Definitiva**:
  - **Estudiantes (`AuthModal.tsx`)**:
    - Implementar autenticación real mediante `signInWithEmailAndPassword(auth, email, password)` de Firebase Auth.
    - Para nuevos registros, ejecutar `createUserWithEmailAndPassword(auth, email, password)` y almacenar el documento en `students/{uid}` en Firestore.
    - Si el usuario no existe o la contraseña es inválida, capturar los errores de Firebase (`auth/user-not-found`, `auth/wrong-password`, `auth/invalid-credential`) y bloquear el acceso mostrando: *"Correo o contraseña incorrectos. Si no tienes cuenta, debes registrarte primero."*
  - **Profesores (`TeacherAuthModal.tsx`)**:
    - Validar las credenciales en Firebase Auth o verificar contra el documento registrado y confirmado en la colección `teachers` de Firestore.
    - Rechazar de forma tajante cualquier intento de acceso con credenciales no registradas o cuentas docentes no verificadas.
    - Eliminar cualquier generación automática de perfiles temporales.

---

## 2. Sincronización Global de Cursos de Nardo en Firestore (Requisito 1)
- **Problema actual**: Las modificaciones, duplicaciones o eliminaciones hechas por el profesor Nardo no se reflejaban de inmediato en el catálogo de `/cursos`, en el marketplace de estudiantes ni en la página principal.
- **Solución Definitiva**:
  - Asignar todos los cursos oficiales a Nardo Zorrilla (`instructor: 'Prof. Nardo Zorrilla'`).
  - Sincronizar directamente con la colección `courses` de Firebase Firestore:
    - Lectura en tiempo real con `onSnapshot` en `coursesData.ts` y propagación reactiva.
    - Al crear un curso (`saveNewPublishedCourse`): guardar en `courses/{courseId}` con `serverTimestamp()`.
    - Al duplicar (`duplicatePublishedCourse`): clonar con nuevo ID en Firestore.
    - Al editar un curso: actualizar los campos en Firestore.
    - Al eliminar (`deletePublishedCourse`): ejecutar `deleteDoc(doc(db, 'courses', courseId))` en Firestore.
  - Asegurar que `CoursesCatalogPage`, `CoursesSection`, `CourseDetailPage` y `StudentDashboard` (vista de marketplace y mis cursos) se actualicen instantáneamente sin requerir recargar la página.

---

## 3. Corrección de Aulas Virtuales, Cámara y Notificación en Vivo (Requisito 2)
- **Problema A (Cierre de Modal)**: Al pulsar *"Aceptar e Iniciar Clase"*, el modal permanecía visible en pantalla.
  - *Solución*: En `handleConfirmStartLiveSession`, forzar de inmediato `setIsLiveSetupModalOpen(false)` y `setShowLiveConfirmDialog(false)` antes de iniciar el stream y cambiar `activeTab` a `'classroom'`.
- **Problema B (Apagado de Cámara)**:
  - *Causa detectada*: El `useEffect` que escucha `activeTab` tenía a `isCamOn` en sus dependencias; al llamar `stopCameraStream()`, el cambio de estado volvía a ejecutar el efecto y reencendía la cámara de inmediato.
  - *Solución*: Implementar una bandera de intención explícita (`userWantsCamOff`) y detener todos los `MediaStreamTracks`. Al apagar la cámara, esta se mantendrá apagada tanto en `TeacherDashboard` como en `VirtualClassroom`.
- **Problema C (Detección de Clase en Vivo por los Estudiantes)**:
  - Al iniciar la clase, registrar en Firestore `classroom_sessions/live_session_current`:
    - `isLive: true`
    - `courseId`: ID del curso seleccionado
    - `courseTitle`: Título exacto del curso
    - `topicTitle`: Nombre de la sección ingresada
    - `teacherName`: Nombre del docente
  - En `StudentDashboard.tsx`:
    - El estudiante suscrito en tiempo real detectará de inmediato si el profesor está en vivo en su curso inscrito (`course.id === classroomSession.courseId` o coincidencia de título).
    - La tarjeta del curso pasará de *"Clase Offline"* a *"EN VIVO AHORA - Unirse al Aula"* (rojo parpadeante).
    - Se mostrará un **banner superior prominente** en el dashboard.
    - Se activará una **alerta emergente flotante** en la esquina inferior con sonido sutil y botón de acceso directo *"¡Tu profesor está transmitiendo en vivo! Entrar al Aula"*.
- **Problema D (Título del Curso en el Aula del Profesor)**:
  - En la vista `classroom` de `TeacherDashboard`, renderizar de forma visible el título del curso que se está impartiendo (`selectedLiveCourseId` / `liveSectionName`), en lugar de mostrar un encabezado genérico.

---

## 4. Plan de Pruebas y Verificación
1. Intentar inicio de sesión con correo falso en el portal de estudiantes y de profesores -> Verificar que ambos sean rechazados con el mensaje de error correspondiente.
2. Iniciar sesión como Prof. Nardo Zorrilla, editar/duplicar un curso -> Abrir `/cursos` y el dashboard del estudiante y confirmar que los cambios aparecen de inmediato.
3. Iniciar clase en vivo para "Gestión de Hotelería de Lujo" -> Confirmar que el modal se cierra solo y la pantalla muestra el título del curso.
4. Apagar la cámara desde los controles del aula -> Verificar que la cámara se apaga completamente y no se vuelve a encender sola.
5. Iniciar sesión como estudiante inscrito -> Verificar que el botón de la tarjeta se activa en rojo, el banner aparece y salta la alerta emergente para unirse al aula.
6. Ejecutar `compile_applet` y `lint_applet` para asegurar cero errores de TypeScript y compilación.
