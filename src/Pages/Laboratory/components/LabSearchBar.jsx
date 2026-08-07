export default function LabSearchBar({ filters, setFilters }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label text-muted small">حالة الطلب</label>
            <select
              className="form-select"
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label text-muted small">اسم المريض</label>
            <input
              className="form-control"
              placeholder="ابحث باسم المريض..."
              value={filters.patientName || ""}
              onChange={(e) =>
                setFilters({ ...filters, patientName: e.target.value })
              }
            />
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => setFilters({ status: "", patientName: "" })}
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
