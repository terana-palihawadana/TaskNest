import "./TopBar.css";

function TopBar({ search, onSearchChange, onMenuToggle }) {
  return (
    <div className="topbar">
      <div className="topbar-start">
        <button
          type="button"
          className="topbar-menu-btn"
          aria-label="Toggle menu"
          onClick={onMenuToggle}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="topbar-search">
          <svg
            className="topbar-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            className="topbar-search-input"
            placeholder="Search focus..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar-user">
        <span className="topbar-user-name">Julian Rivera</span>
        <div className="topbar-avatar" aria-hidden="true" />
      </div>
    </div>
  );
}

export default TopBar;
