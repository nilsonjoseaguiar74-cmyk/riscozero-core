import {
  BadgeCheck,
  Car,
  Clock,
  FileCheck2,
  Fuel,
  Handshake,
  KeyRound,
  LifeBuoy,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ContentItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const BENEFITS: ContentItem[] = [
  {
    icon: ShieldCheck,
    title: "Proteção patrimonial",
    description:
      "Proteção para eventos como colisão, incêndio, furto e roubo quando prevista na opção apresentada e no regulamento aplicável.",
  },
  {
    icon: Truck,
    title: "Assistência 24 horas",
    description:
      "Guincho, reboque e apoio em caso de pane mecânica ou elétrica dentro dos limites previstos na opção escolhida.",
  },
  {
    icon: KeyRound,
    title: "Chaveiro e vidros",
    description:
      "Possibilidade de apoio para chaves e vidros, conforme disponibilidade, limites e condições aplicáveis.",
  },
  {
    icon: Car,
    title: "Carro reserva",
    description:
      "Possibilidade de veículo reserva pelo período e nas situações previstos na opção e no regulamento aplicável.",
  },
  {
    icon: Fuel,
    title: "Pane seca e bateria",
    description:
      "Auxílio sujeito às hipóteses, aos limites e às condições da opção apresentada e do regulamento aplicável.",
  },
  {
    icon: Users,
    title: "Proteção a terceiros",
    description:
      "Participação em danos causados a terceiros de acordo com os limites e condições da opção contratada.",
  },
  {
    icon: Wrench,
    title: "Rede de reparo",
    description:
      "Atendimento por oficinas e prestadores conforme rede efetivamente disponível e condições aplicáveis.",
  },
  {
    icon: LifeBuoy,
    title: "Atendimento humano",
    description:
      "Canal de atendimento pelo WhatsApp sujeito aos horários, à disponibilidade e às condições operacionais informadas.",
  },
];

export const STEPS: ContentItem[] = [
  {
    icon: MessageSquare,
    title: "1. Solicitação",
    description:
      "Você envia seus dados pelo site ou pelo WhatsApp informando veículo, cidade e melhor horário para conversar.",
  },
  {
    icon: BadgeCheck,
    title: "2. Análise de perfil",
    description:
      "A equipe verifica o perfil do veículo, a região de circulação e as opções de proteção compatíveis.",
  },
  {
    icon: FileCheck2,
    title: "3. Apresentação de opções",
    description:
      "Você recebe as opções disponíveis com valores de participação, benefícios inclusos e condições aplicáveis.",
  },
  {
    icon: Handshake,
    title: "4. Adesão",
    description:
      "Com a opção escolhida, é feita a documentação, a vistoria quando aplicável e a formalização da adesão.",
  },
  {
    icon: LifeBuoy,
    title: "5. Acompanhamento",
    description:
      "Após a adesão, o participante conta com assistência, benefícios e atendimento contínuo da equipe local.",
  },
];

export const DIFFERENTIALS: ContentItem[] = [
  {
    icon: MapPinned,
    title: "Atuação regional",
    description:
      "Atendimento concentrado em São José, Florianópolis, Palhoça e Biguaçu, sujeito à confirmação da área atendida.",
  },
  {
    icon: Clock,
    title: "Resposta rápida",
    description:
      "Proposta de retorno em horário comercial, com base preparada para registrar o histórico de atendimento.",
  },
  {
    icon: Users,
    title: "Modelo associativo",
    description:
      "Estrutura mutualista: participantes contribuem para um fundo comum destinado ao atendimento das ocorrências.",
  },
];

export const FAQS = [
  {
    question: "Proteção veicular é igual a seguro tradicional?",
    answer:
      "Não. São operações com estruturas, contratos e regras diferentes. A proteção patrimonial mutualista possui funcionamento baseado nas regras do grupo, no regulamento e no rateio das despesas entre os participantes. Desde a Lei Complementar nº 213/2025, essas operações passaram a integrar um processo específico de regulamentação e supervisão da Susep. Antes da adesão, a Risco Zero deve apresentar claramente as condições, os benefícios, os limites, as obrigações do participante e o regulamento aplicável.",
  },
  {
    question: "Quais veículos podem participar?",
    answer:
      "Carros, motos, caminhonetes, utilitários e caminhões podem ser avaliados. A aceitação depende da análise de perfil do veículo, ano, uso e região de circulação.",
  },
  {
    question: "Quais regiões são atendidas?",
    answer:
      "O atendimento é concentrado na Grande Florianópolis, incluindo São José, Florianópolis, Palhoça e Biguaçu, com apoio nos principais corredores como BR-101 e Via Expressa.",
  },
  {
    question: "Como funciona a assistência 24 horas?",
    answer:
      "Após a adesão, o participante aciona a equipe pelos canais oficiais. O acionamento é registrado e encaminhado à rede de prestadores conforme os limites da opção contratada.",
  },
  {
    question: "Existe vistoria do veículo?",
    answer:
      "Sim, quando aplicável. A vistoria confirma as condições do veículo no momento da adesão e faz parte do processo de documentação.",
  },
  {
    question: "Qual é o prazo para começar a utilizar os benefícios?",
    answer:
      "Os prazos de carência e a liberação dos benefícios seguem o regulamento aplicável e são informados de forma clara durante a apresentação das opções.",
  },
  {
    question: "Como funciona o cancelamento?",
    answer:
      "O participante pode solicitar o desligamento pelos canais oficiais, observando as condições, prazos e obrigações previstas no regulamento da associação.",
  },
  {
    question: "Quais dados são solicitados no primeiro contato?",
    answer:
      "Nome, WhatsApp, placa, cidade, tipo e ano aproximado do veículo. Esses dados são utilizados para responder à solicitação, analisar o perfil informado, apresentar opções e, quando configurado e autorizado, medir a origem do contato.",
  },
];
