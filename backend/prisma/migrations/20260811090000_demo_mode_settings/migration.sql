CREATE TABLE "association_settings" (
    "id" UUID NOT NULL,
    "association_id" UUID NOT NULL,
    "demo_mode_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "association_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "association_settings_association_id_key"
ON "association_settings"("association_id");

ALTER TABLE "association_settings"
ADD CONSTRAINT "association_settings_association_id_fkey"
FOREIGN KEY ("association_id") REFERENCES "associations"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
