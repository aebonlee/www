import { getSiteColor } from '../../../constants/sites';
import { getUserSiteNames } from '../../../utils/userHelpers';

interface UserSiteFilterBarProps {
  siteNames: string[];
  siteFilter: string;
  setSiteFilter: (v: string) => void;
  users: any[];
  loading: boolean;
}

const COLOR_MAP: Record<string, string> = {
  red: '#dc2626', blue: '#2563eb', green: '#16a34a',
  purple: '#7c3aed', yellow: '#d97706', gray: '#6b7280',
};

const UserSiteFilterBar = ({ siteNames, siteFilter, setSiteFilter, users, loading }: UserSiteFilterBarProps) => {
  if (loading || siteNames.length === 0) return null;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '12px',
      marginBottom: '12px',
      margin: '0 -70px 12px',
      padding: '24px 32px',
      background: 'var(--bg-card, #fff)',
      border: '1px solid var(--border-color, #e5e7eb)',
      borderRadius: '10px',
    }}>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-light)', alignSelf: 'center', marginRight: '8px', whiteSpace: 'nowrap' }}>
        사이트
      </span>
      <button
        className={`admin-row-btn${siteFilter === 'all' ? ' active' : ''}`}
        style={{ fontSize: '14px', padding: '3px 13px' }}
        onClick={() => setSiteFilter('all')}
      >
        전체 ({users.length})
      </button>
      {siteNames.filter((n) => n !== '-').map((name) => {
        const count = users.filter((u) => getUserSiteNames(u).includes(name)).length;
        const isActive = siteFilter === name;
        const color = getSiteColor(name);
        const c = COLOR_MAP[color] || '#6b7280';
        return (
          <button
            key={name}
            onClick={() => setSiteFilter(isActive ? 'all' : name)}
            style={{
              fontSize: '14px', padding: '3px 13px',
              borderRadius: '8px', border: `1px solid ${isActive ? c : 'var(--border-color, #e5e7eb)'}`,
              background: isActive ? c : 'transparent',
              color: isActive ? '#fff' : c,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {name} ({count})
          </button>
        );
      })}
    </div>
  );
};

export default UserSiteFilterBar;
