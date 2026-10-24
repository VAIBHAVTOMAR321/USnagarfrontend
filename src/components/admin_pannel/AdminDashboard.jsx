
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

const CAROUSEL_URL = "/carousel/";

const INITIAL_FORM = {
  title: "",
  description: "",
};

const AdminDashboard = () => {
  const { logout, api } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [carouselItems, setCarouselItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Logout
  const handleLogout = () => {
    if (window.confirm("Confirm logout from Admin session?")) {
      logout();
      navigate("/Login");
    }
  };

  // GET: Fetch carousel items
  const fetchCarousel = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(CAROUSEL_URL);
      const items = response.data?.data;

      setCarouselItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("GET carousel error:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load carousel items."
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchCarousel();
  }, [fetchCarousel]);

  const IMAGE_PREFIX = "/pauripargati/pauripargati_backend";

  // Convert image paths to usable URLs
  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:")
    ) {
      // Insert the missing path prefix if the URL points to /media/...
      if (
        image.startsWith("https://mahadevaaya.com/media/") ||
        image.startsWith("http://mahadevaaya.com/media/")
      ) {
        return image.replace(
          "mahadevaaya.com/media/",
          "mahadevaaya.com/pauripargati/pauripargati_backend/media/"
        );
      }

      return image;
    }

    return `https://mahadevaaya.com${IMAGE_PREFIX}${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };

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

  // Revoke temporary image preview URLs
  const clearImagePreview = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // File input: user selects an image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    clearImagePreview();

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);

    setError("");
    setSuccess("");
  };

  // Reset form
  const resetForm = () => {
    clearImagePreview();

    setEditingItem(null);
    setFormData(INITIAL_FORM);
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setError("");
  };

  // Open Add modal
  const handleAdd = () => {
    resetForm();
    setSuccess("");
    setShowModal(true);
  };

  // Open Edit modal
  const handleEdit = (item) => {
    clearImagePreview();

    setEditingItem(item);

    setFormData({
      title: item.title || "",
      description: item.description || "",
    });

    setImageFile(null);
    setImagePreview(getImageUrl(item.image));
    setRemoveExistingImage(false);

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // POST: Create / PUT: Update
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter a carousel title.");
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());

      if (imageFile) {
        // Upload the actual selected file
        payload.append("image", imageFile);
      } else if (!editingItem || removeExistingImage) {
        // No image for a new item, or explicitly removing one
        payload.append("image", "");
      }

      if (editingItem) {
        // PUT: include the item ID in the body
        payload.append("id", String(editingItem.id));

        await api.put(CAROUSEL_URL, payload, {
          withCredentials: true,
        });

        setSuccess("Carousel item updated successfully.");
      } else {
        // POST: create a new item
        await api.post(CAROUSEL_URL, payload, {
          withCredentials: true,
        });

        setSuccess("Carousel item created successfully.");
      }

      setShowModal(false);
      resetForm();

      await fetchCarousel();
    } catch (err) {
      console.error("Save carousel error:", err);

      const responseData = err.response?.data;

      setError(
        typeof responseData === "string"
          ? responseData
          : responseData?.detail ||
              responseData?.message ||
              (responseData
                ? JSON.stringify(responseData)
                : err.message) ||
              "Failed to save carousel item."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Remove item
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this carousel item?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await api.delete(`${CAROUSEL_URL}${id}/`, {
        data: { id },
        withCredentials: true,
      });

      setSuccess("Carousel item deleted successfully.");

      await fetchCarousel();
    } catch (err) {
      console.error("Delete carousel error:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to delete carousel item."
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
                Carousel Management
              </h2>

              <p className="text-muted mb-0">
                Manage Pauri Pargati homepage carousel items.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleAdd}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Carousel Item
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
                  Carousel Items
                </h5>

                <Badge bg="primary">
                  {carouselItems.length} Items
                </Badge>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">
                    Loading carousel items...
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
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {carouselItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-muted py-4"
                          >
                            No carousel items found.
                          </td>
                        </tr>
                      ) : (
                        carouselItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>

                            <td className="fw-semibold">
                              {item.title}
                            </td>

                            <td style={{ minWidth: "220px" }}>
                              {item.description || "—"}
                            </td>

                            <td>
                              {getImageUrl(item.image) ? (
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.title || "Carousel"}
                                  className="img-thumbnail"
                                  style={{
                                    width: "100px",
                                    height: "65px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <span className="text-muted">
                                  No image
                                </span>
                              )}
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
                  ? "Edit Carousel Item"
                  : "Add Carousel Item"}
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
                  <Form.Label>Title</Form.Label>

                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter carousel title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter carousel description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Carousel Image (Optional)
                  </Form.Label>

                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <Form.Text className="text-muted">
                    Choose an image from your computer.
                  </Form.Text>

                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Carousel preview"
                        className="img-thumbnail"
                        style={{
                          width: "200px",
                          height: "130px",
                          objectFit: "cover",
                        }}
                      />

                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        className="d-block mt-2"
                        onClick={() => {
                          clearImagePreview();
                          setImageFile(null);
                          setImagePreview(null);
                          setRemoveExistingImage(true);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
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
                      "Update Carousel"
                    ) : (
                      "Add Carousel"
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

export default AdminDashboard;
