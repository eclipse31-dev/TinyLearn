import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import '../../styles/discussion.css';

export default function DiscussionPage() {
  const [discussions, setDiscussions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="discussion-page">
        <div className="page-header">
          <h1>Discussion Forum</h1>
          <p>Collaborate and discuss with your peers.</p>
        </div>

        <div className="discussion-container">
          <div className="discussion-toolbar">
            <input type="text" placeholder="Search discussions..." className="search-input" />
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              New Discussion
            </button>
          </div>

          <div className="discussion-list">
            {/* Your content goes here */}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          title="Start New Discussion"
          onClose={() => setIsModalOpen(false)}
          size="medium"
        >
          <div className="modal-form">
            {/* Your form content goes here */}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
