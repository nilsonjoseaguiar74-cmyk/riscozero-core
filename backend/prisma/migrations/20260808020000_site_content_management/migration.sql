CREATE TABLE "site_sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "site_sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_media" (
    "id" UUID NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT,
    "alt" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT 'secondary',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "site_media_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_testimonials" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'Google',
    "rating" INTEGER NOT NULL,
    "avatar_url" TEXT,
    "avatar_storage_key" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "site_testimonials_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "site_media_storage_key_key" ON "site_media"("storage_key");
CREATE INDEX "site_media_section_active_order_idx" ON "site_media"("section", "active", "order");
CREATE UNIQUE INDEX "site_testimonials_avatar_storage_key_key" ON "site_testimonials"("avatar_storage_key");
CREATE INDEX "site_testimonials_active_order_idx" ON "site_testimonials"("active", "order");

INSERT INTO "site_sections" ("id", "title", "description", "address", "updated_at") VALUES
('unit', 'Estrutura física para atender você de perto', 'Nossa unidade em Campinas, São José, reúne atendimento local e estrutura para orientar associados com proximidade e clareza.', 'Av. Josué di Bernardi, 239 – Campinas, São José – SC, 88101-260', CURRENT_TIMESTAMP);

INSERT INTO "site_testimonials" ("id", "name", "quote", "source", "rating", "order", "active", "updated_at") VALUES
('10000000-0000-4000-8000-000000000001', 'Lara Mendes', 'Trabalho impecável e de valor inestimável. Sempre que precisei de qualquer assistência, fui atendida com extrema agilidade, competência e profissionalismo. Estou muito satisfeita e recomendo com total confiança.', 'Google', 5, 1, true, CURRENT_TIMESTAMP),
('10000000-0000-4000-8000-000000000002', 'Leandresson Ladislau', 'Atendimento nota mil! Já precisei acionar e fui atendido muito rápido.', 'Google', 5, 2, true, CURRENT_TIMESTAMP),
('10000000-0000-4000-8000-000000000003', 'Fabio Nascimento', 'Super indico total assistência todo momento precisei de guincho veio super rápido.', 'Google', 5, 3, true, CURRENT_TIMESTAMP),
('10000000-0000-4000-8000-000000000004', 'A. S.', 'Empresa séria, transparente e comprometida com o cliente!', 'Google', 5, 4, true, CURRENT_TIMESTAMP),
('10000000-0000-4000-8000-000000000005', 'Marcio Souza', 'Empresa seria, ótimo atendimento e rapidez nos serviços, recomendo.', 'Google', 5, 5, true, CURRENT_TIMESTAMP);
