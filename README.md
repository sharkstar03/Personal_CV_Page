# Personal CV Page - Edgar Ng

Este proyecto es una página de currículum vitae (CV) interactiva y moderna con una estética **Cyberpunk / Tech**, diseñada para destacar un perfil profesional tecnológico de alto nivel. Combina un diseño visual impactante para la web con una versión optimizada y limpia para la impresión en PDF.

## 🚀 Características Principales

### 🎨 Diseño y UI (Web)
*   **Estética Cyberpunk:** Uso de colores neón, tipografías monoespaciadas (JetBrains Mono) y efectos visuales modernos.
*   **Intro Animation:** Una pantalla de carga inmersiva con animación 3D y temática de "System Boot".
*   **Glassmorphism:** Paneles con efecto de vidrio esmerilado (`backdrop-filter`) para un look elegante y moderno.
*   **Interactividad:**
    *   Cursor personalizado que sigue el movimiento del mouse.
    *   Fondo animado con partículas (Canvas).
    *   Efectos hover y transiciones suaves.
*   **Responsive Design:** Adaptable a dispositivos móviles y de escritorio.

### 🖨️ Optimización para Impresión (Print)
*   **Layout Específico:** Al imprimir (o guardar como PDF), el diseño se transforma completamente.
*   **Ahorro de Tinta:** Se eliminan los fondos oscuros y efectos visuales pesados, pasando a un diseño limpio en blanco y negro (o escala de grises).
*   **Estructura de Columnas:** El contenido se reorganiza en una cuadrícula optimizada para papel A4/Carta, maximizando el uso del espacio.
*   **Control de Paginación:** Reglas CSS específicas (`page-break`) para evitar cortes incómodos en secciones importantes.

## 🛠️ Tecnologías Utilizadas

*   **HTML5:** Semántico y estructurado.
*   **CSS3:**
    *   CSS Variables para gestión de temas.
    *   CSS Grid y Flexbox para layouts complejos.
    *   Media Queries para diseño responsivo y modo impresión.
    *   Animaciones y Keyframes.
*   **JavaScript (Vanilla):**
    *   Lógica para la pantalla de carga.
    *   Animación del canvas de fondo.
    *   Control del cursor personalizado.
    *   Manejo del modal de contacto.
*   **Librerías Externas:**
    *   [Feather Icons](https://feathericons.com/): Para iconos vectoriales ligeros.
    *   [Google Fonts](https://fonts.google.com/): Space Grotesk y JetBrains Mono.

## 📂 Estructura del Proyecto

```
/
├── index.html          # Estructura principal del sitio
├── css/
│   └── style.css       # Estilos globales, animaciones y media queries de impresión
├── js/
│   └── script.js       # Lógica de interacción y animaciones
└── assets/
    └── profile.jpg     # Imagen de perfil
```

## 📖 Cómo Usar

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    ```
2.  **Abrir el proyecto:**
    Simplemente abre el archivo `index.html` en tu navegador web moderno favorito (Chrome, Edge, Firefox).
3.  **Generar PDF:**
    Para obtener la versión imprimible, usa la función de impresión del navegador (`Ctrl + P` o `Cmd + P`) y selecciona "Guardar como PDF". Asegúrate de que la opción "Gráficos de fondo" esté activada si deseas mantener ciertos detalles visuales sutiles, aunque el diseño está pensado para funcionar bien sin ellos.

## 👤 Autor

**Edgar Ng**
*   Founder & CEO @ QUANTIUM CREW
*   IT Senior @ Farmacia Saba

---
*Proyecto desarrollado con pasión por la tecnología y el diseño.*
