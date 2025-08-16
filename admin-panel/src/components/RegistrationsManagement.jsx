import React, { useState } from 'react';

const RegistrationsManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const pendingRegistrations = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@example.com', 
      role: 'Developer',
      registrationDate: '2024-01-15',
      status: 'Pending Approval',
      source: 'Website Form'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@company.com', 
      role: 'Designer',
      registrationDate: '2024-01-14',
      status: 'Pending Approval',
      source: 'Referral'
    },
    { 
      id: 3, 
      name: 'Mike Davis', 
      email: 'mike.davis@startup.io', 
      role: 'Product Manager',
      registrationDate: '2024-01-13',
      status: 'Pending Approval',
      source: 'LinkedIn'
    },
  ];

  const approvedUsers = [
    { 
      id: 4, 
      name: 'Emily Wilson', 
      email: 'emily.w@techcorp.com', 
      role: 'Frontend Developer',
      registrationDate: '2024-01-10',
      approvalDate: '2024-01-12',
      status: 'Active',
      lastLogin: '2024-01-15'
    },
    { 
      id: 5, 
      name: 'David Brown', 
      email: 'david.brown@innovate.com', 
      role: 'UX Designer',
      registrationDate: '2024-01-08',
      approvalDate: '2024-01-09',
      status: 'Active',
      lastLogin: '2024-01-14'
    },
  ];

  const rejectedUsers = [
    { 
      id: 6, 
      name: 'Alex Thompson', 
      email: 'alex.t@spam.com', 
      role: 'Developer',
      registrationDate: '2024-01-11',
      rejectionDate: '2024-01-12',
      status: 'Rejected',
      reason: 'Suspicious email domain'
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', icon: '⏳', count: pendingRegistrations.length },
    { id: 'approved', label: 'Approved', icon: '✅', count: approvedUsers.length },
    { id: 'rejected', label: 'Rejected', icon: '❌', count: rejectedUsers.length },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPending = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pending Approvals</h3>
        <div className="flex space-x-2">
          <button className="btn-primary">Approve All</button>
          <button className="btn-secondary">Reject All</button>
        </div>
      </div>
      <div className="grid gap-4">
        {pendingRegistrations.map((user) => (
          <div key={user.id} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
                <p className="text-sm text-gray-600">Registered: {user.registrationDate}</p>
                <p className="text-sm text-gray-600">Source: {user.source}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    onClick={() => handleApprove(user.id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    onClick={() => handleReject(user.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApproved = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Approved Users</h3>
        <button className="btn-secondary">Export List</button>
      </div>
      <div className="grid gap-4">
        {approvedUsers.map((user) => (
          <div key={user.id} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
                <p className="text-sm text-gray-600">Approved: {user.approvalDate}</p>
                <p className="text-sm text-gray-600">Last Login: {user.lastLogin}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    onClick={() => handleViewDetails(user)}
                  >
                    View Details
                  </button>
                  <button 
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    onClick={() => handleDeactivate(user.id)}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRejected = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Rejected Users</h3>
        <button className="btn-secondary">Clear History</button>
      </div>
      <div className="grid gap-4">
        {rejectedUsers.map((user) => (
          <div key={user.id} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
                <p className="text-sm text-gray-600">Rejected: {user.rejectionDate}</p>
                <p className="text-sm text-gray-600">Reason: {user.reason}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <button 
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                  onClick={() => handleReapprove(user.id)}
                >
                  Re-approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserDetails = () => (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => setShowUserDetails(false)}
        >
          ✕
        </button>
      </div>
      {selectedUser && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="text-gray-900">{selectedUser.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                {selectedUser.status}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="btn-primary">Edit User</button>
              <button className="btn-secondary">Send Message</button>
              <button className="btn-secondary">View Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Mock handler functions
  const handleApprove = (userId) => {
    console.log('Approving user:', userId);
    // In a real app, this would make an API call
  };

  const handleReject = (userId) => {
    console.log('Rejecting user:', userId);
    // In a real app, this would make an API call
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleDeactivate = (userId) => {
    console.log('Deactivating user:', userId);
    // In a real app, this would make an API call
  };

  const handleReapprove = (userId) => {
    console.log('Re-approving user:', userId);
    // In a real app, this would make an API call
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrations Management</h1>
        <p className="text-gray-600 mt-2">Manage user registrations, approvals, and user accounts.</p>
      </div>

      {showUserDetails ? (
        renderUserDetails()
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'pending' && renderPending()}
            {activeTab === 'approved' && renderApproved()}
            {activeTab === 'rejected' && renderRejected()}
          </div>
        </>
      )}
    </div>
  );
};

export default RegistrationsManagement;
