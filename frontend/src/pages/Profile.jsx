import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const Profile = () => {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="app-main">
      <div className="page-title">Profile</div>
      <div className="page-subtitle">View your profile details.</div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Account Info</span>
        </div>
        <div className="grid grid-2">
          <div>
            <div className="label">Name</div>
            <div>{user.name}</div>
          </div>
          <div>
            <div className="label">Email</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div className="label">Employee ID</div>
            <div>{user.employeeId}</div>
          </div>
          <div>
            <div className="label">Department</div>
            <div>{user.department}</div>
          </div>
          <div>
            <div className="label">Role</div>
            <div>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
