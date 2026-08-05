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
      "Cobertura mutualista para eventos como colisão, incêndio, furto e roubo, conforme a opção contratada e o regulamento da associação.",
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
      "Apoio para perda de chaves, travamento e reparo ou substituição de vidros, faróis, lanternas e retrovisores.",
  },
  {
    icon: Car,
    title: "Carro reserva",
    description:
      "Disponibilização de veículo reserva por período determinado para manter a rotina do participante em movimento.",
  },
  {
    icon: Fuel,
    title: "Pane seca e bateria",
    description:
      "Auxílio para falta de combustível, troca de pneus e recarga ou substituição de bateria em deslocamentos.",
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
      "Rede de oficinas e prestadores homologados na Grande Florianópolis para atendimento com padrão de qualidade.",
  },
  {
    icon: LifeBuoy,
    title: "Atendimento humano",
    description:
      "Equipe local disponível pelo WhatsApp para acompanhar o participante do primeiro contato ao encerramento da ocorrência.",
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
      "Presença consolidada em São José, Florianópolis, Palhoça, Biguaçu e demais localidades da Grande Florianópolis.",
  },
  {
    icon: Clock,
    title: "Resposta rápida",
    description:
      "Retorno das solicitações em horário comercial, com registro de cada atendimento na plataforma da associação.",
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
    question: "A Risco Zero é uma seguradora?",
    answer:
      "Não. A Risco Zero atua no modelo associativo de proteção patrimonial mutualista. Os participantes contribuem para um fundo comum utilizado no atendimento das ocorrências previstas em regulamento, o que é diferente de um contrato de seguro.",
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
      "Nome, WhatsApp, placa, cidade, tipo e ano aproximado do veículo. Esses dados são utilizados exclusivamente para apresentar as opções de proteção e assistência.",
  },
];
