import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, Trash2, Edit2, Lock, CheckCircle, XCircle } from 'lucide-react';
import '../../styles/admin.css';

export default function UserManagement() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
      });
      
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(
        `http://localhost:8000/api/users?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/users/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(
        `http://localhost:8000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting user');
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password (min 8 characters):');
    if (!newPassword || newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    const confirmPassword = prompt('Confirm password:');
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/users/${userId}/reset-password`,
        { password: newPassword, password_confirmation: confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password reset successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Error resetting password');
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-container">
        <div className="admin-header">
          <h1>User Management</h1>
          <p>Manage system users and their roles</p>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">No users found</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_ID}>
                    <td>{user.FName} {user.LName}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className="role-badge">
                        {user.roles?.[0]?.role || 'unassigned'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleToggleStatus(user.user_ID)}
                        className="action-btn toggle-btn"
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {user.is_active ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </button>
                      <button
                        onClick={() => handleResetPassword(user.user_ID)}
                        className="action-btn reset-btn"
                        title="Reset Password"
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.user_ID)}
                        className="action-btn delete-btn"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
