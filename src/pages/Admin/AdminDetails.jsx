import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { config } from "../../services/config";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const roleList = [
	"dashboard",
	"master",
	"banner",
	"productManagement",
	"clients",
	"enquiryList",
	"enquiryCalendar",
	"quotation",
	"orders",
	"termsAndConditions",
	"paymentReport",
	"refurbishmentReport",
	"inventoryProductList",
	"adminRights",
	"reports",
	"damagedAndLost"
];

const AdminDetails = () => {
	const { id } = useParams();

	const [roles, setRoles] = useState({});
	const [category, setCategory] = useState([]);
	const [city, setCity] = useState([]);
	const [categories, setCategories] = useState([]);
	const [cities, setCities] = useState([]);

	// ✅ Fetch categories from API
	const fetchCategories = async () => {
		try {
			const response = await fetch(`${config.API_BASE_URL}/categories`);
			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error("Failed to fetch categories:", error);
		}
	};

	// ✅ Fetch cities from API
	const fetchCities = async () => {
		try {
			const response = await fetch(`${config.API_BASE_URL}/cities`);
			const data = await response.json();
			setCities(data);
		} catch (error) {
			console.error("Failed to fetch cities:", error);
		}
	};

	const fetchUser = async () => {
		const token = sessionStorage.getItem("token");
		console.log(`admindetails() token: ${token}`);
		console.log(`fetch admins: `);
		try {
			const res = await axios.get(`${config.API_BASE_URL}/admins/permissions/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Cache-Control': 'no-cache',       // Prevent cached responses
					'Pragma': 'no-cache',              // Older HTTP 1.0 caches
					'Expires': '0'                     // Force immediate expiration
				},
			});

			console.log(`admin permiss: `, res.data);
			const user = res.data?.admin;
			console.log(`user: `, user);
			setRoles(user.roles || {});
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const handleRoleChange = (role) => {
		setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
	};

	const handleSubmit = async () => {
		const token = sessionStorage.getItem("token");
		console.log(`admindetails() token: ${token}`);
		try {
			console.log(`id: `, id);
			const res = await axios.put(`${config.API_BASE_URL}/admins/permissions/${id}`, {
				roles,
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Cache-Control': 'no-cache',
					'Pragma': 'no-cache',
					'Expires': '0',
				},
			});

			window.location.reload();
			toast.success("✅ User rights updated successfully");
		} catch (error) {
			console.error("Update failed:", error);
			alert("Something went wrong!");
		}
	};

	return (
		<div className="container mt-4">
			<h4 className="mb-4">Admin Role Permissions</h4>

			{/* Category Multi Select */}
			{/* <div className="mb-3">
				<label className="form-label">Select Categories</label>
				<Select
					isMulti
					placeholder="Select Categories"
					options={categories.map((cat) => ({
						label: cat.category_name,
						value: cat.category_name,
					}))}
					value={category.map((c) => ({ label: c.name, value: c.name }))}
					onChange={(selected) =>
						setCategory(selected.map((item) => ({ name: item.value })))
					}
				/>
			</div> */}

			{/* City Multi Select */}
			{/* <div className="mb-4">
				<label className="form-label">Select Cities</label>
				<Select
					isMulti
					placeholder="Select Cities"
					options={cities.map((c) => ({
						label: c.city_name,
						value: c.city_name,
					}))}
					value={city.map((c) => ({ label: c.name, value: c.name }))}
					onChange={(selected) =>
						setCity(selected.map((item) => ({ name: item.value })))
					}
				/>
			</div> */}

			{/* Role Checkboxes */}
			<div className="card p-4 mb-4">
				<h5 className="mb-3">Assign Roles</h5>
				<div className="row">
					{roleList.map((role) => (
						<div className="col-md-4 mb-2" key={role}>
							<div className="form-check">
								<input
									type="checkbox"
									className="form-check-input"
									id={`role-${role}`}
									checked={!!roles[role]}
									onChange={() => handleRoleChange(role)}
								/>
								<label className="form-check-label" htmlFor={`role-${role}`}>
									{role}
								</label>
							</div>
						</div>
					))}
				</div>
			</div>

			<button className="btn btn-primary" onClick={handleSubmit}>
				Save Rights
			</button>
		</div>
	);
};

export default AdminDetails;

