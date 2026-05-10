-- company_info: single-row key-value store
create table if not exists company_info (
  id bigint primary key default 1 check (id = 1),
  company_name text not null default 'GENX AUTOMATION',
  tagline text not null default 'Solutions complètes d''automatisme industriel, de génie électrique et de supervision au Maroc.',
  label text not null default 'Automation & Industrial Engineering',
  availability_hours text not null default '08:00 - 18:00',
  availability_days text not null default 'Lundi - Vendredi',
  contact_email text not null default '',
  contact_phone text not null default '',
  contact_address text not null default '',
  mission_quote text not null default 'Offrir aux industriels marocains des solutions d''automatisation complètes, fiables et adaptées à leurs besoins réels — de la conception à la mise en service.',
  updated_at timestamptz default now()
);

-- Insert default row if not exists
insert into company_info (id) values (1) on conflict (id) do nothing;

-- services: ordered list
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null unique,
  label text not null,
  description text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default services
insert into services (sort_order, label, description) values
  (1, 'Assistance technique & formation', 'Conseil, audits, études de faisabilité, formation du personnel technique, AMO dans l''automatisme et l''électricité industrielle'),
  (2, 'Automatisme industriel', 'Programmation et mise en service d''automates (PLC) — toute marque et technologie'),
  (3, 'Génie électrique (BT/MT)', 'Études, fourniture, installation et mise en service — tableaux électriques, armoires de puissance et de commande, postes de transformation'),
  (4, 'Instrumentation industrielle', 'Fourniture, installation, étalonnage et maintenance d''instruments de mesure, capteurs, transmetteurs, analyseurs et régulateurs'),
  (5, 'Intégration de systèmes', 'Architectures complètes, intégration de sous-systèmes, communication industrielle (Modbus, Profibus, Profinet, OPC-UA), liaison MES/ERP'),
  (6, 'Supervision (SCADA/IHM)', 'Conception, intégration et exploitation de systèmes de supervision (SCADA), interfaces homme-machine (IHM/HMI) et Topkapi, Vijeo Designer, WinCC, Ignition'),
  (7, 'Commercialisation & distribution', 'Importation et distribution de matériels, équipements, composants et logiciels relatifs à l''automatisme industriel et l''instrumentation')
on conflict (sort_order) do nothing;

-- company_values: exactly 3 rows
create table if not exists company_values (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null unique check (sort_order between 1 and 3),
  icon text not null default 'engineering',
  title text not null,
  description text not null,
  updated_at timestamptz default now()
);

-- Insert default values
insert into company_values (id, sort_order, icon, title, description) values
  (gen_random_uuid(), 1, 'engineering', 'Rigueur industrielle', 'Une discipline forgée par des années d''expérience terrain sur des sites où la précision est une nécessité absolue'),
  (gen_random_uuid(), 2, 'handshake', 'Transparence totale', 'Offrir ce dont le client a vraiment besoin — sans surdimensionnement ni promesses impossibles à tenir'),
  (gen_random_uuid(), 3, 'workspace_premium', 'Savoir-faire concret', 'Du code, des schémas, des tests en situation réelle. Nous livrons ce que nous promettons')
on conflict (sort_order) do nothing;