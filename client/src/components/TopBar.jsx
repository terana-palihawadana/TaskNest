function TopBar() {
    return (
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="search"
          className="form-control"
          placeholder="Search focus..."
          style={{ maxWidth: "320px" }}
        />
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">Julian Rivera</span>
          <div
            className="rounded-circle bg-secondary"
            style={{ width: "36px", height: "36px" }}
          />
        </div>
      </div>
    );
  }
  
  export default TopBar;