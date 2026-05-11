import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyInfoService } from '../../core/company-info.service';
import { IMAGES } from '../../core/images.config';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly companyInfoService = inject(CompanyInfoService);

  readonly heroStats = computed<{label: string; value: string; sub: string; accentClass: string}[]>(() => {
    const stats = this.companyInfoService.homepageHeroStats();
    if (!stats) return [];
    return [
      { label: stats.stat1_label, value: stats.stat1_value, sub: stats.stat1_sub, accentClass: stats.stat1_accent_class },
      { label: stats.stat2_label, value: stats.stat2_value, sub: stats.stat2_sub, accentClass: stats.stat2_accent_class },
    ];
  });

  readonly expertiseCards = computed<{id: string; icon: string; title: string; description: string; tags: string[]}[]>(() =>
    this.companyInfoService.homepageExpertiseCards(),
  );

  readonly images = computed(() => {
    const imgs = this.companyInfoService.homepageImages();
    const findImg = (key: string) => imgs.find(i => i.image_key === key);
    return {
      heroBg: findImg('heroBg')?.url || IMAGES.home.heroBg,
      circuitBoard: findImg('circuitBoard')?.url || IMAGES.home.circuitBoard,
      industrialLine: findImg('industrialLine')?.url || IMAGES.home.industrialLine,
      iotRouter: findImg('iotRouter')?.url || IMAGES.home.iotRouter,
    };
  });

  ngOnInit(): void {
    this.companyInfoService.fetchHomepageContent();
  }
}