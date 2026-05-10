import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'danger';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon: Icon, variant = 'primary' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100' };
      case 'danger': return { bg: 'bg-rose-50', text: 'text-rose-600', iconBg: 'bg-rose-100' };
      default: return { bg: 'bg-cyan-50', text: 'text-cyan-600', iconBg: 'bg-cyan-100' };
    }
  };

  const styles = getStyles();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${styles.iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className={`${styles.text} w-6 h-6`} />
        </div>
        {trend && (
          <span className={`text-xs font-bold ${styles.text} ${styles.bg} px-2 py-1 rounded-lg`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
      </div>
    </div>
  );
};
