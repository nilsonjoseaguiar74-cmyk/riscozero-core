import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./database/database.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { PermissionsGuard } from "./common/guards/permissions.guard";
import { HealthModule } from "./modules/health/health.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { ActivitiesModule } from "./modules/activities/activities.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AssociationModule } from "./modules/association/association.module";
import { TrafficModule } from "./modules/traffic/traffic.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { SiteContentModule } from "./modules/site-content/site-content.module";
import { StorageModule } from "./modules/storage/storage.module";
import { SettingsModule } from "./modules/settings/settings.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DatabaseModule,
    AuditModule,
    AuthModule,
    HealthModule,
    UsersModule,
    LeadsModule,
    ActivitiesModule,
    TasksModule,
    AnalyticsModule,
    AssociationModule,
    TrafficModule,
    IntegrationsModule,
    StorageModule,
    SiteContentModule,
    SettingsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
