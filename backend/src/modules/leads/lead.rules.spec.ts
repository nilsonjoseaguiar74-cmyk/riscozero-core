import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateLeadDto } from "./leads.dto";
import { duplicateWindowStart, normalizePhone, normalizePlate } from "./lead.rules";

describe("regras de captação de lead", () => {
  it("normaliza telefone e placa antes da deduplicação", () => {
    expect(normalizePhone("(48) 99123-4567")).toBe("48991234567");
    expect(normalizePlate("abc-1d23")).toBe("ABC1D23");
  });

  it("calcula uma janela determinística para o fallback idempotente", () => {
    expect(duplicateWindowStart(new Date("2026-08-05T12:00:00.000Z"))).toEqual(
      new Date("2026-08-05T11:50:00.000Z"),
    );
  });

  it("rejeita consentimento ausente e honeypot preenchido", async () => {
    const dto = plainToInstance(CreateLeadDto, {
      name: "Pessoa Demonstração", whatsapp: "(48) 99123-4567", plate: "ABC1D23",
      city: "São José", consent: false, website: "robô",
    });
    const errors = await validate(dto);
    expect(errors.map((error) => error.property)).toEqual(expect.arrayContaining(["consent", "website"]));
  });
});
