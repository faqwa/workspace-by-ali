interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
      {description && <div className="stat-description">{description}</div>}
      {trend && (
        <div className={`text-sm mt-2 font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
          {trend.isPositive ? '↗︎' : '↘︎'} {Math.abs(trend.value)}% from last month
        </div>
      )}
    </div>
  );
}
