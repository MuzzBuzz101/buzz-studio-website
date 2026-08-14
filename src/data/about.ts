/**
 * Public About section content for Syed Muzammil Shah Kazmi / Buzz Studio.
 *
 * Photos (in public/images/about/):
 * - muzammil-camera.jpg — dominant cinematic visual (behind the lens)
 *
 * CVs (in public/docs/):
 * - Muzammil_CV.pdf — primary download (Version B Teal)
 * - Muzammil_Cinematography_CV.pdf — secondary, cinematography-focused
 */

export const aboutContent = {
  id: "about",
  eyebrow: "About",
  name: "Syed Muzammil Shah Kazmi",
  brand: "Buzz Studio",
  location: "Lefke, Cyprus",
  headline: "Creative producer behind the lens — and the pipeline.",
  lead:
    "I am a Creative Producer working across cinematography, commercial photography, editing, and color — with the same eye for craft that I bring as a Software Engineer and Graphic Designer.",
  body: [
    "For 5+ years I have run end-to-end production for food & beverage, real estate, fashion, music, and cinematic clients: from first brief and shoot day through edit, grade, and delivery.",
    "Buzz Studio is the home for that work — cinematic imagery, precise post, and a production desk that treats every frame like it matters.",
  ],
  roles: [
    "Creative Producer",
    "Cinematography & Photography",
    "Editing & Color",
    "Software Engineer",
    "Graphic Designer",
  ],
  photos: {
    camera: {
      src: "/images/about/muzammil-camera.jpg",
      alt: "Syed Muzammil Shah Kazmi with camera — Buzz Studio",
    },
  },
  cv: {
    primary: {
      label: "Download CV",
      href: "/docs/Muzammil_CV.pdf",
      filename: "Muzammil_CV.pdf",
    },
    secondary: {
      label: "Cinematography CV",
      href: "/docs/Muzammil_Cinematography_CV.pdf",
      filename: "Muzammil_Cinematography_CV.pdf",
    },
  },
  ctas: {
    project: { label: "Start a Project", href: "/#contact" },
    contact: { label: "Contact", href: "/#contact" },
  },
} as const;
