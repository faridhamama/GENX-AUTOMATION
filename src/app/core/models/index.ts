// Barrel export for all models
export type {
  QuoteRequest,
  QuoteRequestRow,
} from './quote-request.models';

export type { CompanyInfo, Service, CompanyValue } from './company.models';

// homepage.models exports both Row types and domain aliases
export type {
  HomepageHeroStatsRow,
  HomepageExpertiseCardRow,
  HomepageImageRow,
  HomepageHeroContentRow,
} from './homepage.models';
export type {
  HomepageHeroStats,
  HomepageExpertiseCard,
  HomepageImage,
} from './homepage.models';

export type {
  ReferencesHeroRow,
  ReferencesFeaturedProjectRow,
  ReferencesPerformanceStatRow,
  ReferencesSideProjectRow,
  ReferencesQualityPointRow,
  ReferencesImageRow,
} from './references.models';

export type {
  ServicesPageHeroRow,
  ServicesMethodologyRow,
  MethodologyStepRow,
  ServicesImageRow,
} from './services-page.models';

export type {
  AboutHeroRow,
  AboutAvailabilityRow,
  AboutMissionRow,
  AboutCompanyRow,
  AboutServicesSectionRow,
  AboutValuesSectionRow,
  AboutCtaSectionRow,
  AboutImageRow,
} from './about.models';

export type {
  ContactPageHeroRow,
  ContactStatRow,
  ProjectTypeRow,
  ContactFormContentRow,
  FormLabelsRow,
} from './contact.models';