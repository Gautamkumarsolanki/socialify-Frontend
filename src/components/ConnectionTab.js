import React, { useState } from 'react';
import './tab.css'
const ConnectionTab = ({ followers, following }) => {
  const [activeTab, setActiveTab] = useState('followers');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  console.log(followers);
  console.log(following);
  return (
    <div>
      <div className="tab-buttons">
        <button
          className={activeTab === 'followers' ? 'active' : ''}
          onClick={() => handleTabChange('followers')}
        >
          Followers
        </button>
        <button
          className={activeTab === 'following' ? 'active' : ''}
          onClick={() => handleTabChange('following')}
        >
          Following
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'followers' && (
          <ul>
            {followers.map((follower, index) => (
              <li key={index}>
                <img src={follower.avatar} alt="" />
                <div>
                  <p>{follower.username}</p>
                  <p>{follower.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'following' && (
          <ul>
            {following.map((followedUser, index) => (
              <li key={index}>
                <img src={followedUser.photo} alt="" />
                <div>
                  <p>{followedUser.userName}</p>
                  <p>{followedUser.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionTab;
