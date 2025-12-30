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
    name: 'enum',
    description: 'PHP 8-style enums for PHP 7.2+ with migration tools',
    github: 'https://github.com/php-compatible/enum',
    docs: '/docs/enum',
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
              <th>Package</th>
              <th>Description</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {PackageList.map((pkg, idx) => (
              <tr key={idx}>
                <td>
                  <code>php-compatible/{pkg.name}</code>
                </td>
                <td>{pkg.description}</td>
                <td>
                  <Link to={pkg.docs} className="button button--sm button--primary margin-right--sm">
                    Docs
                  </Link>
                  <Link href={pkg.github} className="button button--sm button--secondary">
                    GitHub
                  </Link>
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
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/enum">
            Get Started
          </Link>
        </div>
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
