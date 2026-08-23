import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  subtitle?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, subtitle }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <div className="bg-[#F8F9FA] p-2 rounded-full">
          <Icon className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.value >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                }`}
            >
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
