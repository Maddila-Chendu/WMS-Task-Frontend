import React, { useEffect, useState } from 'react';
import '../../CSS/task.css';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const Bins = () => {
    const [formdata, setformdata] = useState({
        bin_name: "",
        max_quantity: "",
        location: ""
    });
    const [bins, setBins] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        if (user) {
            fetchBins();
        }
    }, [user]);

    const fetchBins = async () => {
        try {
            const response = await fetch('http://localhost:8080/getBins');
            const data = await response.json();
            if (response.ok) {
                setBins(data.data || []);
            } else {
                console.error(data.message || "Failed to fetch bins");
            }
        } catch (err) {
            console.error("Error fetching bins:", err);
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleFormChange = (e) => {
        setformdata({ ...formdata, [e.target.id]: e.target.value });
    };
    const handleAddClick = () => {
        setShowAddForm(true);
    };
    const cancelAdd = () => {
        setShowAddForm(false);
        setError('');
        setMessage('');
        setformdata({ bin_name: "", max_quantity: "", location: "" });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!formdata.bin_name || !formdata.max_quantity || !formdata.location) {
            setError('Please fill in all fields');
            return;
        }

        const max_quantity = Number(formdata.max_quantity);
        if (Number.isNaN(max_quantity) || max_quantity <= 0) {
            setError('Max Quantity must be a positive number');
            return;
        }

        if (max_quantity > 1000) {
            setError('Maximum Capacity should be 1000');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/bins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bin_name: formdata.bin_name,
                    max_quantity: max_quantity,
                    location: formdata.location,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Bin added successfully');
                setformdata({ bin_name: "", max_quantity: "", location: "" });
                setShowAddForm(false);
                fetchBins();
            } else {
                setError(data.error || 'Failed to add bin');
            }
        } catch (err) {
            setError('An error occurred while adding the bin');
        }
         
    };
    const handleNavigatePage = (path) => {
        navigate(path, { state: { user } });
    };

    return (
        <div id="page-layout">
            <aside id="sidebar">
                <div id="sidebar-title">Menu</div>
                <button id="sidebar-link" onClick={() => handleNavigatePage('/products')}>
                    Products
                </button>
                <button id="sidebar-link" onClick={() => handleNavigatePage('/orders')}>
                    Orders
                </button>
                <button id="sidebar-link" onClick={() => handleNavigatePage('/inventory')}>
                    Inventory
                </button>
                <button id="sidebar-link" onClick={() => handleNavigatePage('/bins')}>
                    Bins
                </button>
            </aside>
            <main id="main-content">
                <div id="card2">
                <img id="logo1" src="/Vend-X-logo-final-1.png" alt="VENDX Logo" />
                    <h2 className="products-title">All Bins</h2>
                    <button id="btn" onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '20px' }}>
                        {showAddForm ? 'Cancel' : 'Add Bin'}
                    </button>

                    {showAddForm && (
                        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            {message && <p id="success-text" className="success-message">{message}</p>}
                            <form onSubmit={handleAddSubmit} id="form2">
                                <div id="group">
                                    <label htmlFor="bin_name">Bin Name</label>
                                    <input
                                        type="text"
                                        id="bin_name"
                                        placeholder="Enter Bin Name"
                                        value={formdata.bin_name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div id="group">
                                    <label htmlFor="max_quantity">Max Quantity</label>
                                    <input
                                        type="text"
                                        id="max_quantity"
                                        placeholder="Enter Max Quantity"
                                        value={formdata.max_quantity}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div id="group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        placeholder="Enter Location"
                                        value={formdata.location}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div><br />
                                <button type="submit" id="btn" style={{ width: '120px' }}>
                                    Add Bin
                                </button>
                            </form>
                        </div>
                    )}
                    <div className="message-container">
                        {message && <p id="success-text" className="success-message">{message}</p>}
                    {error && <p id="error-text" className="error-message">{error}</p>}
                    </div>

                    {bins.length === 0 ? (
                        <p className="no-products-msg">No bins available.</p>
                    ) : (
                        <div className="table-container">
                            <table className="bins-table">
                                <thead>
                                    <tr>
                                        <th>Bin ID</th>
                                        <th>Bin Name</th>
                                        <th>Max Quantity</th>
                                        <th>Location</th>
                                        <th>Created Date</th>
                                        <th>Updated Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bins.map((bin) => (
                                        <tr key={bin.id}>
                                            <td>{bin.id}</td>
                                            <td>{bin.bin_name}</td>
                                            <td>{bin.max_quantity}</td>
                                            <td>{bin.location}</td>
                                            <td>{new Date(bin.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(bin.updatedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div id="btn-div" className="back-to-home-container">
                        <button id="btn" type="button" onClick={() => navigate('/welcome', { state: { user } })} className="btn-back-home">
                            Back to Home
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Bins;
                               