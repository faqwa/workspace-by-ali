import type { ReactNode } from 'react';
import { Card } from '@tremor/react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card className="mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            {title}
          </p>
          <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-tremor-default font-medium ${
                  trend.isPositive
                    ? 'text-emerald-700 dark:text-emerald-500'
                    : 'text-red-700 dark:text-red-500'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                from last period
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
