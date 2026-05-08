import React, { useEffect, useState } from 'react';
import '../../CSS/task.css';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';


const Inventory = () => {
    const [formdata, setFormdata] = useState({
        productId: '',
        quantity: '',
        bin_name: '',
        expiryDate: '',
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [bins, setBins] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        if (user) {
            fetchInventory();
            fetchProducts();
            fetchBins();
        }
    }, [user]);


    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleFormChange = (e) => {
        setFormdata({ ...formdata, [e.target.id]: e.target.value });
    };

    const handleAddInventory = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!formdata.productId || !formdata.quantity || !formdata.bin_name || !formdata.expiryDate) {
            setError('Please fill in all fields');
            return;
        }

        const quantity = Number(formdata.quantity);
        if (Number.isNaN(quantity) || quantity <= 0) {
            setError('Quantity must be a positive number');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/IBatch', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: formdata.productId,
                    quantity: quantity,
                    bin_name: formdata.bin_name,
                    expiryDate: formdata.expiryDate,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Stock added successfully');
                setFormdata({ productId: '', quantity: '', bin_name: '', expiryDate: '' });
                setShowAddForm(false);
                fetchInventory();
            } else {
                setError(data.message || data.error || 'Failed to add stock');
            }
        } catch (err) {
            console.error('Add stock error:', err);
            setError('An error occurred while adding the stock');
        }
    };

    const fetchInventory = async () => {
        setError('');
        setMessage('');
        try {
            const response = await fetch('http://localhost:8080/getIBatch', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                const batchesArray = data.data ?? [];
                if (Array.isArray(batchesArray)) {
                    setInventory(batchesArray);
                } else {
                    setError('Invalid data format received from server');
                }
            } else {
                setError(data.error || 'Failed to fetch inventory');
            }
        } catch (err) {
            setError('An error occurred while fetching inventory');
        }
    };

    const handleNavigatePage = (path) => {
        navigate(path, { state: { user } });
    };
    const handleProductSelection = (e) => {
        setFormdata({ ...formdata, productId: e.target.value });
    };
    const handleBinSelection = (e) => {
        setFormdata({ ...formdata, bin_name: e.target.value });
    };
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/getProduct', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                const productsArray = data.data ?? [];
                if (Array.isArray(productsArray)) {
                    setProducts(productsArray);
                } else {
                    console.error('Invalid products data format received from server');
                }
            } else {
                console.error(data.error || 'Failed to fetch products');
            }
        } catch (err) {
            console.error('An error occurred while fetching products');
        }
    };

    const fetchBins = async () => {
        try {
            const response = await fetch('http://localhost:8080/getBins', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                const binsArray = data.data ?? [];
                if (Array.isArray(binsArray)) {
                    setBins(binsArray);
                } else {
                    console.error('Invalid bins data format received from server');
                }
            } else {
                console.error(data.error || 'Failed to fetch bins');
            }
        } catch (err) {
            console.error('An error occurred while fetching bins');
        }
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
                    <h2 className="products-title">All Inventory</h2>
                    
                    <button id="btn" onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '20px' }}>
                        {showAddForm ? 'Cancel' : 'Add Inventory'}
                    </button>

                    {showAddForm && (
                        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            <form onSubmit={handleAddInventory} id="form2">
                                <div id="group">
                                    <label htmlFor="productId">Product Name</label>
                                    <select
                                        type="select"
                                        id="productId"
                                        onChange={handleProductSelection}
                                        required
                                    >
                                        <option value="">Select Product Name</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div id="group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        placeholder="Enter Quantity"
                                        min="1"
                                        value={formdata.quantity}
                                        onChange={handleFormChange}
                                        required   
                                    />
                                </div>
                                <div id="group">
                                    <label htmlFor="bin_name">Bin Name</label>
                                    <select
                                        id="bin_name"
                                        value={formdata.bin_name}
                                        onChange={handleBinSelection}
                                        required   
                                    >
                                        <option value="">Select Bin Name</option>
                                        {bins.map((bin) => (
                                            <option key={bin.bin_name} value={bin.bin_name}>
                                                {bin.bin_name}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                                <div id="group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="date"
                                        id="expiryDate"
                                        placeholder='Select Expiry Date'
                                        value={formdata.expiryDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div><br />
                                <button type="submit" id="btn" style={{ width: '150px' }}>
                                    Add Inventory
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="message-container">
                        {message && <p id="success-text" className="success-message">{message}</p>}
                        {error && <p className="error error-message">{error}</p>}
                    </div>

                    {inventory.length === 0 ? (
                        <p className="no-products-msg">No inventory available.</p>
                    ) : (
                        <div className="table-container">
                            <table className="bins-table">
                                <thead>
                                    <tr>
                                        <th>Batch ID</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Remaining Quantity</th>
                                        <th>Expiry Date</th>
                                        <th>Bin Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item) => (
                                        <tr key={item.id || Math.random()}>
                                            <td>{item.id || 'N/A'}</td>
                                            <td>{item.product?.name || item.productId || 'N/A'}</td>
                                            <td>{item.quantity ?? 'N/A'}</td>
                                            <td>{item.remainingQuantity ?? 'N/A'}</td>
                                            <td>
                                                {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : (item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A')}
                                            </td>
                                            <td>{item.bin?.bin_name || item.bin_name || 'N/A'}</td>
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

export default Inventory;