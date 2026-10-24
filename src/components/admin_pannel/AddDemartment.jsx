import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Spinner,
  Button,
  Modal,
  Form,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";

import { useAuth } from "../all_login/AuthContext";
import AdminHeader from "./AdminHeader";
import AdminLeftNav from "./AdminLeftNav";

const DEPARTMENT_URL = "/departments/";

const INITIAL_FORM = {
  dept_name: "",
};

const AddDemartment = () => {
  const { logout, api } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Logout
  const handleLogout = () => {
    if (window.confirm("Confirm logout from Admin session?")) {
      logout();
      navigate("/Login");
    }
  };

  // GET: Fetch Departments
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(DEPARTMENT_URL);
      const items = response.data?.data;

      setDepartments(Array.isArray(items) ? items : []);
    } catch (err) {

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load Departments."
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Reset form
  const resetForm = () => {
    setEditingItem(null);
    setFormData(INITIAL_FORM);
    setError("");
    setSuccess("");
  };

  // Open Add modal
  const handleAdd = () => {
    resetForm();
    setSuccess("");
    setShowModal(true);
  };

  // Open Edit modal
  const handleEdit = (item) => {
    setEditingItem(item);

    setFormData({
      dept_name: item.dept_name || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // POST: Create / PUT: Update
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.dept_name.trim()) {
      setError("Please enter a department name.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        dept_name: formData.dept_name.trim(),
      };

      if (editingItem) {
        // PUT: include the item ID in the body
        payload.id = editingItem.id;

        await api.put(DEPARTMENT_URL, payload, {
          withCredentials: true,
        });

        setSuccess("Department updated successfully.");
      } else {
        // POST: create a new department
        await api.post(DEPARTMENT_URL, payload, {
          withCredentials: true,
        });

        setSuccess("Department created successfully.");
      }

      setShowModal(false);
      resetForm();

      await fetchDepartments();
    } catch (err) {

      const responseData = err.response?.data;

      setError(
        typeof responseData === "string"
          ? responseData
          : responseData?.detail ||
              responseData?.message ||
              (responseData
                ? JSON.stringify(responseData)
                : err.message) ||
              "Failed to save department."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Remove department
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await api.delete(`${DEPARTMENT_URL}`, {
        data: { id },
        withCredentials: true,
      });

      setSuccess("Department deleted successfully.");

      await fetchDepartments();
    } catch (err) {

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to delete department."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Close modal safely
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
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
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h2 className="mb-1 fw-bold">
                Department Management
              </h2>

              <p className="text-muted mb-0">
                Manage departments.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleAdd}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Department
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          )}

          {/* Table */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  Departments
                </h5>

                <Badge bg="primary">
                  {departments.length} Departments
                </Badge>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">
                    Loading Departments...
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table
                    striped
                    bordered
                    hover
                    className="align-middle mb-0"
                  >
                    <thead className="table-light">
                      <tr>
                       
                        <th>Department Name</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {departments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center text-muted py-4"
                          >
                            No Departments found.
                          </td>
                        </tr>
                      ) : (
                        departments.map((item) => (
                          <tr key={item.id}>
                          

                            <td className="fw-semibold">
                              {item.dept_name}
                            </td>

                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  disabled={deletingId === item.id}
                                  onClick={() => handleEdit(item)}
                                >
                                  <i className="bi bi-pencil-square me-1"></i>
                                  Edit
                                </Button>

                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  disabled={deletingId === item.id}
                                  onClick={() =>
                                    handleDelete(item.id)
                                  }
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

          {/* Add / Edit Modal */}
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered
            backdrop={saving ? "static" : true}
          >
            <Modal.Header closeButton={!saving}>
              <Modal.Title className="fw-bold">
                {editingItem
                  ? "Edit Department"
                  : "Add Department"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name</Form.Label>

                  <Form.Control
                    type="text"
                    name="dept_name"
                    placeholder="Enter department name"
                    value={formData.dept_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : editingItem ? (
                      "Update Department"
                    ) : (
                      "Add Department"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={saving}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default AddDemartment;
