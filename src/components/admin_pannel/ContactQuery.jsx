import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Spinner,
  Button,
  Modal,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";

import { useAuth } from "../all_login/AuthContext";
import AdminHeader from "./AdminHeader";
import AdminLeftNav from "./AdminLeftNav";

const ENQUIRY_URL = "/contact-enquiries/";

const ContactQuery = () => {
  const { logout, api } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [enquiries, setEnquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    if (window.confirm("Confirm logout from Admin session?")) {
      logout();
      navigate("/Login");
    }
  };

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(ENQUIRY_URL);
      const items = response.data?.data;

      setEnquiries(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("GET Contact Enquiries error:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load Contact Enquiries."
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await api.delete(ENQUIRY_URL, {
        data: { id },
        withCredentials: true,
      });

      setSuccess("Enquiry deleted successfully.");

      await fetchEnquiries();
    } catch (err) {
      console.error("Delete Contact Enquiry error:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to delete enquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="admin-dashboard-container d-flex"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <AdminLeftNav sidebarOpen={sidebarOpen} />

      <main
        className="flex-grow-1 d-flex flex-column bg-light"
        style={{ overflowY: "auto", minWidth: 0 }}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
        />

        <div className="content-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h2 className="mb-1 fw-bold">Contact Queries</h2>

              <p className="text-muted mb-0">Manage contact enquiries.</p>
            </div>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Enquiries</h5>

                <Badge bg="primary">
                  {enquiries.length} Enquiries
                </Badge>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">Loading Enquiries...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Created</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {enquiries.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-muted py-4"
                          >
                            No Enquiries found.
                          </td>
                        </tr>
                      ) : (
                        enquiries.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>

                            <td className="fw-semibold">{item.full_name}</td>

                            <td>{item.email}</td>

                            <td>{item.phone}</td>

                            <td>{item.subject}</td>

                            <td>{item.created_at}</td>

                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  disabled={deletingId === item.id}
                                  onClick={() => handleView(item)}
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  View
                                </Button>

                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  disabled={deletingId === item.id}
                                  onClick={() => handleDelete(item.id)}
                                >
                                  {deletingId === item.id ? (
                                    <Spinner
                                      animation="border"
                                      size="sm"
                                    />
                                  ) : (
                                    <>
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </>
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Enquiry Details</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {selectedItem && (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedItem.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedItem.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedItem.phone}
                  </p>
                  <p>
                    <strong>Subject:</strong> {selectedItem.subject}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedItem.message}
                  </p>
                  <p>
                    <strong>Created:</strong> {selectedItem.created_at}
                  </p>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default ContactQuery;
