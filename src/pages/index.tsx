import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type PackageItem = {
  name: string;
  description: string;
  github: string;
  docs: string;
};

type RelatedPackage = {
  name: string;
  description: string;
  url: string;
  category: string;
};

const RelatedPackages: RelatedPackage[] = [
  // Routing
  {
    name: 'FastRoute',
    description: 'Fast regex-based router by nikic. The foundation many routers are built on.',
    url: 'https://github.com/nikic/FastRoute',
    category: 'Routing',
  },
  {
    name: 'League Route',
    description: 'PSR-7/PSR-15 routing and dispatch built on FastRoute. Full middleware support.',
    url: 'https://route.thephpleague.com/',
    category: 'Routing',
  },
  // Enums
  {
    name: 'myclabs/php-enum',
    description: 'The enum PHP was missing. Type-hintable enums for PHP 7.3+.',
    url: 'https://github.com/myclabs/php-enum',
    category: 'Enums',
  },
  // Templates
  {
    name: 'Plates',
    description: 'Native PHP template system by The PHP League. Twig-inspired without the compilation.',
    url: 'https://platesphp.com/',
    category: 'Templates',
  },
  {
    name: 'Latte',
    description: 'The safest PHP template engine from Nette. Context-aware XSS protection.',
    url: 'https://latte.nette.org/',
    category: 'Templates',
  },
  // Upgrading
  {
    name: 'Rector',
    description: 'Automated refactoring for PHP 5.3+. Upgrade entire codebases in days, not months.',
    url: 'https://getrector.com/',
    category: 'Upgrading',
  },
  {
    name: 'Symfony Polyfill',
    description: 'Backports features from latest PHP versions. Low overhead, loaded on-demand.',
    url: 'https://github.com/symfony/polyfill',
    category: 'Upgrading',
  },
  {
    name: 'PHPCompatibility',
    description: 'PHP_CodeSniffer sniffs to check version compatibility before upgrading.',
    url: 'https://github.com/PHPCompatibility/PHPCompatibility',
    category: 'Upgrading',
  },
];

const PackageList: PackageItem[] = [
  {
    name: 'router',
    description: 'Modern routing for legacy PHP applications. Clean up messy routes today, migrate to frameworks tomorrow.',
    github: 'https://github.com/php-compatible/router',
    docs: '/docs/category/router',
  },
  {
    name: 'enum',
    description: 'PHP 8-style enums for PHP 7.2+ with migration tools',
    github: 'https://github.com/php-compatible/enum',
    docs: '/docs/category/enum',
  },
  {
    name: 'templates',
    description: 'Blazing fast PHP templating with zero dependencies. Native PHP execution at full speed.',
    github: 'https://github.com/php-compatible/templates',
    docs: '/docs/category/templates',
  },
];

function PackagesTable() {
  return (
    <section className={styles.packages}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Packages
        </Heading>
        <table className={styles.packagesTable}>
          <thead>
            <tr>
              <th className={styles.colPackage}>Package</th>
              <th className={styles.colDescription}>Description</th>
              <th className={styles.colLinks}>Links</th>
            </tr>
          </thead>
          <tbody>
            {PackageList.map((pkg, idx) => (
              <tr key={idx}>
                <td className={styles.colPackage}>
                  <code>php-compatible/{pkg.name}</code>
                </td>
                <td className={styles.colDescription}>{pkg.description}</td>
                <td className={styles.colLinks}>
                  <div className={styles.linksCell}>
                    <Link to={pkg.docs} className="button button--sm button--primary">
                      Docs
                    </Link>
                    <Link href={pkg.github} className="button button--sm button--secondary">
                      GitHub
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RelatedPackagesTable() {
  const categories = [...new Set(RelatedPackages.map(pkg => pkg.category))];

  return (
    <section className={styles.packages}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Awesome Related Packages
        </Heading>
        <table className={styles.packagesTable}>
          <thead>
            <tr>
              <th className={styles.colPackage}>Package</th>
              <th className={styles.colDescription}>Description</th>
              <th className={styles.colLinks}>Link</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category}>
                <tr className={styles.categoryRow}>
                  <td colSpan={3} className={styles.categoryCell}>
                    <strong>{category}</strong>
                  </td>
                </tr>
                {RelatedPackages.filter(pkg => pkg.category === category).map((pkg, idx) => (
                  <tr key={`${category}-${idx}`}>
                    <td className={styles.colPackage}>{pkg.name}</td>
                    <td className={styles.colDescription}>{pkg.description}</td>
                    <td className={styles.colLinks}>
                      <Link href={pkg.url} className="button button--sm button--secondary">
                        Visit
                      </Link>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Mission
        </Heading>
        <p className="hero__subtitle">
          "Make upgrading old PHP projects easy and simple."
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="PHP Compatible - Modern PHP features for legacy versions"
      description="A collection of PHP packages that bring modern PHP features to legacy PHP versions with zero-friction migration paths">
      <HomepageHeader />
      <main>
        <PackagesTable />
        <RelatedPackagesTable />
      </main>
    </Layout>
  );
}
