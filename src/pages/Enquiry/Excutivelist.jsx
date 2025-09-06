import React, { useEffect, useState } from "react";
import { Button, Card, Table, Container, Modal, Form } from "react-bootstrap";
import Pagination from "../../components/Pagination";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const BASE = "https://api.theweddingrentals.in/api/excutive";

const PAGE_SIZE = 10;

const Executives = () => {
  const [execs, setExecs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewExec, setViewExec] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    try {
      const res = await axios.get(`${BASE}/getallexcutive`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.executives || [];
      // normalize for the table
      const mapped = list.map((e) => ({
        _id: e._id,
        executivename: e.executivename || "N/A",
        mobileNumber: e.mobileNumber ? String(e.mobileNumber) : "N/A",
        createdAt: e.createdAt || null,
        raw: e,
      }));
      setExecs(mapped);
    } catch (error) {
      console.error("Error fetching executives:", error);
    }
  };

  console.log("execs", execs);

  // Search + pagination
  const filtered = execs.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.executivename.toLowerCase().includes(q) ||
      e.mobileNumber.toLowerCase().includes(q)
    );
  });
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (ex) => {
    setViewExec(ex);
    setShowViewModal(true);
  };

  const fmt = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
    // or: return new Date(iso).toISOString().slice(0,19).replace('T',' ');
  };

  return (
    <Container style={{ background: "#F4F4F4", paddingBlock: "20px" }}>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search Executive (name or mobile)"
          value={searchQuery}
          onChange={handleSearchChange}
          className="shadow-sm"
          style={{ width: "280px", fontSize: "12px" }}
        />
        <div className="d-flex gap-2">
          {/* Hook this to your add-executive page if you have one */}
          <Button
            variant="primary"
            className="fw-bold rounded-1 shadow-lg"
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              background: "#BD5525",
              borderColor: "#BD5525",
            }}
            onClick={() => window.location.assign("/addexcutive")}
          >
            + Add Executive
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <div
          className="table-responsive bg-white rounded-lg"
          style={{ maxHeight: "65vh", overflowY: "auto" }}
        >
          <Table className="table table-hover align-middle">
            <thead
              className="text-white text-center"
              style={{ backgroundColor: "#323D4F", fontSize: "12px" }}
            >
              <tr>
                <th className="text-start">Executive Name</th>
                <th className="text-start">Mobile Number</th>
                <th className="text-start">Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((ex) => (
                <tr key={ex._id} className="text-center hover-row">
                  <td
                    className="fw-semibold text-start"
                    style={{ fontSize: "12px" }}
                  >
                    {ex.executivename}
                  </td>
                  <td className="text-start" style={{ fontSize: "12px" }}>
                    {ex.mobileNumber}
                  </td>
                  <td className="text-start" style={{ fontSize: "12px" }}>
                    {fmt(ex.createdAt)}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="me-2 icon-btn"
                      style={{ padding: "4px 8px", fontSize: "10px" }}
                      onClick={() => handleView(ex)}
                    >
                      <FaEye />
                    </Button>
                    {/* Add Edit/Delete later once you share endpoints */}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Executives found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Pagination
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Executive Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px" }}>
          {viewExec && (
            <>
              <p>
                <strong>Name:</strong> {viewExec.executivename}
              </p>
              <p>
                <strong>Mobile:</strong> {viewExec.mobileNumber}
              </p>
              <p>
                <strong>Created:</strong> {fmt(viewExec.createdAt)}
              </p>
              <hr />
              <p style={{ color: "#64748B" }}>
                <small>ID: {viewExec._id}</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Executives;
