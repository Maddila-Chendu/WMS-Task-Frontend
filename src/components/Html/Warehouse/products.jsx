import React, { useEffect, useState } from 'react';
import '../../CSS/task.css';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const Products = () => {
    const [formdata, setformdata] = useState({
        name: "",
        description: ""
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [products, setProducts] = useState([]);
    const setInventoryCounts = useState({});
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showInventoryDetails, setShowInventoryDetails] = useState(false);
    const [inventoryDetails, setInventoryDetails] = useState([]);
    const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);
    const [bins, setBins] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        if (user) {
            fetchProducts();
            fetchInventoryCounts();
            fetchBins();
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleFormChange = (e) => {
        setformdata({ ...formdata, [e.target.id]: e.target.value });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        await addProduct();
    };

    const addProduct = async () => {
        setError('');
        setMessage('');
        try{
            const response = await fetch('http://localhost:8080/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Product added successfully');
                setformdata({ name: "", description: "" });
                setShowAddForm(false);
                fetchProducts();
            } else {
                setError(data.error || data.message || 'Failed to add product');
            }
        } catch (err){
            setError('An error occurred while adding product');
        }   
    };

    const fetchProducts = async () => {
        setError('');
        setMessage('');
        try {
            const response = await fetch('http://localhost:8080/getProduct');
            const data = await response.json();
            if (response.ok) {
                const productsArray = data.data ?? data.products ?? [];
                if (Array.isArray(productsArray)) {
                    setProducts(productsArray);
                } else {
                    setError('Invalid response format');
                }
            } else {
                setError(data.error || data.message || 'Failed to fetch products');
            }
        } catch (err) {
            setError('An error occurred while fetching products');
        }
    };

    const fetchInventoryCounts = async () => {
        try {
            const response = await fetch('http://localhost:8080/getIBatch');
            const data = await response.json();
            if (response.ok) {
                const batches = data.data ?? [];
                const counts = {};
                if (Array.isArray(batches)) {
                    batches.forEach((batch) => {
                        const productId = batch.productId || batch.product?.id;
                        const remaining = Number(batch.remainingQuantity ?? 0);
                        if (productId) {
                            counts[productId] = (counts[productId] || 0) + remaining;
                        }
                    });
                }
                setInventoryCounts(counts);
            }
        } catch (err) {
            console.error('Error fetching inventory counts:', err);
        }
    };

    const fetchBins = async () => {
        try {
            const response = await fetch('http://localhost:8080/getBins');
            const data = await response.json();
            if (response.ok) {
                setBins(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching bins:', err);
        }
    };

    const handleViewInventory = async (product) => {
        setError('');
        setMessage('');
        
        // If already showing details for this product, hide them
        if (showInventoryDetails && selectedProductForDetails?.id === product.id) {
            setShowInventoryDetails(false);
            setSelectedProductForDetails(null);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/getIBatch');
            const data = await response.json();
            if (response.ok) {
                const batches = data.data ?? [];
                const productBatches = batches.filter(batch => 
                    (batch.productId === product.id) || (batch.product?.id === product.id)
                );
                
                const detailedBatches = productBatches.map(batch => {
                    const binInfo = bins.find(b => b.bin_name === batch.bin_name);
                    return {
                        ...batch,
                        location: binInfo ? binInfo.location : 'N/A'
                    };
                });

                setInventoryDetails(detailedBatches);
                setSelectedProductForDetails(product);
                setShowInventoryDetails(true);
            } else {
                setError('Failed to fetch inventory details');
            }
        } catch (err) {
            setError('An error occurred while fetching inventory details');
        }
    };

    const handleSelectProduct = (productId) => {
        setError('');
        setMessage('');
        if (selectedProductId === productId) {
            setSelectedProductId(null);
            setOrderQuantity('');
            return;
        }
        setSelectedProductId(productId);
        setOrderQuantity('');
    };

    const handleQuantityChange = (e) => {
        setOrderQuantity(e.target.value);
    };

    const handleCreateOrder = async (productId) => {
        setError('');
        setMessage('');

        const quantity = Number(orderQuantity);
        if (!orderQuantity || Number.isNaN(quantity) || quantity <= 0) {
            setError('Please enter a valid count');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantityRequested: quantity }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('order created successfully');
                setSelectedProductId(null);
                setOrderQuantity('');
                fetchInventoryCounts();
            } else {
                setError(data.error || data.message || 'Failed to create order');
            }
        } catch (err) {
            setError('An error occurred while creating order');
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
                    <h2 className="products-title">All Products</h2>
                     {message && <p id="success-text" className="success-message">{message}</p>}
                    {error && <p className="error error-message">{error}</p>}
                    <button id="btn" onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '20px' }}>
                        {showAddForm ? 'Cancel' : 'Add Product'}
                    </button>

                    {showAddForm && (
                        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                           
                            <form onSubmit={handleCreateProduct} id="form2">
                                <div id="group">
                                    <label htmlFor="name">Product Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter Product Name"
                                        value={formdata.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div id="group">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        placeholder="Enter Description"
                                        value={formdata.description}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div><br />
                                <button type="submit" id="btn" style={{ width: '120px' }}>
                                    Add Product
                                </button>
                            </form>
                        </div>
                    )}
                    {/* <div className="message-container">
                            {message && <p id="success-text" className="success-message">{message}</p>}
                        {error && <p className="error error-message">{error}</p>}
                    </div> */}

                    {products.length === 0 ? (
                        <p className="no-products-msg">No products available.</p>
                    ) : (
                        <div className="table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <React.Fragment key={product.id}>
                                            <tr key={product.id} className={selectedProductForDetails?.id === product.id ? 'active-row' : ''}>
                                                <td>
                                                    <button 
                                                        className="product-link-btn" 
                                                        onClick={() => handleViewInventory(product)}
                                                        title="View Inventory Details"
                                                    >
                                                        {product.name}
                                                    </button>
                                                </td>
                                                <td>{product.description}</td>
                                                <td className="text-center">
                                                    {selectedProductId === product.id ? (
                                                        <div className="order-entry-container">
                                                            <label htmlFor={`quantity-${product.id}`} className="order-entry-label">Enter the count</label>
                                                            <input
                                                                id={`quantity-${product.id}`}
                                                                type="number"
                                                                min="1"
                                                                value={orderQuantity}
                                                                onChange={handleQuantityChange}
                                                                placeholder="e.g. 100, 200, 500"
                                                                className="order-entry-input"
                                                            />
                                                            <div className="order-buttons-group">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCreateOrder(product.id)}
                                                                    className="btn-confirm-order"
                                                                >
                                                                    Confirm Order
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSelectProduct(product.id)}
                                                                    className="btn-cancel-order"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            id="btn"
                                                            type="button"
                                                            onClick={() => handleSelectProduct(product.id)}
                                                            className="btn-order"
                                                        >
                                                            Order
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            {showInventoryDetails && selectedProductForDetails?.id === product.id && (
                                                <tr className="inventory-detail-row">
                                                    <td colSpan="3">
                                                        <div className="inventory-detail-container">
                                                            <div className="detail-header">
                                                                <h4>Stock breakdown for {product.name}</h4>
                                                                <button className="close-inline-btn" onClick={() => setShowInventoryDetails(false)}>&times;</button>
                                                            </div>
                                                            {inventoryDetails.length === 0 ? (
                                                                <p className="no-data-msg">No inventory found for this product.</p>
                                                            ) : (
                                                                <table className="inventory-inner-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Bin Name</th>
                                                                            <th>Location</th>
                                                                            <th>Initial Stock</th>
                                                                            <th>Remaining</th>
                                                                            <th>Expiry</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {inventoryDetails.map((item, index) => (
                                                                            <tr key={item.id || index}>
                                                                                <td>{item.bin_name || 'N/A'}</td>
                                                                                <td>{item.location}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>{item.remainingQuantity}</td>
                                                                                <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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

export default Products;
