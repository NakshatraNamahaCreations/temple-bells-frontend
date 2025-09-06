import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// Change if your base is different
const EXEC_API = "https://api.theweddingrentals.in/api/excutive";

function Addexcutive() {
  const navigate = useNavigate();
  const [executivename, setExecutivename] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, mobile: false });

  const nameError = touched.name && !executivename.trim();
  const mobileError = touched.mobile && !/^\d{10}$/.test(mobileNumber); // simple 10-digit check

  const handleSubmit = async (e) => {
    e.preventDefault();

    // front-end validation
    if (!executivename.trim() || !/^\d{10}$/.test(mobileNumber)) {
      setTouched({ name: true, mobile: true });
      toast.error("Please provide a valid name and 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${EXEC_API}/createxcutive`, {
        executivename: executivename.trim(),
        mobileNumber: mobileNumber.trim(),
      });

      toast.success(data?.message || "Executive added successfully");

      setTimeout(() => navigate("/excutivelist"), 600);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error adding executive";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setMobileNumber(digitsOnly.slice(0, 10));
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Add Executive</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Executive Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter executive name"
                value={executivename}
                onChange={(e) => setExecutivename(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                isInvalid={!!nameError}
              />
              <Form.Control.Feedback type="invalid">
                Name is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={handleMobileChange}
                onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
                isInvalid={!!mobileError}
              />
              <Form.Control.Feedback type="invalid">
                Enter a valid 10-digit mobile number
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Duplicates are blocked — you’ll see a toast if it already
                exists.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ background: "#BD5525", borderColor: "#BD5525" }}
              >
                {loading ? "Saving..." : "Add Executive"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Addexcutive;
