export default function SearchBar({
  searchInput,
  setSearchInput,
  onSearch,
  filters,
  setFilters,
}) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="ابحث بالاسم..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
            />
          </div>

          <div className="col-auto">
            <button className="btn btn-outline-primary" onClick={onSearch}>
              بحث
            </button>
          </div>

          <div className="col-auto">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="lowStockFilter"
                checked={filters.lowStock}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    lowStock: e.target.checked,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="lowStockFilter">
                الناقص فقط
              </label>
            </div>
          </div>

          <div className="col-auto">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="expiredFilter"
                checked={filters.expired}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    expired: e.target.checked,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="expiredFilter">
                المنتهي فقط
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
