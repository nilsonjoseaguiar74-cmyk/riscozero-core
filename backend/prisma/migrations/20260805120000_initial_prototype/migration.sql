-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('administrador', 'gestor', 'comercial', 'gestor_trafego', 'desenvolvedor');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ativo', 'inativo', 'convidado');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('novo_contato', 'contato_iniciado', 'perfil_identificado', 'opcoes_apresentadas', 'proposta_adesao', 'documentacao_pendente', 'adesao_concluida', 'nao_convertido');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('baixa', 'media', 'alta');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pendente', 'concluida', 'atrasada');

-- CreateTable
CREATE TABLE "associations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ativo',
    "last_access_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_sessions" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "refresh_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "vehicle_type" TEXT,
    "vehicle_year" TEXT,
    "best_time" TEXT,
    "contact_preference" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'novo_contato',
    "priority" "Priority" NOT NULL DEFAULT 'media',
    "owner_id" UUID,
    "source" TEXT NOT NULL DEFAULT 'Direto',
    "campaign" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "loss_reason" TEXT,
    "notes" TEXT,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "stage_changed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_consents" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "version" TEXT NOT NULL,
    "granted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lead_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_tracking" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "referrer" TEXT,
    "landing_page" TEXT,
    "gclid" TEXT,
    "gbraid" TEXT,
    "wbraid" TEXT,
    "fbclid" TEXT,
    "device_type" TEXT,
    "browser" TEXT,
    "operating_system" TEXT,
    "first_visit_at" TIMESTAMPTZ,
    "conversion_page" TEXT,
    "conversion_cta" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lead_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "author_id" UUID,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_tasks" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "due_at" TIMESTAMPTZ NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'pendente',
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "lead_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_stage_history" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "from_stage" "LeadStage",
    "to_stage" "LeadStage" NOT NULL,
    "changed_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lead_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_assignment_history" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "from_user_id" UUID,
    "to_user_id" UUID NOT NULL,
    "changed_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lead_assignment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf_masked" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "joined_at" TIMESTAMPTZ NOT NULL,
    "financial_situation" TEXT NOT NULL,
    "source_system" TEXT NOT NULL DEFAULT 'interno',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inspection_status" TEXT NOT NULL,
    "tracker" BOOLEAN NOT NULL DEFAULT false,
    "protection_option" TEXT NOT NULL,
    "source_system" TEXT NOT NULL DEFAULT 'interno',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "lead_id" UUID,
    "member_id" UUID,
    "candidate_name" TEXT NOT NULL,
    "candidate_whatsapp" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "vehicle_summary" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "activated_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "external_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "demo_data" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traffic_metrics_daily" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "investment" DECIMAL(14,2) NOT NULL,
    "impressions" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "demo_data" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "traffic_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_catalog_items" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requested_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "integration_catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_entries" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "user_id" UUID,
    "user_name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "result" TEXT NOT NULL,
    "masked_ip" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "audit_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_association_id_email_key" ON "users"("association_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_token_hash_key" ON "refresh_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_sessions_user_id_expires_at_idx" ON "refresh_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "leads_association_id_stage_created_at_idx" ON "leads"("association_id", "stage", "created_at");

-- CreateIndex
CREATE INDEX "leads_association_id_owner_id_created_at_idx" ON "leads"("association_id", "owner_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "leads_association_id_idempotency_key_key" ON "leads"("association_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "lead_consents_lead_id_key" ON "lead_consents"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "lead_tracking_lead_id_key" ON "lead_tracking"("lead_id");

-- CreateIndex
CREATE INDEX "lead_tracking_association_id_utm_source_utm_campaign_idx" ON "lead_tracking"("association_id", "utm_source", "utm_campaign");

-- CreateIndex
CREATE INDEX "lead_activities_association_id_lead_id_created_at_idx" ON "lead_activities"("association_id", "lead_id", "created_at");

-- CreateIndex
CREATE INDEX "lead_tasks_association_id_owner_id_status_idx" ON "lead_tasks"("association_id", "owner_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "members_association_id_code_key" ON "members"("association_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_association_id_plate_key" ON "vehicles"("association_id", "plate");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_lead_id_key" ON "memberships"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_association_id_external_key_key" ON "campaigns"("association_id", "external_key");

-- CreateIndex
CREATE UNIQUE INDEX "traffic_metrics_daily_campaign_id_date_key" ON "traffic_metrics_daily"("campaign_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "integration_catalog_items_association_id_provider_key" ON "integration_catalog_items"("association_id", "provider");

-- CreateIndex
CREATE INDEX "audit_entries_association_id_created_at_idx" ON "audit_entries"("association_id", "created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_consents" ADD CONSTRAINT "lead_consents_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_consents" ADD CONSTRAINT "lead_consents_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tracking" ADD CONSTRAINT "lead_tracking_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tracking" ADD CONSTRAINT "lead_tracking_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tasks" ADD CONSTRAINT "lead_tasks_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tasks" ADD CONSTRAINT "lead_tasks_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tasks" ADD CONSTRAINT "lead_tasks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_stage_history" ADD CONSTRAINT "lead_stage_history_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_stage_history" ADD CONSTRAINT "lead_stage_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_assignment_history" ADD CONSTRAINT "lead_assignment_history_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_assignment_history" ADD CONSTRAINT "lead_assignment_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traffic_metrics_daily" ADD CONSTRAINT "traffic_metrics_daily_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traffic_metrics_daily" ADD CONSTRAINT "traffic_metrics_daily_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_catalog_items" ADD CONSTRAINT "integration_catalog_items_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_entries" ADD CONSTRAINT "audit_entries_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "associations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
