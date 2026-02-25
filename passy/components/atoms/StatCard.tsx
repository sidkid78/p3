import React from 'react';
import GlassCard from './GlassCard';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  trend?: {
    label: string;
    icon: string;
    type: 'success' | 'warning' | 'info';
  };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, trend }) => {
  const trendColorClass = trend?.type === 'success' ? 'text-emerald-400' : trend?.type === 'warning' ? 'text-secondary-rose' : 'text-gray-500';

  return (
    <GlassCard className="flex flex-col gap-6 rounded-3xl p-8 border border-panel-border hover:border-primary/40 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start relative z-10">
        <p className="opacity-50 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <div className="bg-primary/10 rounded-xl p-2 flex items-center justify-center border border-primary/10 transition-all group-hover:bg-primary/20">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-text-main tracking-tighter text-4xl lg:text-5xl font-black">
          {value} {subValue && <span className="text-lg font-light opacity-40 ml-1">{subValue}</span>}
        </p>
      </div>
      {trend && (
        <div className={`flex items-center gap-2 ${trendColorClass} text-xs font-bold relative z-10`}>
          <span className="material-symbols-outlined text-sm">{trend.icon}</span>
          <span className="uppercase tracking-widest">{trend.label}</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </GlassCard>
  );
};

export default StatCard;
