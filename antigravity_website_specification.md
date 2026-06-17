# 🌐 Website Implementation Specification
**Project:** Premium Export Business Website Redesign  
**Development Agency:** Antigravity  

---

## 1. Project Architecture & Tech Stack

This website requires a modern, highly interactive, and performant stack to handle complex scroll-driven animations without dropping frames.

* **Framework:** Next.js (App Router recommended)
* **Styling:** Tailwind CSS (for layout and utility classes)
* **Animation Engine:** Framer Motion (Crucial for scroll-jacked and scroll-driven animations)
* **Typography:** `next/font/google` for optimized loading
* **Icons:** Lucide React or Heroicons
* **Additional Libraries:** `react-countup` (for stats), `react-fast-marquee` (for scrolling trust strips)

---

## 2. Design System

The visual identity relies on a high-contrast, premium "Light & Gold" aesthetic with a dark finish.

### 🎨 Color Palette
* **Background (Primary):** `#FAFAF7` *(Warm off-white, used for the main body)*
* **Surface (Cards/Containers):** `#FFFFFF` *(Pure white, used to lift elements off the background)*
* **Primary Accent (Gold):** `#C9A84C` *(Used for badges, highlights, hover effects, and borders)*
* **Primary Text:** `#111111` *(Near-black for sharp readability)*
* **Subtle Borders:** `#EEEBE4` *(Warm grey for card outlines and dividers)*
* **Dark Contrast Section (Footer/CTA):** Background `#111111`, Text `#FFFFFF`

### 🔤 Typography
* **Headings (H1 - H4):** `Playfair Display` or `Cormorant Garamond` (Serif, Bold)
    * *Usage:* "Featured Export Products", "About Us", Hero Title.
* **Body Text:** A clean Sans-Serif (e.g., `Inter` or `Manrope`)
    * *Usage:* Paragraphs, card descriptions, navigation links.

---

## 3. Global Interactive Elements

### 📜 Scroll-Driven UI Components
1.  **Reading Progress Bar:** A fixed 2px `#C9A84C` bar at the top of the viewport that scales from `scaleX(0)` to `scaleX(1)` tied to the page's scroll progress (use Framer Motion's `useScroll`).
2.  **Section Navigation Dots:** A fixed vertical column of dots on the right side of the screen. Active dot highlights in Gold based on `IntersectionObserver` or Framer Motion's `useInView`. Clicking a dot triggers `scrollIntoView`.
3.  **Scrolling Trust Ticker:** Infinite horizontal marquee displaying certification logos (FSSAI, APEDA, ISO, etc.). Never stops moving.

---

## 4. Section-by-Section Specifications

### A. Navigation Bar (Header)
* **Layout:** Left-aligned Logo (Globe + Ship SVG placeholder -> Swap for client PNG later), Right-aligned navigation links.
* **Behavior:** Sticky top (`position: sticky` or `fixed`).
* **Styling:** Glassmorphism effect on scroll (`backdrop-blur-md` with slight white tint). Gold thin divider line at the bottom.

### B. Hero Section
* **Background:** `#FAFAF7` with subtle, concentric gold circle rings (`#C9A84C` with low opacity, e.g., 5-10%) to add depth.
* **Parallax Text:** Large watermark-style text reading "EXPORTS" in the background. Moves at a slower rate than standard scroll (use `useTransform` mapped to `scrollY`).
* **Entrance:** Hero text fades up sequentially on mount.
* **Live Badge:** "Live" or "New" badge featuring a CSS-animated pulsing green or gold dot (`@keyframes pulse`).

### C. Stats & Trust Section
* **Trigger:** Animations fire *only* when the section enters the viewport.
* **Divider:** A central gold line expands outward (`scaleX` from center) when the section appears.
* **Counters:** Numbers count up from 0 to target (e.g., "50+", "10M", "24h") using `react-countup`. Text color is `#111111`, suffixes (+, M, h) are `#C9A84C`.

### D. Product Categories
* **Layout:** Grid of `#FFFFFF` cards resting on the `#FAFAF7` background. Subtle `#EEEBE4` borders.
* **Entrance Animation:** Staggered fade-up (`translateY` from 50px to 0px) as the user scrolls into the section.
* **Hover Interaction:** Custom Gold underline swipe animation on the text, and a slight Y-axis lift (`translateY(-4px)`).

### E. Featured Products
* **Entrance Animation:** Slide in from the right (`translateX(100px)` to `0`) with a cascading delay (Card 1, then Card 2, etc.).
* **Card UI:** * "NEW" tag in Gold background.
    * Origin tag (e.g., "Sourced from India").
* **Hover Interaction:** Container border transitions from `#EEEBE4` to `#C9A84C`.

### F. Why Choose Us (Value Props)
* **Entrance Animation:** Scale up from 90% (`scale(0.9)` to `scale(1)`) as they enter the view.
* **Card UI:** Icons are wrapped in a box with a solid `#C9A84C` border.

### G. Dark CTA & Footer (The "Strong Finish")
* **Design Shift:** Abrupt but premium shift to Dark Mode. Background becomes `#111111`.
* **CTA Strip:** Three main action buttons (e.g., "Request Quote", "Download Catalog", "Contact Sales").
* **Footer Layout:** 3-column layout. Deep dark background, gold tagline. Category links in muted grey, turning white on hover.

---

## 5. Development Notes for Antigravity

* **Framer Motion specific hooks:**
    * Use `<motion.div whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>` to ensure animations trigger at the right scroll depth and don't re-trigger annoyingly on scroll up (unless specifically desired).
    * For the Progress Bar:
        ```javascript
        const { scrollYProgress } = useScroll();
        <motion.div style={{ scaleX: scrollYProgress }} className="fixed top-0 left-0 h-1 w-full bg-[#C9A84C] origin-left z-50" />
        ```
* **Responsiveness:** Ensure that scroll-driven staggered delays are reduced or removed on mobile devices (`< 768px`) to prevent content from loading too slowly while swiping.
* **Asset Swaps:** Ensure image placeholders and the Navbar logo are set up as standard `<img>` or `next/image` tags so the client can easily drop in their transparent PNGs later.
