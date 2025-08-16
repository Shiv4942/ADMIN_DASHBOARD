import React, { useState } from 'react';

const EmailManagement = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const inboxEmails = [
    { 
      id: 1, 
      from: 'john.doe@company.com', 
      subject: 'Project Update Meeting', 
      preview: 'Hi, I wanted to discuss the latest updates on our project...',
      date: '2024-01-15 10:30',
      read: false,
      priority: 'high'
    },
    { 
      id: 2, 
      from: 'sarah.wilson@company.com', 
      subject: 'Budget Review Request', 
      preview: 'Could you please review the Q4 budget numbers...',
      date: '2024-01-15 09:15',
      read: true,
      priority: 'medium'
    },
    { 
      id: 3, 
      from: 'mike.brown@company.com', 
      subject: 'Client Presentation Feedback', 
      preview: 'Great work on the presentation! The client was very impressed...',
      date: '2024-01-14 16:45',
      read: true,
      priority: 'low'
    },
    { 
      id: 4, 
      from: 'lisa.garcia@company.com', 
      subject: 'Team Building Event', 
      preview: 'I\'m organizing a team building event next month...',
      date: '2024-01-14 14:20',
      read: false,
      priority: 'medium'
    },
  ];

  const sentEmails = [
    { 
      id: 1, 
      to: 'team@company.com', 
      subject: 'Weekly Status Report', 
      preview: 'Here\'s the weekly status report for all ongoing projects...',
      date: '2024-01-15 08:00'
    },
    { 
      id: 2, 
      to: 'client@example.com', 
      subject: 'Project Deliverables', 
      preview: 'Please find attached the latest project deliverables...',
      date: '2024-01-14 17:30'
    },
  ];

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: '📥', count: inboxEmails.filter(e => !e.read).length },
    { id: 'sent', label: 'Sent', icon: '📤' },
    { id: 'drafts', label: 'Drafts', icon: '📝' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const renderInbox = () => (
    <div className="flex space-x-4">
      {/* Email List */}
      <div className="w-1/2 space-y-2">
        {inboxEmails.map((email) => (
          <div 
            key={email.id} 
            className={`card p-4 cursor-pointer transition-colors duration-200 ${
              selectedEmail?.id === email.id ? 'ring-2 ring-primary-500' : ''
            } ${!email.read ? 'bg-blue-50' : ''}`}
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-sm">{getPriorityIcon(email.priority)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${!email.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {email.from}
                  </p>
                  <span className="text-sm text-gray-500">{email.date}</span>
                </div>
                <p className={`text-sm ${!email.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {email.subject}
                </p>
                <p className="text-sm text-gray-600 truncate">{email.preview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email Content */}
      <div className="w-1/2">
        {selectedEmail ? (
          <div className="card">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEmail.subject}</h3>
                <span className={`text-sm font-medium ${getPriorityColor(selectedEmail.priority)}`}>
                  {selectedEmail.priority} priority
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>From: {selectedEmail.from}</span>
                <span>{selectedEmail.date}</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">{selectedEmail.preview}</p>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="btn-primary">Reply</button>
                  <button className="btn-secondary">Forward</button>
                  <button className="btn-secondary">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card flex items-center justify-center h-64">
            <p className="text-gray-500">Select an email to view</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSent = () => (
    <div className="space-y-4">
      {sentEmails.map((email) => (
        <div key={email.id} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-900">To: {email.to}</p>
            <span className="text-sm text-gray-500">{email.date}</span>
          </div>
          <p className="font-semibold text-gray-900 mb-2">{email.subject}</p>
          <p className="text-gray-600">{email.preview}</p>
        </div>
      ))}
    </div>
  );

  const renderDrafts = () => (
    <div className="card p-8 text-center">
      <p className="text-gray-500">No draft emails found</p>
    </div>
  );

  const renderCompose = () => (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Email</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
          <input type="email" className="input-field" placeholder="recipient@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
          <input type="text" className="input-field" placeholder="Email subject" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
          <textarea 
            className="input-field h-32 resize-none" 
            placeholder="Type your message here..."
          ></textarea>
        </div>
        <div className="flex space-x-3">
          <button type="submit" className="btn-primary">Send Email</button>
          <button type="button" className="btn-secondary" onClick={() => setShowCompose(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600 mt-2">Manage your emails and communications.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCompose(true)}>
          Compose Email
        </button>
      </div>

      {showCompose ? (
        renderCompose()
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
            {activeTab === 'inbox' && renderInbox()}
            {activeTab === 'sent' && renderSent()}
            {activeTab === 'drafts' && renderDrafts()}
          </div>
        </>
      )}
    </div>
  );
};

export default EmailManagement;
