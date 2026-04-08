import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_LINKS, NavLink } from '../../core/navigation.config';
import { COMPANY, CompanyConfig } from '../../core/company.config';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly company: CompanyConfig = COMPANY;
  readonly navLinks: NavLink[] = NAV_LINKS;
}
