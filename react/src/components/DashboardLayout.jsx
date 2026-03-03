        import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import QuickActions from './QuickActions';
import RealTimeNotifications from './RealTimeNotifications';
import '../styles/dashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <RealTimeNotifications />
      <QuickActions />
      <div className="layout-wrapper">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <Breadcrumb />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
