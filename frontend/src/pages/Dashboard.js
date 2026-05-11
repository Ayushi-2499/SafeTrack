import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import busService from '../features/buses/busService';
import userService from '../features/users/userService';
import Map from '../components/Map';
import AssignUserModal from '../components/AssignUserModal';

// --- Depot Gate Location constant has been removed ---

function Dashboard() {
  const navigate = useNavigate();
  // --- Buses state will now include isDoorOpen property ---
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    busNumber: '',
    driverName: '',
    route: '',
  });

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  // --- Global busDoorStatus state removed ---

  const { busNumber, driverName, route } = formData;
  const { user } = {
    user: JSON.parse(localStorage.getItem('user')),
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const busData = await busService.getBuses(user.token);
        // --- Initialize isDoorOpen for each bus ---
        const busesWithDoorStatus = busData.map(bus => ({ ...bus, isDoorOpen: false }));
        setBuses(busesWithDoorStatus);
        // ------------------------------------------
        if (user.role === 'admin') {
          const allUsers = await userService.getAllUsers(user.token);
          setUsers(allUsers.filter((u) => u.role === 'user'));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Could not fetch required data');
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBusData = await busService.createBus(formData, user.token);
      // --- Add new bus with door status ---
      setBuses([...buses, { ...newBusData, isDoorOpen: false }]);
      // ---------------------------------
      setFormData({ busNumber: '', driverName: '', route: '' });
      toast.success('New bus added successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busService.deleteBus(busId, user.token);
        setBuses(buses.filter((bus) => bus._id !== busId));
        toast.success('Bus deleted successfully!');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Could not delete bus');
      }
    }
  };

  // --- Helper to update buses state while preserving isDoorOpen ---
  const updateBusState = (updatedBusData) => {
    setBuses(currentBuses =>
      currentBuses.map(b =>
        b._id === updatedBusData._id ? { ...b, ...updatedBusData } : b
      )
    );
  };
  // -------------------------------------------------------------

  const handleIncreaseSpeed = async (bus) => {
    const newSpeed = bus.currentSpeed + 10;
    try {
      const updatedBusData = await busService.updateBus(bus._id, { currentSpeed: newSpeed }, user.token);
      updateBusState(updatedBusData); // Use helper function
      if (updatedBusData.isOverSpeeding) {
        toast.error(`ALERT: Bus ${updatedBusData.busNumber} is over-speeding!`);
      }
    } catch (error) {
      toast.error('Could not update speed');
    }
  };

  const handleDecreaseSpeed = async (bus) => {
    let newSpeed = bus.currentSpeed - 10;
    if (newSpeed < 0) newSpeed = 0;
    try {
      const updatedBusData = await busService.updateBus(bus._id, { currentSpeed: newSpeed }, user.token);
      updateBusState(updatedBusData); // Use helper function
    } catch (error) {
      toast.error('Could not update speed');
    }
  };

  const handleIncreaseOccupancy = async (bus) => {
    const newOccupancy = bus.currentOccupancy + 1;
    try {
      const updatedBusData = await busService.updateBus(bus._id, { currentOccupancy: newOccupancy }, user.token);
      updateBusState(updatedBusData); // Use helper function
      if (updatedBusData.isOverCapacity) {
        toast.error(`ALERT: Bus ${updatedBusData.busNumber} is over-capacity!`);
      }
    } catch (error) {
      toast.error('Could not update occupancy');
    }
  };

  const handleDecreaseOccupancy = async (bus) => {
    if (bus.currentOccupancy > 0) {
      const newOccupancy = bus.currentOccupancy - 1;
      try {
        const updatedBusData = await busService.updateBus(bus._id, { currentOccupancy: newOccupancy }, user.token);
        updateBusState(updatedBusData); // Use helper function
      } catch (error) {
        toast.error('Could not update occupancy');
      }
    }
  };

  const openAssignModal = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const closeAssignModal = () => {
    setSelectedBus(null);
    setIsModalOpen(false);
  };

  const handleAssignUser = async (userId) => {
    if (!selectedBus || !userId) return;
    try {
      const updatedBusData = await busService.assignUserToBus(selectedBus._id, userId, user.token);
      updateBusState(updatedBusData); // Use helper function
      toast.success(`User assigned to bus ${selectedBus.busNumber} successfully!`);
      closeAssignModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to assign user.');
    }
  };

  const handleUnassignUser = async (busId, userId) => {
    if (window.confirm('Are you sure you want to remove this user from the bus?')) {
      try {
        const updatedBusData = await busService.unassignUserFromBus(busId, userId, user.token);
        updateBusState(updatedBusData); // Use helper function
        toast.warn('User unassigned successfully.');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to unassign user.');
      }
    }
  };

  // --- Function to handle the door simulation FOR A SPECIFIC BUS ---
  // --- UPDATED with speed check ---
  const handleBusDoorSimulation = (busId) => {
    // Find the bus that was clicked
    const targetBus = buses.find(bus => bus._id === busId);

    // --- ADDED THIS CHECK ---
    // Prevent opening if bus is moving or door is already open
    if (!targetBus || targetBus.isDoorOpen || targetBus.currentSpeed > 0) {
        if (targetBus && targetBus.currentSpeed > 0) {
            // Show warning only if the reason is speed
            toast.warn(`Cannot open door while bus ${targetBus.busNumber} is moving!`);
        }
        return; // Exit the function early
    }
    // ----------------------

    console.log(`BUS SENSOR (${targetBus.busNumber}): Student detected at door!`);
    toast.info(`Student detected at door of bus ${targetBus.busNumber}. Opening door.`);

    // Update only the specific bus's door status to Open
    setBuses(currentBuses =>
      currentBuses.map(bus =>
        bus._id === busId ? { ...bus, isDoorOpen: true } : bus
      )
    );

    // Automatically close the door for THAT bus after 4 seconds
    setTimeout(() => {
      console.log(`BUS DOOR (${targetBus.busNumber}): Auto-closing...`);
      // Important: Use a function for setBuses to get the latest state
      setBuses(currentBuses =>
        currentBuses.map(bus =>
          bus._id === busId ? { ...bus, isDoorOpen: false } : bus
        )
      );
    }, 4000); // 4 seconds
  };
  // -------------------------------------------------------------------

  if (isLoading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;
  }

  return (
    <>
      <div className="dashboard-layout">
        <div className="dashboard-main">
          {/* ... */}
          <section className="heading">
            <h1>Welcome, {user && user.role === 'admin' ? 'Admin!' : user.name}!</h1>
            <p>
              {/* ... */}
            </p>
          </section>

          {/* --- Global sensor UI removed --- */}

          {user && user.role === 'admin' && (
            <section className="form-section">
              <h2>Add a New Bus</h2>
              <form onSubmit={onSubmit} className="add-bus-form">
                {/* ... existing form inputs ... */}
                 <div className="form-group">
                   <input type="text" name="busNumber" value={busNumber} onChange={onChange} placeholder="Bus Number (e.g., MP09 FA 1234)" required />
                 </div>
                 <div className="form-group">
                   <input type="text" name="driverName" value={driverName} onChange={onChange} placeholder="Driver's Name" required />
                 </div>
                 <div className="form-group">
                   <input type="text" name="route" value={route} onChange={onChange} placeholder="Bus Route" required />
                 </div>
                 <div className="form-group">
                   <button type="submit" className="btn btn-primary">Add Bus</button>
                 </div>
              </form>
            </section>
          )}

          <section className="content">
            <h2>Your Registered Buses</h2>
            {buses.length > 0 ? (
              <div className="buses-grid">
                {buses.map((bus) => (
                  // --- Using bus._id is sufficient for the key ---
                  <div key={bus._id} className={`bus-card ${bus.isOverSpeeding || bus.isOverCapacity ? 'alert' : ''}`}>
                    <div className="bus-card-header">
                      <h3>{bus.busNumber}</h3>
                      {(bus.isOverSpeeding || bus.isOverCapacity) && (<span className="alert-icon">⚠️</span>)}
                    </div>
                    <p><strong>Driver:</strong> {bus.driverName}</p>
                    <p><strong>Route:</strong> {bus.route}</p>
                    <div className="bus-stats">
                      <span>Speed: {bus.currentSpeed} km/h</span>
                      <div className="occupancy-control">
                        {user && user.role === 'admin' && ( <button onClick={() => handleDecreaseOccupancy(bus)} className="btn-occupancy">-</button> )}
                        <span>Occupancy: {bus.currentOccupancy}/{bus.maxCapacity}</span>
                        {user && user.role === 'admin' && ( <button onClick={() => handleIncreaseOccupancy(bus)} className="btn-occupancy">+</button> )}
                      </div>
                    </div>

                    {/* --- Bus Door Sensor UI INSIDE the card --- */}
                    <div className="bus-door-simulation" style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                      <h4 style={{ marginBottom: '5px' }}>Door Sensor:
                        <span style={{
                          color: bus.isDoorOpen ? 'green' : 'red', // Use bus.isDoorOpen
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}>
                          {bus.isDoorOpen ? 'Open' : 'Closed'} {/* Use bus.isDoorOpen */}
                        </span>
                      </h4>
                      <button
                        onClick={() => handleBusDoorSimulation(bus._id)} // Pass bus ID
                        // --- Button title updated to explain disabled state ---
                        title={bus.currentSpeed > 0 ? 'Bus must be stopped (0 km/h) to open door' : bus.isDoorOpen ? 'Door is already open' : 'Simulate student approaching door'}
                        disabled={bus.isDoorOpen || bus.currentSpeed > 0} // Disable if open OR moving
                        className="btn btn-sm" // Smaller button
                        style={{
                          // Grey out button if disabled for any reason
                          backgroundColor: (bus.isDoorOpen || bus.currentSpeed > 0) ? '#aaa' : '#28a745',
                          color: 'white',
                          cursor: (bus.isDoorOpen || bus.currentSpeed > 0) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {bus.isDoorOpen ? 'Door Open' : 'Simulate Student'}
                      </button>
                    </div>
                    {/* ------------------------------------------- */}


                    {user && user.role === 'admin' && bus.assignedTo && bus.assignedTo.length > 0 && (
                       <div className="assigned-users-section">
                         <h4>Assigned Users:</h4>
                         <ul className="assigned-users-list">
                           {bus.assignedTo.map((assignedUser) => (
                             <li key={assignedUser._id}>
                               <span>{assignedUser.name} ({assignedUser.email})</span>
                               <button onClick={() => handleUnassignUser(bus._id, assignedUser._id)} className="btn-unassign">
                                 &times;
                               </button>
                             </li>
                           ))}
                         </ul>
                       </div>
                    )}

                    {user && user.role === 'admin' && (
                      <div className="bus-actions">
                        <button onClick={() => handleIncreaseSpeed(bus)} className="btn btn-secondary">⚡ Increase Speed</button>
                        <button onClick={() => handleDecreaseSpeed(bus)} className="btn btn-warning">➖ Decrease Speed</button>
                        <button onClick={() => openAssignModal(bus)} className="btn btn-primary">
                          👤 Assign User
                        </button>
                        <button onClick={() => handleDelete(bus._id)} className="btn btn-danger">🗑️ Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>
                {/* ... No buses message ... */}
              </p>
            )}
          </section>
        </div>
        <div className="dashboard-map">
          <Map buses={buses} />
        </div>
      </div>

      {isModalOpen && (
        <AssignUserModal
          bus={selectedBus}
          users={users}
          onClose={closeAssignModal}
          onAssign={handleAssignUser}
        />
      )}
    </>
  );
}

export default Dashboard;