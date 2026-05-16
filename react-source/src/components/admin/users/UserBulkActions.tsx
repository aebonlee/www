interface UserBulkActionsProps {
  selectedCount: number;
  bulkRole: string;
  setBulkRole: (v: string) => void;
  bulkLoading: boolean;
  onBulkRoleChange: () => void;
  onBulkBan: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const UserBulkActions = ({
  selectedCount,
  bulkRole,
  setBulkRole,
  bulkLoading,
  onBulkRoleChange,
  onBulkBan,
  onBulkDelete,
  onClearSelection,
}: UserBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div style={{
      position: 'sticky', bottom: '16px', zIndex: 100,
      background: '#1e293b', color: '#fff',
      borderRadius: '10px', padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      marginBottom: '8px',
    }}>
      <span style={{ fontWeight: 600, marginRight: '4px' }}>{selectedCount}명 선택됨</span>
      <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
      <select
        value={bulkRole}
        onChange={e => setBulkRole(e.target.value)}
        style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '13px', border: 'none', background: '#334155', color: '#fff' }}
      >
        {[
          { value: 'member', label: '일반회원' },
          { value: 'evaluator', label: '평가자' },
          { value: 'admin', label: '관리자' },
        ].map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button
        className="admin-row-btn"
        style={{ background: '#3B82F6', color: '#fff', borderColor: '#3B82F6' }}
        onClick={onBulkRoleChange}
        disabled={bulkLoading}
      >
        등급 변경
      </button>
      <button
        className="admin-row-btn danger"
        style={{ background: '#DC2626', color: '#fff', borderColor: '#DC2626' }}
        onClick={onBulkBan}
        disabled={bulkLoading}
      >
        일괄차단
      </button>
      <button
        className="admin-row-btn danger"
        style={{ background: '#7F1D1D', color: '#fff', borderColor: '#7F1D1D' }}
        onClick={onBulkDelete}
        disabled={bulkLoading}
      >
        일괄삭제
      </button>
      <button
        className="admin-row-btn"
        style={{ marginLeft: 'auto', background: 'transparent', color: '#94a3b8', borderColor: '#475569' }}
        onClick={onClearSelection}
      >
        선택해제
      </button>
    </div>
  );
};

export default UserBulkActions;
