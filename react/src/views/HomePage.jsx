import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/home.css';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="home-page">
        {/* Page Header */}
        <div className="page-header-welcome">
          <h1>Home</h1>
        </div>

        <div className="dashboard-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Your content goes here */}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Your content goes here */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
