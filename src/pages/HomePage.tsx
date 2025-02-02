import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if not authenticated
    }

    // Fetch user details (this can be an API request)
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/'); // Redirect to login if an error occurs
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>You are logged in.</p>
      {/* Add more home page content here */}
    </div>
  );
};

export default HomePage;
