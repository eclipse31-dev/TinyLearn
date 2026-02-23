import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/dashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <div className="layout-wrapper">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
