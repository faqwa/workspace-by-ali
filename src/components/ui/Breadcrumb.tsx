import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Navigation Component
 *
 * Displays navigation hierarchy with clickable links
 * Last item is non-clickable (current page)
 *
 * Usage:
 * <Breadcrumb items={[
 *   { label: 'Home', href: '/' },
 *   { label: 'Projects', href: '/projects' },
 *   { label: 'My Project' }
 * ]} />
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="text-sm breadcrumbs mb-4">
      <ul>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index}>
              {isLast || !item.href ? (
                <span className="text-base-content/70">{item.label}</span>
              ) : (
                <a href={item.href} className="text-primary hover:text-primary-focus">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
