import type { Locale } from '../../content/localization';
import { withBase } from '../lib/paths';
import './brand.css';

export type BrandProps = {
  locale: Locale;
  base: string;
  className?: string;
  priority?: boolean;
};

/** Center icon with selectable, localized HTML lettering. Wrap in a home link. */
export function Brand({ locale, base, className = '', priority = false }: BrandProps) {
  return (
    <span className={`center-brand center-brand--${locale === 'en' ? 'en' : 'zh'} ${className}`.trim()} lang={locale}>
      <img
        className="center-brand__icon"
        src={withBase('assets/center-icon.png', base)}
        width={512}
        height={512}
        alt=""
        aria-hidden="true"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
      {locale === 'en' ? (
        <span className="center-brand__copy">
          <span className="center-brand__university">National Taiwan University</span>
          <span className="center-brand__english-primary">
            <span>Unmanned Vehicles</span>{' '}
            <span>Research and Development</span>{' '}
            <span>Center, NTU</span>
          </span>
        </span>
      ) : (
        <span className="center-brand__copy">
          <span className="center-brand__university">國立臺灣大學</span>
          <span className="center-brand__chinese">無人載具研發設計中心</span>
          <span className="center-brand__english" lang="en">
            <span>Unmanned Vehicles Research</span>{' '}
            <span>and Development Center, NTU</span>
          </span>
        </span>
      )}
    </span>
  );
}
