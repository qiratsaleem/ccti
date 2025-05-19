import React, { useState, useEffect } from 'react';
import './ConfigInterface.css';

function ConfigInterface() {
  // Initialize state with all required fields
  const [config, setConfig] = useState({
    email_settings: {
      EMAIL_HOST: '',
      EMAIL_PORT: '',
      EMAIL_HOST_USER: '',
      EMAIL_HOST_PASSWORD: '',
      DEFAULT_FROM_EMAIL: ''
    },
    gemini_api_key: '',
    gemini_version: '',
    users: {
      admin: { password: '', role: '' },
      user: { password: '', role: '' },
      config_admin: { password: '', role: '' }
    }
  });

  const [tempConfig, setTempConfig] = useState({ ...config });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-configurations/');
        if (!response.ok) throw new Error('Failed to load configurations');
        
        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (data?.configurations) {
          // Ensure all fields are properly set
          const newConfig = {
            email_settings: {
              EMAIL_HOST: data.configurations.email_settings?.EMAIL_HOST || 'Not set',
              EMAIL_PORT: data.configurations.email_settings?.EMAIL_PORT || 'Not set',
              EMAIL_HOST_USER: data.configurations.email_settings?.EMAIL_HOST_USER || 'Not set',
              EMAIL_HOST_PASSWORD: data.configurations.email_settings?.EMAIL_HOST_PASSWORD || '',
              DEFAULT_FROM_EMAIL: data.configurations.email_settings?.DEFAULT_FROM_EMAIL || 'Not set'
            },
            gemini_api_key: data.configurations.gemini_api_key || 'Not set',
            gemini_version: data.configurations.gemini_version || 'Not set',
            users: data.configurations.users || {
              admin: { password: 'password123', role: 'admin' },
              user: { password: 'userpass', role: 'user' },
              config_admin: { password: 'config123', role: 'access_manager' }
            }
          };
          
          setConfig(newConfig);
          setTempConfig(JSON.parse(JSON.stringify(newConfig)));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e, section, field) => {
    setTempConfig(prev => {
      const newConfig = { ...prev };
      if (section) {
        newConfig[section][field] = e.target.value;
      } else {
        newConfig[field] = e.target.value;
      }
      return newConfig;
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/update-configurations/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configurations: tempConfig })
      });

      if (!response.ok) throw new Error('Update failed');
      
      const data = await response.json();
      if (data.success) {
        setConfig(tempConfig);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setTempConfig(JSON.parse(JSON.stringify(config)));
    setIsEditing(false);
    setError('');
  };

  if (loading) return <div className="loading">Loading configurations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const currentConfig = isEditing ? tempConfig : config;

  return (
    <div className="config-interface">
      <h2>System Configuration</h2>
      
      <div className="config-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">
              <i className="fas fa-save"></i> Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              <i className="fas fa-times"></i> Cancel
            </button>
          </>
        ) : (
          <button onClick={handleEdit} className="edit-btn">
            <i className="fas fa-edit"></i> Edit
          </button>
        )}
      </div>

      {/* Email Settings */}
      <div className="config-section email-section">
        <h3><i className="fas fa-envelope"></i> Email Settings</h3>
        
        {['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_HOST_USER', 'EMAIL_HOST_PASSWORD', 'DEFAULT_FROM_EMAIL'].map(field => (
          <div key={field} className="form-group">
            <label>{field.replace('_', ' ')}:</label>
            {isEditing ? (
              <input
                type={field.includes('PASSWORD') ? 'password' : 'text'}
                value={currentConfig.email_settings[field]}
                onChange={(e) => handleChange(e, 'email_settings', field)}
              />
            ) : (
              <div className="config-value">
                {field.includes('PASSWORD') 
                  ? '•'.repeat(currentConfig.email_settings[field]?.length || 8)
                  : currentConfig.email_settings[field]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gemini API */}
      <div className="config-section gemini-section">
        <h3><i className="fas fa-key"></i> Gemini API</h3>
        
        {['gemini_api_key', 'gemini_version'].map(field => (
          <div key={field} className="form-group">
            <label>{field.replace('_', ' ')}:</label>
            {isEditing ? (
              <input
                type={field.includes('key') ? 'password' : 'text'}
                value={currentConfig[field]}
                onChange={(e) => handleChange(e, null, field)}
              />
            ) : (
              <div className="config-value">
                {field.includes('key') 
                  ? '•'.repeat(currentConfig[field]?.length || 12)
                  : currentConfig[field]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Credentials */}
      <div className="config-section users-section">
        <h3><i className="fas fa-users"></i> User Credentials</h3>
        
        {Object.entries(currentConfig.users).map(([username, details]) => (
          <div key={username} className="user-credential">
            <strong>{username}</strong>
            <div className="credential-field">
              <label>Password:</label>
              {isEditing ? (
                <input
                  type="password"
                  value={details.password}
                  onChange={(e) => {
                    const newUsers = { ...currentConfig.users };
                    newUsers[username].password = e.target.value;
                    setTempConfig(prev => ({ ...prev, users: newUsers }));
                  }}
                />
              ) : (
                <span className="password-mask">
                  {'•'.repeat(details.password?.length || 8)}
                </span>
              )}
            </div>
            <div className="credential-field">
              <label>Role:</label>
              <span>{details.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConfigInterface;