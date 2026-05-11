import React, { useState } from 'react';

function AssignUserModal({ bus, users, onClose, onAssign }) {
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert('Please select a user to assign.'); // It is better to use a toast instead of this
      return;
    }
    onAssign(selectedUserId);
  };

  return (
    // Modal background (overlay)
    <div className="modal-overlay">
      {/* Modal content box */}
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">
          &times;
        </button>
        <h2>Assign Bus to User</h2>
        <p>
          You are assigning bus <strong>{bus.busNumber}</strong>.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userSelect">Select a User:</label>
            <select
              id="userSelect"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Choose a user --
              </option>
              {/* Show all users in the dropdown */}
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignUserModal;