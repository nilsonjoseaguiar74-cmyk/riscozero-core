import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();
const ASSOCIATION_ID = "00000000-0000-4000-8000-000000000001";
const MANAGER_ID = "00000000-0000-4000-8000-000000000102";

const required = (name: string, minimum = 1): string => {
  const value = process.env[name]?.trim();
  if (!value || value.length < minimum) {
    throw new Error(`${name} deve ser definida com pelo menos ${minimum} caracteres.`);
  }
  return value;
};

async function main() {
  if (process.env.NODE_ENV !== "production") {
    throw new Error("A inicialização de produção exige NODE_ENV=production.");
  }

  const email = required("INITIAL_MANAGER_EMAIL", 5).toLowerCase();
  const password = required("INITIAL_MANAGER_PASSWORD", 12);
  const name = required("INITIAL_MANAGER_NAME", 2);

  await prisma.$transaction(async (tx) => {
    await tx.association.upsert({
      where: { id: ASSOCIATION_ID },
      update: { name: "Risco Zero Proteção Veicular" },
      create: { id: ASSOCIATION_ID, name: "Risco Zero Proteção Veicular" },
    });

    await tx.user.upsert({
      where: { id: MANAGER_ID },
      update: {
        name,
        email,
        role: "gestor",
        status: "ativo",
        passwordHash: await argon2.hash(password),
      },
      create: {
        id: MANAGER_ID,
        associationId: ASSOCIATION_ID,
        name,
        email,
        role: "gestor",
        status: "ativo",
        passwordHash: await argon2.hash(password),
      },
    });

    await tx.siteSection.upsert({
      where: { id: "unit" },
      update: {},
      create: {
        id: "unit",
        title: "Estrutura física para atender você de perto",
        description:
          "Nossa unidade em Campinas, São José, oferece atendimento local e orientação aos associados.",
        address: "Av. Josué di Bernardi, 239 – Campinas, São José – SC, 88101-260",
      },
    });
  });

  console.log(`Gestor inicial configurado: ${email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
