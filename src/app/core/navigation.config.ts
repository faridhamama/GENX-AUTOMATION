export interface NavLink {
  label: string;
  path: string;
  /** Use exact route matching for active-link detection (home route only) */
  exact?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Accueil', path: '/', exact: true },
  { label: 'Services', path: '/services' },
  { label: 'Références', path: '/references' },
  { label: 'À Propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
];
