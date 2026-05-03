import { motion } from 'framer-motion';
import clsx from 'clsx';

const DashboardCard = ({ title, value, icon: Icon, colorClass, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={clsx("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-xl font-bold text-slate-800 mt-0.5">{value}</h3>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
