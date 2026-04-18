import { useState, useMemo } from 'react';

const AdminDataTable = ({
  columns,
  data,
  loading,
  searchKeys = [],
  actions,
  pageSize = 20,
  toolbarExtra,
  expandRow,
  showRowNumbers = false,
}: any) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // Search filter
  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv), 'ko');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, safePage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // 공통 페이지네이션 UI
  const PaginationBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
        {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} / {sorted.length}건
      </span>
      <div className="admin-table-pagination">
        <button className="admin-page-btn" onClick={() => setPage(safePage - 1)} disabled={safePage === 1}>‹</button>
        {getPageNumbers().map((n) => (
          <button
            key={n}
            className={`admin-page-btn ${safePage === n ? 'active' : ''}`}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}
        <button className="admin-page-btn" onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages}>›</button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-table-wrapper">
        <div className="admin-loading"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      {/* 툴바 — 검색 + 상단 페이지네이션 */}
      <div className="admin-table-toolbar" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {searchKeys.length > 0 && (
            <div className="admin-table-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="검색..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          )}
          {toolbarExtra && <div className="admin-table-actions">{toolbarExtra}</div>}
        </div>
        {totalPages > 1 && <PaginationBar />}
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {showRowNumbers && <th style={{ width: '46px', textAlign: 'center' }}>No.</th>}
              {columns.map((col) => (
                <th
                  key={col.key + col.label}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <span className={`sort-indicator ${sortKey === col.key ? 'active' : ''}`}>
                    {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                  </span>
                </th>
              ))}
              {actions && <th style={{ width: '80px' }}>관리</th>}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (showRowNumbers ? 1 : 0)}>
                  <div className="admin-empty">
                    <p>데이터가 없습니다.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  row={row}
                  columns={columns}
                  actions={actions}
                  expandRow={expandRow}
                  rowNumber={showRowNumbers ? (safePage - 1) * pageSize + idx + 1 : null}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 페이지네이션 */}
      {totalPages > 1 && (
        <div className="admin-table-footer">
          <span>
            총 {sorted.length}건 중 {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)}
          </span>
          <PaginationBar />
        </div>
      )}
    </div>
  );
};

function TableRow({ row, columns, actions, expandRow, rowNumber }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={expandRow ? () => setExpanded(!expanded) : undefined}
        style={expandRow ? { cursor: 'pointer' } : undefined}
      >
        {rowNumber !== null && (
          <td style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', fontWeight: 500 }}>
            {rowNumber}
          </td>
        )}
        {columns.map((col) => (
          <td key={col.key + col.label} className={col.className || ''}>
            {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
          </td>
        ))}
        {actions && (
          <td onClick={(e) => e.stopPropagation()}>
            {actions(row)}
          </td>
        )}
      </tr>
      {expandRow && expanded && (
        <tr>
          <td colSpan={columns.length + (actions ? 1 : 0) + (rowNumber !== null ? 1 : 0)} style={{ padding: 0 }}>
            {expandRow(row)}
          </td>
        </tr>
      )}
    </>
  );
}

export default AdminDataTable;
