export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="doctor-search">
      <i className="bi bi-search"></i>

      <input
        type="text"
        className="form-control"
        placeholder="Search doctors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <button
          type="button"
          className="doctor-search-clear"
          onClick={() => setSearchTerm("")}
        >
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
  );
}
