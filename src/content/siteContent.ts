import { SITE } from "@/config/site";
import type { SiteTestimonial, UnitSectionContent } from "@/types/site-content";

export const INITIAL_TESTIMONIALS: SiteTestimonial[] = [
  {
    id: "testimonial-lara-mendes",
    name: "Lara Mendes",
    quote:
      "Trabalho impecável e de valor inestimável. Sempre que precisei de qualquer assistência, fui atendida com extrema agilidade, competência e profissionalismo. Estou muito satisfeita e recomendo com total confiança.",
    source: "Google",
    rating: 5,
    order: 1,
    active: true,
  },
  {
    id: "testimonial-leandresson-ladislau",
    name: "Leandresson Ladislau",
    quote: "Atendimento nota mil! Já precisei acionar e fui atendido muito rápido.",
    source: "Google",
    rating: 5,
    order: 2,
    active: true,
  },
  {
    id: "testimonial-fabio-nascimento",
    name: "Fabio Nascimento",
    quote: "Super indico total assistência todo momento precisei de guincho veio super rápido.",
    source: "Google",
    rating: 5,
    order: 3,
    active: true,
  },
  {
    id: "testimonial-a-s",
    name: "A. S.",
    quote: "Empresa séria, transparente e comprometida com o cliente!",
    source: "Google",
    rating: 5,
    order: 4,
    active: true,
  },
  {
    id: "testimonial-marcio-souza",
    name: "Marcio Souza",
    quote: "Empresa seria, ótimo atendimento e rapidez nos serviços, recomendo.",
    source: "Google",
    rating: 5,
    order: 5,
    active: true,
  },
];

export const INITIAL_UNIT_SECTION: UnitSectionContent = {
  title: "Estrutura física para atender você de perto",
  description:
    "Nossa unidade em Campinas, São José, reúne atendimento local e estrutura para orientar associados com proximidade e clareza.",
  address: SITE.address,
  media: [],
};
