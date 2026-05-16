interface UserActionModalProps {
  actionTarget: { user: any; type: 'edit' | 'ban' } | null;
  actionLoading: boolean;
  editName: string;
  setEditName: (v: string) => void;
  editPhone: string;
  setEditPhone: (v: string) => void;
  banReason: string;
  setBanReason: (v: string) => void;
  onEdit: () => void;
  onBan: () => void;
  onClose: () => void;
}

const UserActionModal = ({
  actionTarget,
  actionLoading,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  banReason,
  setBanReason,
  onEdit,
  onBan,
  onClose,
}: UserActionModalProps) => {
  if (!actionTarget) return null;
  const { user, type } = actionTarget;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-white, #fff)',
          borderRadius: '14px', padding: '28px',
          minWidth: '380px', maxWidth: '500px', width: '90%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
              {type === 'edit' ? '프로필 수정' : '접근 차단'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--primary-blue, #2563eb)', fontWeight: 600, marginTop: '3px' }}>
              {user.display_name || user.email}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--text-light)', lineHeight: 1, padding: '0 2px' }}
          >&times;</button>
        </div>

        {type === 'edit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>이름</label>
              <input
                type="text"
                className="admin-action-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="표시 이름"
                autoFocus
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>전화번호</label>
              <input
                type="tel"
                className="admin-action-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button className="admin-row-btn" onClick={onClose}>취소</button>
              <button
                className="admin-row-btn"
                style={{ background: 'var(--primary-blue, #2563eb)', color: '#fff', borderColor: 'var(--primary-blue, #2563eb)' }}
                onClick={onEdit}
                disabled={actionLoading || !editName.trim()}
              >
                {actionLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}

        {type === 'ban' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>차단 사유 (선택)</label>
              <input
                type="text"
                className="admin-action-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="차단 사유 입력"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button className="admin-row-btn" onClick={onClose}>취소</button>
              <button
                className="admin-row-btn danger"
                style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}
                onClick={onBan}
                disabled={actionLoading}
              >
                {actionLoading ? '처리 중...' : '차단 적용'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActionModal;
