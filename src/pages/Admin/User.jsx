import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Card, Table, Container } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

function User() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ApiURL = "https://api.theweddingrentals.in/api/master";

  const [updatedMember, setUpdatedMember] = useState({
    name: "",
    email: "",
    password: "",
    permissions: {
      Dashboard: false,
      master: false,
      productmanagement: false,
      clients: false,
      enquirylist: false,
      enquirycalender: false,
      quotation: false,
      termsandcondition: false,
      paymentreports: false,
      inventoryproductlist: false,
      reports: false,
      damaged: false,
      user: false,
      orders: false,
    },
  });

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    permissions: {
      Dashboard: false,
      master: false,
      productmanagement: false,
      clients: false,
      enquirylist: false,
      enquirycalender: false,
      quotation: false,
      termsandcondition: false,
      paymentreports: false,
      inventoryproductlist: false,
      reports: false,
      damaged: false,
      user: false,
      orders: false,
    },
  });

  const fetchData = async (page = 1) => {
    try {
      const teamRes = await axios.get(
        `${ApiURL}/getallteammembers?page=${page}`
      );
      setAllMembers(teamRes.data.data || []);
      setTotalPages(teamRes.data.totalPages || 1);
      setCurrentPage(teamRes.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch team members");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteMember = async (memberId) => {
    try {
      const res = await axios.delete(`${ApiURL}/deleteteammember/${memberId}`);
      if (res.status === 200) {
        toast.success("Member deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setUpdatedMember({
      name: member.name || "",
      email: member.email || "",
      password: member.password || "",
      permissions: {
        Dashboard: member.Dashboard || false,
        master: member.master || false,
        productmanagement: member.productmanagement || false,
        clients: member.clients || false,
        enquirylist: member.enquirylist || false,
        enquirycalender: member.enquirycalender || false,
        quotation: member.quotation || false,
        termsandcondition: member.termsandcondition || false,
        paymentreports: member.paymentreports || false,
        inventoryproductlist: member.inventoryproductlist || false,
        reports: member.reports || false,
        damaged: member.damaged || false,
        user: member.user || false,
        orders: member.orders || false,
      },
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...updatedMember,
        ...updatedMember.permissions,
      };
      delete payload.permissions;

      const res = await axios.put(
        `${ApiURL}/updateteammember/${selectedMember._id}`,
        payload
      );

      if (res.status === 200) {
        toast.success("Member updated successfully");
        setShowEditModal(false);
        fetchData(currentPage);
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...newMember,
        ...newMember.permissions,
      };
      delete payload.permissions;

      const res = await axios.post(`${ApiURL}/addteammember`, payload);

      if (res.status === 200) {
        toast.success("Member added successfully");
        setShowAddModal(false);
        setNewMember({
          name: "",
          email: "",
          password: "",
          permissions: {
            Dashboard: false,
            master: false,
            productmanagement: false,
            clients: false,
            enquirylist: false,
            enquirycalender: false,
            quotation: false,
            termsandcondition: false,
            paymentreports: false,
            inventoryproductlist: false,
            reports: false,
            damaged: false,
            user: false,
          },
        });
        fetchData(currentPage);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    }
  };

  const handleChange = (field, value, isNewMember = false) => {
    const setState = isNewMember ? setNewMember : setUpdatedMember;
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permissionKey, isNewMember = false) => {
    const setState = isNewMember ? setNewMember : setUpdatedMember;
    setState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: !prev.permissions[permissionKey],
      },
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  return (
    <Container className="py-6 bg-gray-50 min-h-screen">
      <div className="d-flex mb-3" style={{ justifyContent: "space-between" }}>
        <div className="relative">
          <i className="fas fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            style={{
              borderRadius: "5px",
              paddingLeft: "10px",
              outline: "none",
            }}
          />
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className=" text-white font-semibold py-2 px-4  "
          style={{ backgroundColor: "rgb(189, 85, 37)" }}
        >
          Add New Member
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover className="table-bordered">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Password</th>
                <th className="px-4 py-3 font-semibold">Permissions</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {allMembers.length > 0 ? (
                allMembers.map((row) => (
                  <tr key={row._id}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">{row.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">{row.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">{row.password}</div>
                    </td>
                    {/* <td className="px-4 py-3">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(updatedMember.permissions).map((key) => (
                          <span
                            key={key}
                            className={`text-sm ${
                              row[key] ? "text-gray-800" : "text-gray-400"
                            }`}
                          >
                            {key} <br />
                          </span>
                        ))}
                      </div>
                    </td> */}
                    <td className="px-4 py-3">
                      {Object.keys(updatedMember.permissions)
                        .filter((key) => row[key] === true)
                        .map((key) => (
                          <span key={key} className={`text-sm text-gray-800`}>
                            {key} <br />
                          </span>
                        ))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <FaEdit
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                          size={16}
                          title="Edit"
                          onClick={() => handleEdit(row)}
                        />
                        <span className="text-gray-400">/</span>
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          size={16}
                          title="Delete"
                          onClick={() => deleteMember(row._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton className="bg-blue-50">
          <Modal.Title>Edit Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                value={updatedMember.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                value={updatedMember.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                value={updatedMember.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="text-sm font-medium text-gray-700">
                Permissions
              </Form.Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.keys(updatedMember.permissions).map((permissionKey) => (
                  <Form.Check
                    key={permissionKey}
                    type="checkbox"
                    label={permissionKey}
                    checked={updatedMember.permissions[permissionKey]}
                    onChange={() => handlePermissionChange(permissionKey)}
                    className="text-sm text-gray-700"
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Member Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton className="bg-blue-50">
          <Modal.Title>Add New Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                value={newMember.name}
                onChange={(e) => handleChange("name", e.target.value, true)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                value={newMember.email}
                onChange={(e) => handleChange("email", e.target.value, true)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                value={newMember.password}
                onChange={(e) => handleChange("password", e.target.value, true)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="text-sm font-medium text-gray-700">
                Permissions
              </Form.Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.keys(newMember.permissions).map((permissionKey) => (
                  <Form.Check
                    key={permissionKey}
                    type="checkbox"
                    label={permissionKey}
                    checked={newMember.permissions[permissionKey]}
                    onChange={() => handlePermissionChange(permissionKey, true)}
                    className="text-sm text-gray-700"
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Member
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default User;
