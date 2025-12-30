import type {ReactNode} from 'react';
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

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Mission
        </Heading>
        <p className="hero__subtitle">
          "To make upgrading old PHP easy and simple."
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
      </main>
    </Layout>
  );
}
