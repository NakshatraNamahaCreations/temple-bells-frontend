import { Link, useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaTags,
  FaBoxOpen,
  FaUserFriends,
  FaUsers, // Changed to FaUsers for User List
  FaShoppingBag,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaFileContract,
  FaChartBar,
  FaTools,
  FaChartLine,
  FaSignOutAlt, // Added for Logout icon
} from "react-icons/fa";
import {
  MdDashboard,
  MdInventory,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // Assuming toast is available

const Sidebars = () => {
  const location = useLocation();

  // Get and parse user data
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout successful"); // Display toast notification
    window.location.assign("/"); // Redirect to login page
  };

  // Map menu key to user permission field (normalize to lowercase)
  const menuItems = [
    {
      key: "dashboard",
      name: "Dashboard",
      path: "/dashboard",
      icon: MdDashboard,
      permission: "dashboard",
    },
    {
      key: "user",
      name: "User List",
      path: "/user",
      icon: FaUsers,
      permission: "user",
    },
    {
      key: "master",
      name: "Master",
      path: "/master",
      icon: FaClipboardList,
      permission: "master",
    },
    {
      key: "productManagement",
      name: "Product Management",
      path: "/product-management",
      icon: FaBoxOpen,
      permission: "productmanagement",
    },
    {
      key: "clients",
      name: "Clients",
      path: "/client",
      icon: FaUserFriends,
      permission: "clients",
    },
    {
      key: "excutive",
      name: "Excutive",
      path: "/excutivelist",
      icon: FaUserFriends,
      permission: "excutive",
    },
    {
      key: "enquiryList",
      name: "Enquiry List",
      path: "/enquiry-list",
      icon: MdOutlineSupportAgent,
      permission: "enquirylist",
    },
    {
      key: "enquiryCalendar",
      name: "Enquiry Calendar",
      path: "/enquiry-calender",
      icon: FaCalendarAlt,
      permission: "enquirycalender",
    },
    {
      key: "quotation",
      name: "Quotation",
      path: "/quotation",
      icon: FaFileInvoiceDollar,
      permission: "quotation",
    },
    {
      key: "orders",
      name: "Orders",
      path: "/orders",
      icon: FaShoppingBag,
      permission: "orders",
    },
    {
      key: "termsAndConditions",
      name: "Terms & Conditions",
      path: "/terms-conditions",
      icon: FaFileContract,
      permission: "termsandcondition",
    },
    {
      key: "paymentReport",
      name: "Payment Report",
      path: "/payment-report",
      icon: FaChartBar,
      permission: "paymentreports",
    },
    {
      key: "inventoryProductList",
      name: "Inventory Product List",
      path: "/inventory-product-list",
      icon: MdInventory,
      permission: "inventoryproductlist",
    },
    {
      key: "reports",
      name: "Reports",
      path: "/reports",
      icon: FaChartLine,
      permission: "reports",
    },
    {
      key: "damagedAndLost",
      name: "Damaged/Lost",
      path: "/damaged-products",
      icon: FaChartBar,
      permission: "damaged",
    },
    {
      key: "logout",
      name: "Logout",
      // No path needed for logout, handled by function
      icon: FaSignOutAlt, // Changed to FaSignOutAlt for logout icon
      permission: "logout", // Assuming logout is always accessible
    },
  ];

  // Filter menu items based on user permissions
  const filteredMenuItems = user
    ? menuItems.filter((item) => {
        const permissionKey = item.permission;
        // Allow logout for all authenticated users
        if (item.key === "logout") return true;
        return user[permissionKey] === true;
      })
    : [];

  const isActiveLink = (path) => {
    return location.pathname.includes(path);
  };

  // Optional: Redirect or show access denied if no permissions
  if (!user) {
    return null; // or show login redirect
  }

  return (
    <div
      className="flex-column flex-shrink-0 p-3 vh-100 position-fixed sidebar-scroll"
      style={{
        width: "20%",
        zIndex: 1,
        background: "#6c757d",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="w-100 d-flex justify-content-center">
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <div
            className="poppins-semiBold"
            style={{ color: "white", fontSize: "19px" }}
          >
            The Wedding Rentals
          </div>
        </Link>
      </div>

      <ul className="nav flex-column mt-2">
        {filteredMenuItems.length === 0 ? (
          <li className="nav-item">
            <span className="nav-link text-white">No access to any page.</span>
          </li>
        ) : (
          filteredMenuItems.map((item, index) => (
            <li key={index} className="nav-item my-1">
              {item.key === "logout" ? (
                <span
                  className="nav-link d-flex align-items-center text-white cursor-pointer"
                  onClick={handleLogout}
                >
                  <item.icon className="me-2" />
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={`${
                    isActiveLink(item.path) ? "custom-bg" : ""
                  } nav-link d-flex align-items-center text-white`}
                >
                  <item.icon className="me-2" />
                  {item.name}
                </Link>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Sidebars;
