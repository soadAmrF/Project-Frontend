export default function SearchBar({
  searchInput,
  setSearchInput,
  onSearch,
  filters,
  setFilters,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="inventory-search-card">
      <div className="inventory-search-row">
        {/* Search */}
        <div className="inventory-search-input-wrapper">
          <i className="bi bi-search"></i>

          <input
            type="text"
            className="inventory-search-input"
            placeholder="Search by item name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Search Button */}
        <button
          type="button"
          className="inventory-search-btn"
          onClick={onSearch}
        >
          <i className="bi bi-search me-1"></i>
          Search
        </button>

        {/* Low Stock */}
        <label className="inventory-filter">
          <input
            type="checkbox"
            checked={filters.lowStock}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                lowStock: e.target.checked,
              }))
            }
          />

          <span>Low Stock</span>
        </label>

        {/* Expired */}
        <label className="inventory-filter">
          <input
            type="checkbox"
            checked={filters.expired}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                expired: e.target.checked,
              }))
            }
          />

          <span>Expired</span>
        </label>
      </div>
    </div>
  );
}
