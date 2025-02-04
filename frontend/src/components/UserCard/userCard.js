import React from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import "./userCard.css";

const UserCard = ({
  userId,
  username,
  firstName,
  lastName,
  createdAt,
  email,
  bio,
  profileImage,
  isAdmin,
  onAdminDelete,
  makeAdmin,
  removeAdmin,
  currentUserIsAdmin,
  loggedInUserId,
  role,
}) => {
  const navigate = useNavigate();

  const handleUsernameClick = () => {
    navigate("/userProfile", { state: { userId } });
  };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  return (
    <div className="user-card-container">
      <img
        className="profile-picture"
        src={profileImage || "https://placehold.co/100x100"}
        alt="Profile"
      />
      <div className="user-card-content">
        <p
          className="username"
          onClick={handleUsernameClick}
          style={{ cursor: "pointer" }}
        >
          {username}
        </p>
        <p className="name">{`${firstName} ${lastName}`}</p>
        <p className={`role ${isAdmin ? "admin" : "user"}`}>{role}</p>
        <p className="email"> {email}</p>
        <p className="joined">Joined: {formatDate(createdAt)}</p>

        {/* <p className="bio">{bio || "No bio available"}</p> */}
        <div className="action-buttons">
          {loggedInUserId !== userId && currentUserIsAdmin && (
            <>
              {!isAdmin ? (
                <button className="make-admin-button" onClick={makeAdmin}>
                  Make Admin
                </button>
              ) : (
                <button className="remove-admin-button" onClick={removeAdmin}>
                  Remove Admin
                </button>
              )}
              <button className="delete-button" onClick={onAdminDelete}>
                {/* <MdDeleteForever className="usercard-admin-delete-button" /> */}
                Delete Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
