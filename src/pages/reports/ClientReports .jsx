import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { ApiURL } from '../../api';

const ClientReports = () => {
	const [clients, setClients] = useState([]);
	const [clientMap, setClientMap] = useState({});
	const [selectedClients, setSelectedClients] = useState([]);
	const [selectedYear, setSelectedYear] = useState('');
	const [selectedMonth, setSelectedMonth] = useState('');
	const [reportData, setReportData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [expandedRows, setExpandedRows] = useState(new Set());
	const [sortConfig, setSortConfig] = useState({
		key: 'totalGrandTotal',
		direction: 'desc'
	});

	// Fetch clients for dropdown
	useEffect(() => {
		const fetchClients = async () => {
			try {
				const res = await axios.get(`${ApiURL}/client/getallClients`);
				console.log('fetchClients res data: ', res.data.Client);
				const clientOptions = res.data.Client.map((client) => ({
					value: client._id,
					label: client.clientName || client.name
				}));
				// Create a map of client IDs to names
				const clientNameMap = {};
				res.data.Client.forEach(client => {
					clientNameMap[client._id] = client.clientName || client.name;
				});
				setClientMap(clientNameMap);
				setClients([
					{ value: 'ALL_CLIENTS', label: 'All Clients' },
					...clientOptions
				]);
			} catch (err) {
				setClients([]);
			}
		};
		fetchClients();
	}, []);

	const toggleExpand = (index) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedRows(newExpanded);
	};

	// Helper function to transform API response into client-wise data
	const transformResponse = (responseData) => {
		const clientData = {};

		responseData.orders.forEach(order => {
			const clientId = order.clientId;
			if (!clientData[clientId]) {
				clientData[clientId] = {
					_id: clientId,
					totalGrandTotal: 0,
					totalDiscount: 0,
					totalRoundOff: 0,
					invoices: []
				};
			}

			clientData[clientId].totalGrandTotal += order.netAmount;
			clientData[clientId].totalDiscount += order.discount;
			clientData[clientId].totalRoundOff += order.roundOff;
			clientData[clientId].invoices.push({
				_id: order.orderId,
				invoiceDate: order.orderDate,
				invoiceNumber: order.orderId,
				amount: order.netAmount
			});
		});

		return Object.values(clientData);
	};

	// Helper function to sort clients
	const sortClients = (clients) => {
		const { key, direction } = sortConfig;

		// Convert strings to numbers for sorting
		const sortKey = key === 'totalGrandTotal' || key === 'totalRoundOff' || key === 'diff'
			? (client) => Number(client[key])
			: (client) => client[key];

		return [...clients].sort((a, b) => {
			const aValue = sortKey(a);
			const bValue = sortKey(b);

			if (aValue < bValue) return direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return direction === 'asc' ? 1 : -1;
			return 0;
		});
	};

	// Handle column click
	const handleSort = (key) => {
		if (key === sortConfig.key) {
			// Toggle direction if same column is clicked
			setSortConfig({
				key,
				direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
			});
		} else {
			// Set new column and default to ascending
			setSortConfig({
				key,
				direction: 'asc'
			});
		}
	};

	// Get sort icon
	const getSortIcon = (key) => {
		if (key !== sortConfig.key) return null;
		return sortConfig.direction === 'asc' ? '▲' : '▼';
	};

	const handleClientSelect = (selectedOptions) => {
		if (!selectedOptions) {
			setSelectedClients([]);
			return;
		}
		// If "All Clients" is selected, select all except "All Clients"
		const isAllSelected = selectedOptions.some(opt => opt.value === "ALL_CLIENTS");
		if (isAllSelected) {
			setSelectedClients(
				clients
					.filter((opt) => opt.value !== "ALL_CLIENTS")
					.map((opt) => opt.value)
			);
		} else {
			setSelectedClients(selectedOptions.map((option) => option.value));
		}
	};

	const fetchReport = async () => {
		try {
			setLoading(true);

			if (!selectedYear || !selectedMonth) {
				setLoading(false);
				return;
			}

			const token = sessionStorage.getItem("token");
			console.log('selectedYear: ', selectedYear, "selected month: ", selectedMonth);

			const response = await axios.post(`${ApiURL}/report/clientReportByMonth`, {
				year: selectedYear,
				month: selectedMonth,
				clientIds: selectedClients.includes('ALL_CLIENTS') ? [] : selectedClients
			}, {
				headers: {
					'Authorization': `Bearer ${token}` // Add token in the Authorization header
				}
			});
			console.log('selectedYear: ', selectedYear, "selected month: ", selectedMonth, 'Report Data:', response.data);

			// Transform the response data into client-wise format
			const transformedData = transformResponse(response.data);
			setReportData(transformedData);
		} catch (error) {
			console.error('Error fetching report:', error);
		} finally {
			setLoading(false);
		}
	};

	const months = [
		{ value: '01', label: 'January' },
		{ value: '02', label: 'February' },
		{ value: '03', label: 'March' },
		{ value: '04', label: 'April' },
		{ value: '05', label: 'May' },
		{ value: '06', label: 'June' },
		{ value: '07', label: 'July' },
		{ value: '08', label: 'August' },
		{ value: '09', label: 'September' },
		{ value: '10', label: 'October' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'December' }
	];

	const years = Array.from({ length: 10 }, (_, i) => {
		const year = new Date().getFullYear() - i;
		return { value: year.toString(), label: year.toString() };
	});

	return (
		<div style={{ padding: '24px' }}>
			<Card>
				<Row className="mb-3" style={{ padding: 24 }}>
					<Col sm={4}>
						<h6 className="text-dark mb-2">Select Clients</h6>
						<Select
							isMulti
							options={clients}
							value={
								selectedClients.length === clients.length - 1 && clients.length > 1
									? clients
									: clients.filter((client) => selectedClients.includes(client.value))
							}
							onChange={handleClientSelect}
							placeholder="Select clients"
							getOptionLabel={(e) => e.label}
							getOptionValue={(e) => e.value}
							styles={{
								valueContainer: (base) => ({
									...base,
									maxHeight: 80,
									overflowY: 'auto',
									flexWrap: 'wrap',
								}),
								menu: (base) => ({
									...base,
									zIndex: 9999,
								}),
							}}
						/>
					</Col>
					<Col sm={4}>
						<select
							className="form-select"
							value={selectedYear}
							onChange={(e) => setSelectedYear(e.target.value)}
							style={{ width: '100%' }}
						>
							<option value="">Select Year</option>
							{years.map((year) => (
								<option key={year.value} value={year.value}>
									{year.label}
								</option>
							))}
						</select>
					</Col>
					<Col sm={4}>
						<select
							className="form-select"
							value={selectedMonth}
							onChange={(e) => setSelectedMonth(e.target.value)}
							style={{ width: '100%' }}
						>
							<option value="">Select Month</option>
							{months.map((month) => (
								<option key={month.value} value={month.value}>
									{month.label}
								</option>
							))}
						</select>
					</Col>
					<Col sm={2}>
						<Button
							variant="primary"
							onClick={fetchReport}
							disabled={loading || !selectedYear || !selectedMonth}
							style={{ width: '100%', backgroundColor: "#BD5525", border: "#BD5525", }}
						>
							{loading ? 'Loading...' : 'Generate Report'}
						</Button>
					</Col>
				</Row>
				<Table striped bordered hover>
					<thead>
						<tr>
							{/* <th onClick={() => handleSort('clientName')} style={{ width: '40%' }}> */}
							<th>
								Client Name {getSortIcon('clientName')}
							</th>
							<th onClick={() => handleSort('totalGrandTotal')} style={{ width: '15%' }}>
								Grand Total {getSortIcon('totalGrandTotal')}
							</th>
							<th onClick={() => handleSort('totalRoundOff')} style={{ width: '15%' }}>
								RoundOff Total {getSortIcon('totalRoundOff')}
							</th>
							{/* <th onClick={() => handleSort('discount')} style={{ width: '15%' }}>
								Discount {getSortIcon('discount')}
							</th> */}
							{/* <th onClick={() => handleSort('diff')} style={{ width: '15%' }}> */}
							<th >
								Diff {getSortIcon('diff')}
							</th>
						</tr>
					</thead>
					<tbody>
						{sortClients(reportData).map((clientData, index) => (
							<React.Fragment key={clientData._id}>
								{console.log(`clientData: `, clientData)}
								<tr onClick={() => toggleExpand(index)} style={{ cursor: 'pointer' }}>
									<td style={{ width: '40%' }}>
										{clientMap[clientData._id] || 'Unknown Client'}
									</td>
									<td style={{ width: '15%' }}>
										₹{clientData.totalGrandTotal.toLocaleString()}
									</td>
									<td style={{ width: '15%' }}>
										₹{clientData.totalRoundOff.toLocaleString()}
									</td>
									{/* <td style={{ width: '15%' }}>
										₹{clientData.totalDiscount.toLocaleString()}
									</td> */}
									<td style={{ width: '15%' }}>
										₹{(clientData.totalGrandTotal - clientData.totalRoundOff).toLocaleString()}
									</td>
								</tr>
								{expandedRows.has(index) && (
									<tr>
										<td colSpan={4} style={{ padding: '10px' }}>
											<Table bordered>
												<thead>
													<tr>
														<th>Invoice Date</th>
														<th>Invoice Number</th>
														<th>Amount</th>
													</tr>
												</thead>
												<tbody>
													{clientData.invoices?.map((invoice) => (
														<tr key={invoice._id}>
															<td>{moment(invoice.invoiceDate).format('DD/MM/YYYY')}</td>
															<td>{invoice.invoiceNumber}</td>
															<td>₹{invoice.amount.toLocaleString()}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</td>
									</tr>
								)}
							</React.Fragment>
						))}
					</tbody>
				</Table>
			</Card>
		</div>
	);
};

export default ClientReports;