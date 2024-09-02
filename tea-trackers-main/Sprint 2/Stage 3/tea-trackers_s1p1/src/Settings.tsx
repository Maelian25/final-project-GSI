import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes, faTrash, faPlus} from "@fortawesome/free-solid-svg-icons";

import "./Settings.css"; // Import your CSS file for additional styling
import { UserContext } from "./UserContext";
import Box from "@mui/material/Box";
import { Typography, FormControlLabel, Switch, TextField, Button } from "@mui/material";

interface User {
  username: string;
  mail: string;
  localisation: string; 
  hashed_password: string;
  user_type: string;
  // Add other fields as needed
}

const Settings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false); // Add this line
  const [newUser, setNewUser] = useState<Partial<User>>({}); // Add this line
  const [searchUsername, setSearchUsername] = useState("");
  const {user} = useContext(UserContext);
  const authorizedRoles = ['Admin'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://tt-api.azurewebsites.net/users/");
        if (!response.ok) {
          throw new Error("Unable to fetch users");
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (username: string) => {
    try {
      const response = await fetch(`https://tt-api.azurewebsites.net/users/${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    } catch (error) {
      setError("Error deleting user");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
  
    try {
      const response = await fetch(`https://tt-api.azurewebsites.net/users/${editingUser.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editingUser.username,
          mail: editingUser.mail,
          localisation: editingUser.localisation,
          user_type: editingUser.user_type,  // Add this line
          // Add other fields as needed
        }),
      });
  
      if (!response.ok) {
        throw new Error("Unable to update user");
      }
  
      // Create a new array with the updated user
      const updatedUsers = users.map((user) =>
        user.username === editingUser.username ? editingUser : user
      );
  
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      setError("Error updating user");
    }
  };
  
  
  const handleAddUser = async () => {
    try {
      // Check if all required fields are present
      if (
        !newUser.username ||
        !newUser.mail ||
        !newUser.hashed_password ||
        !newUser.user_type ||
        !newUser.localisation
      ) {
        throw new Error("All fields are required");
      }
  
      const response = await fetch("https://tt-api.azurewebsites.net/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add user. Status: ${response.status}. Message: ${errorMessage}`);
      }
  
      const updatedUsers = await response.json();
      setUsers(updatedUsers);
      toggleAddUserPopup();
      // Show success message
    alert("User added successfully.");
    // Reload the page after a short delay
    setTimeout(() => {
        window.location.reload();
      }, 800); // Adjust the delay as needed
    } catch (error: any) {
      console.error("Error adding user:", error);
      setError(error.message || "Error adding user");
    }
  };
  
  

  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const toggleAddUserPopup = () => {
    setShowAddUserPopup(!showAddUserPopup);
    setNewUser({}); // Reset new user data when closing the popup
  };


  const [theme, setTheme] = useState('light'); // light or dark
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showEmail, setShowEmail] = useState(false); // Toggle for showing email

  const handleThemeChange = () => {
    // Logic for changing the theme
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleChangePassword = () => {
    // Logic for changing the password
    // Check if newPassword matches confirmPassword
    if (newPassword === confirmPassword) {
      // Perform password change
      console.log('Password changed successfully');
    } else {
      console.error('New password and confirm password do not match');
    }
  };

  const handleChangePhoneNumber = () => {
    // Logic for changing the phone number
    console.log(`Phone number changed to: ${phoneNumber}`);
  };

  const handleToggleEmail = () => {
    // Toggle logic for showing/hiding email
    setShowEmail((prevShowEmail) => !prevShowEmail);
  };
  if (user && authorizedRoles.includes(user.user_type)){
  return (
    
    <div className="settings-container">
      <h1>List of Users</h1>
      <button onClick={toggleAddUserPopup} className="add-user-button" >
        <FontAwesomeIcon icon={faPlus} /> Add User
      </button>
      <hr />
      {/* Search Bar */}
      <div className="search-bar">
        <input
            type="text"
            placeholder="Search by username..."
            value={searchUsername || ""}
            onChange={(e) => setSearchUsername(e.target.value)}
        />
    </div>
    {showAddUserPopup && (
      <div className="add-user-popup">
        {/* Form for adding a new user */}
        <label>Username:</label>
        <input
          type="text"
          value={newUser.username || ""}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <label>Email:</label>
        <input
          type="text"
          value={newUser.mail || ""}
          onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
        />
        <label>Location:</label>
        <input
          type="text"
          value={newUser.localisation || ""}
          onChange={(e) => setNewUser({ ...newUser, localisation: e.target.value })}
        />
        <label>Role:</label>
        <select
        value={newUser.user_type || ""}
        onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
        >
        <option value="">Select User Type</option>
        <option value="Admin">Admin</option>
        <option value="Prevention Assistant">Prevention Assistant</option>
        <option value="Technical Team">Technical Team</option>
        <option value="User">User</option>
        <option value="CNRS">CNRS</option>
        <option value="LCC">LCC</option>
        <option value="INP">INP</option>
        </select>
        <label>Password:</label>
        <input
          type="text"
          value={newUser.hashed_password || ""}
          onChange={(e) => setNewUser({ ...newUser, hashed_password: e.target.value })}
        />
        {/* Add other fields as needed */}
        <button onClick={handleAddUser}>Add User</button>
        <button onClick={toggleAddUserPopup}>Cancel</button>
      </div>
    )}

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Location</th>
              <th> </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {users
            .filter((user) =>
            user.username.toLowerCase().includes(searchUsername.toLowerCase())
            )
            .map((user) => (
                <tr key={user.username}>
                  <td>
                    {editingUser && editingUser.username === user.username ? (
                      <input
                        value={editingUser.username}
                        disabled
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.username === user.username ? (
                      <input
                        value={editingUser.mail}
                        onChange={(e) => setEditingUser({ ...editingUser, mail: e.target.value })}
                      />
                    ) : (
                      user.mail
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.username === user.username ? (
                      <select
                        value={editingUser.user_type || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, user_type: e.target.value })}
                      >
                        <option value="">Select User Type</option>
                        <option value="Admin">Admin</option>
                        <option value="Prevention Assistant">Prevention Assistant</option>
                        <option value="Technical Team">Technical Team</option>
                        <option value="User">User</option>
                        <option value="CNRS">CNRS</option>
                        <option value="LCC">LCC</option>
                        <option value="INP">INP</option>
                      </select>
                    ) : (
                      user.user_type
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.username === user.username ? (
                      <input
                        value={editingUser.localisation}
                        onChange={(e) => setEditingUser({ ...editingUser, localisation: e.target.value })}
                      />
                    ) : (
                      user.localisation
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.username)} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                  <td>
                    {editingUser && editingUser.username === user.username ? (
                      <>
                        <button onClick={handleUpdateUser} className="save-button" style={{ color: 'green' }}>
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-button" style={{ color: 'red' }}>
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleEditClick(user)} className="edit-button">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          
        </table>)}
    </div>
        ); 
}else {
return (
  <Box sx={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
    <Typography variant="h5" gutterBottom>
      Account Settings
    </Typography>

    {/* <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Theme
      </Typography>
      <FormControlLabel
        control={<Switch checked={theme === 'dark'} onChange={handleThemeChange} />}
        label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
      />
    </Box> */}

    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Email
      </Typography>
      <FormControlLabel
        control={<Switch checked={showEmail} onChange={handleToggleEmail} />}
        label={showEmail ? 'Show Email' : 'Hide Email'}
      />
      {showEmail && (
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Your email address: {user?.mail}
        </Typography>
      )}
    </Box>
  </Box>
);}
      
    }
export default Settings;
