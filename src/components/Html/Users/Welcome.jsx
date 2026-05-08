import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import '../../CSS/./task.css';


function Welcome() {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

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
          <img id="logo2" src="/Vend-X-logo-final-1.png" alt="VENDX Logo" />
          <h1 id="welcome-title">
            Welcome to vendx <span id="user-name">{user.First_Name} {user.Last_Name}</span>
          </h1>
          <p id='p1'>Welcome to VENDX Warehouse Management system here you can do...</p>
          <div id="features">
            <p>Tracking of your Inventory</p>
            <p>Add Stock into inventory</p>
            <p>Order Products Online</p>
          </div>
          <p id='p2'>**************************** HAVE A SEEMLESS EXPERIENCE ***************************</p><br />
          <div id="btn-div2">
            <button id="btn" onClick={() => navigate('/login')}>Back to Login</button>
            <button id="btn" onClick={() => navigate('/update', { state: { user } })}>Update profile</button>
            <button id="btn" onClick={() => navigate('/delete', { state: { user } })}>Delete profile</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;
