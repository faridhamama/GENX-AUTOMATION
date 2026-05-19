import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_LINKS, NavLink } from '../../core/navigation.config';
import { CompanyFacade } from '../../core/company.facade';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly company = inject(CompanyFacade);

  readonly navLinks: NavLink[] = NAV_LINKS;

  readonly companyData = computed(() => {
    const info = this.company.companyInfo();
    if (!info) return null;
    return {
      name: info.company_name,
      tagline: info.tagline,
      domain: info.domain ?? 'genxautomation.com',
      email: info.contact_email,
      phone: info.contact_phone,
      address: this.parseAddress(info.contact_address),
      hours: this.parseHours(info.availability_days, info.availability_hours),
      founded: info.founded ?? 2025,
    };
  });

  private parseAddress(address: string): { city: string; country: string; zone: string } {
    if (!address) return { city: 'Casablanca', country: 'Maroc', zone: '' };
    const parts = address.split(',').map(p => p.trim());
    return {
      city: parts[0] ?? 'Casablanca',
      country: parts[1] ?? 'Maroc',
      zone: parts.slice(2).join(', '),
    };
  }

  private parseHours(days: string, hours: string): { label: string; time: string }[] {
    const result: { label: string; time: string }[] = [];
    if (days && hours) {
      result.push({ label: days, time: hours });
    }
    result.push({ label: 'Samedi', time: '09:00 - 12:30' });
    return result;
  }
}