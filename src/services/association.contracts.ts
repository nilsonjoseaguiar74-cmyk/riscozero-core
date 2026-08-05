/** Contratos de serviços da Gestão da Associação. */
import type {
  AssociationDashboard,
  AssociationDashboardFilters,
  AssociationDocument,
  Assistance,
  AssistanceFilters,
  Benefit,
  Billing,
  BillingFilters,
  Apportionment,
  Consultant,
  ConsultantFilters,
  DelinquencyRow,
  DocumentFilters,
  FinanceSummary,
  Inspection,
  InspectionFilters,
  Member,
  MemberFilters,
  Membership,
  MembershipFilters,
  MembershipStage,
  MemberTimelineEntry,
  Occurrence,
  OccurrenceFilters,
  OccurrenceStatus,
  OccurrenceTimelineEntry,
  PaginatedResult,
  Provider,
  ProviderFilters,
  Vehicle,
  VehicleFilters,
} from "@/types/association";

export interface AssociationDashboardService {
  overview(filters: AssociationDashboardFilters): Promise<AssociationDashboard>;
}

export interface MembersService {
  list(filters: MemberFilters): Promise<PaginatedResult<Member>>;
  getById(id: string): Promise<Member>;
  addNote(id: string, note: string, author?: string): Promise<MemberTimelineEntry>;
  registerService(id: string, description: string): Promise<MemberTimelineEntry>;
  requestDocument(id: string, documento: string): Promise<Member>;
  syncMember(id: string): Promise<Member>;
  checkDivergences(id: string): Promise<Vehicle[]>;
  exportCsv(filters: MemberFilters): Promise<string>;
  revealCpf(id: string): Promise<string>;
}

export interface VehiclesService {
  list(filters: VehicleFilters): Promise<PaginatedResult<Vehicle>>;
  getById(id: string): Promise<Vehicle>;
  syncVehicle(id: string): Promise<Vehicle>;
  checkDivergences(id: string): Promise<Vehicle>;
  exportCsv(filters: VehicleFilters): Promise<string>;
}

export interface MembershipsService {
  list(filters: MembershipFilters): Promise<PaginatedResult<Membership>>;
  getById(id: string): Promise<Membership>;
  advanceStage(id: string, stage: MembershipStage, note?: string): Promise<Membership>;
  requestDocument(id: string, documento: string): Promise<Membership>;
  sendToErp(id: string): Promise<Membership>;
  reprocessIntegration(id: string): Promise<Membership>;
  cancel(id: string, motivo: string): Promise<Membership>;
}

export interface OccurrencesService {
  list(filters: OccurrenceFilters): Promise<PaginatedResult<Occurrence>>;
  getById(id: string): Promise<Occurrence>;
  addTimelineEntry(id: string, titulo: string, descricao?: string): Promise<OccurrenceTimelineEntry>;
  updateStatus(id: string, status: OccurrenceStatus): Promise<Occurrence>;
}

export interface AssistanceService {
  list(filters: AssistanceFilters): Promise<PaginatedResult<Assistance>>;
  getById(id: string): Promise<Assistance>;
  updateStatus(id: string, status: Assistance["status"]): Promise<Assistance>;
  assignProvider(id: string, providerId: string): Promise<Assistance>;
}

export interface InspectionsService {
  list(filters: InspectionFilters): Promise<PaginatedResult<Inspection>>;
  getById(id: string): Promise<Inspection>;
  schedule(id: string, date: string): Promise<Inspection>;
  updateStatus(id: string, status: Inspection["status"]): Promise<Inspection>;
}

export interface FinanceService {
  summary(filters: { from?: string | undefined; to?: string | undefined }): Promise<FinanceSummary>;
  delinquency(filters: { city?: string | undefined; search?: string | undefined }): Promise<
    DelinquencyRow[]
  >;
  apportionments(): Promise<Apportionment[]>;
}

export interface BillingService {
  list(filters: BillingFilters): Promise<PaginatedResult<Billing>>;
  getById(id: string): Promise<Billing>;
  markAsPaid(id: string): Promise<Billing>;
  cancel(id: string): Promise<Billing>;
}

export interface BenefitsService {
  list(): Promise<Benefit[]>;
  getById(id: string): Promise<Benefit>;
  toggle(id: string, ativo: boolean): Promise<Benefit>;
}

export interface ConsultantsService {
  list(filters: ConsultantFilters): Promise<Consultant[]>;
  getById(id: string): Promise<Consultant>;
}

export interface ProvidersService {
  list(filters: ProviderFilters): Promise<PaginatedResult<Provider>>;
  getById(id: string): Promise<Provider>;
  toggle(id: string, ativo: boolean): Promise<Provider>;
}

export interface DocumentsService {
  list(filters: DocumentFilters): Promise<PaginatedResult<AssociationDocument>>;
  getById(id: string): Promise<AssociationDocument>;
  approve(id: string): Promise<AssociationDocument>;
  reject(id: string, motivo: string): Promise<AssociationDocument>;
  requestRenewal(id: string): Promise<AssociationDocument>;
}

export interface AssociationServiceRegistry {
  associationDashboard: AssociationDashboardService;
  members: MembersService;
  vehicles: VehiclesService;
  memberships: MembershipsService;
  occurrences: OccurrencesService;
  assistance: AssistanceService;
  inspections: InspectionsService;
  finance: FinanceService;
  billing: BillingService;
  benefits: BenefitsService;
  consultants: ConsultantsService;
  providers: ProvidersService;
  documents: DocumentsService;
}
