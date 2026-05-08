import React, { useEffect, useState } from 'react';
import '../../CSS/task.css';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const fetchOrders = async () => {
        setError('');
        setMessage('');
        try {
            const response = await fetch('http://localhost:8080/getOrders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json(); 
            if (response.ok) {
                const ordersArray = data.orders ?? data.data ?? [];
                if (Array.isArray(ordersArray)) {
                    setOrders(ordersArray);
                } else {
                    setError('Invalid data format received from server');
                }   
            } else {
                setError(data.error || 'Failed to fetch orders');
            }
        } catch (err) {
            setError('An error occurred while fetching orders');
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
                    <h2 className="products-title">All Orders</h2>
                    {message && <p id="success-text" className="success-message">{message}</p>}
                    {error && <p className="error error-message">{error}</p>}

                    {orders.length === 0 ? (
                        <p className="no-products-msg">No orders available.</p>
                    ) : (
                        <div className="table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Product</th>
                                        <th>Quantity Requested</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id || Math.random()}>
                                            <td>{order.id || 'N/A'}</td>
                                            <td>{order.product?.name || order.productId || 'N/A'}</td>
                                            <td>{order.quantityRequested}</td>
                                            <td>{order.status || 'N/A'}</td>
                                            <td>
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A')}
                                            </td>
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

export default Orders;