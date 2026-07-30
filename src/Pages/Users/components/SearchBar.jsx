const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="row mb-4">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;