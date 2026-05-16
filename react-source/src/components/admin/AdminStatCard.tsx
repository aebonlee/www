import { AdminStatCardProps } from '../../types/admin';

const AdminStatCard = ({ icon, value, label, color }: AdminStatCardProps) => {
  return (
    <div className="admin-stat-card">
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className={`stat-value${typeof value === 'string' ? ' stat-value-sm' : ''}`}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default AdminStatCard;
