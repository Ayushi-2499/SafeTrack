import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders the main app component without crashing', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  
  const logoElements = screen.getAllByText(/SafeTrack/i);
  expect(logoElements[0]).toBeInTheDocument();
});

