import React from 'react';
// --- Circle import removed ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import busIconPng from '../assets/bus-marker.png';

// --- getDistance function removed ---
// --- GateProximityChecker component removed ---

// This helper component smoothly changes the map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Custom bus icon object
const busIcon = new Icon({
  iconUrl: busIconPng,
  iconSize: [40, 40],
});

// --- Map component signature updated: only accepts 'buses' prop ---
function Map({ buses }) {
  // Default map position (Indore coordinates)
  const defaultPosition = [22.7196, 75.8577];

  // Function to slightly offset markers if they are at the exact same location
  const getVisibleMarkers = (busList) => {
    const markerLocations = new window.Map(); // Use window.Map to avoid conflict

    if (!busList) return [];

    return busList.map(bus => {
      // Use default position if bus location is invalid
      if (!bus.latitude || !bus.longitude) {
        console.warn(`Bus ${bus.busNumber || bus._id} has invalid coordinates.`);
        return { ...bus, latitude: defaultPosition[0], longitude: defaultPosition[1] };
      }

      const locationKey = `${bus.latitude},${bus.longitude}`;

      if (markerLocations.has(locationKey)) {
        const count = markerLocations.get(locationKey);
        markerLocations.set(locationKey, count + 1);

        // Calculate a small offset
        const offset = count * 0.0008; // Adjust offset value if needed
        return {
          ...bus,
          latitude: bus.latitude + offset,
          longitude: bus.longitude + offset,
        };
      } else {
        markerLocations.set(locationKey, 1);
        return bus; // No offset needed for the first marker at this location
      }
    });
  };

  const visibleBuses = getVisibleMarkers(buses);

  // Center the map on the first bus, or use the default position if no buses
  const mapCenter =
    visibleBuses && visibleBuses.length > 0
      ? [visibleBuses[0].latitude, visibleBuses[0].longitude]
      : defaultPosition;

  // --- gateCircleOptions variable removed ---

  return (
    <div className="map-container">
      {/* Set up the main map view */}
      <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        {/* Component to update map center when needed */}
        <ChangeView center={mapCenter} zoom={13} />
        {/* Base map layer from OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* --- GateProximityChecker and Circle components removed --- */}

        {/* Map through the visible buses and create a Marker for each */}
        {visibleBuses.map((bus) => (
          // Use bus._id as a unique key for each marker
          <Marker
            key={bus._id}
            // Set the marker's position using latitude and longitude
            position={[bus.latitude, bus.longitude]}
            // Use the custom bus icon
            icon={busIcon}
          >
            {/* Content to show when the marker is clicked */}
            <Popup>
              <b>{bus.busNumber}</b><br />
              Driver: {bus.driverName}<br/>
              Speed: {bus.currentSpeed} km/h
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;