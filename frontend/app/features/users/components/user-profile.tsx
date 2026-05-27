import { useState } from "react";
import type { UserResponse } from "../users.schema";
import { usersApi } from "../users.api";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth/auth.store";

type UserProfileProps = {
  user: UserResponse;
};

export function UserProfile({ user }: UserProfileProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const fullName = `${user.firstName} ${user.lastName}`;

  const [editHover, setEditHover] = useState(false);
  const [deleteHover, setDeleteHover] = useState(false);
  const [leaveHover, setLeaveHover] = useState(false);

  const handleEditClick = () => {
    navigate(`/user/edit`);
  };

  const handleDeleteClick = () => {
    const confirmed = window.confirm("are you sure you want to delete your profile? this action cannot be undone.");

    if (confirmed) {
      logout();
      usersApi.deleteGQL(user.id)
        .then(() => {
          navigate("/auth/login");
        }).catch((err) => {
          console.error("Error deleting profile:", err);
          alert("an error occurred while deleting your profile. please try again later.");
        }
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 20,
        margin: 4,
        border: "1px solid white",
        color: "white",
        backgroundColor: "black",
        width: 400,
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 20,
          borderBottom: "1px solid #fff",
          paddingBottom: 10,
        }}
      >
        <div>user profile</div>

        <button
          onClick={() => navigate("/")}

          onMouseEnter={() => setLeaveHover(true)}
          onMouseLeave={() => setLeaveHover(false)}

          style={{
            background: "black",
            color: leaveHover ? "white" : "black",
            backgroundColor: leaveHover ? "black" : "white",
            fontWeight: "normal",
            border: "1px solid white",
            width: 24,
            height: 24,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ opacity: 0.7, fontSize: 12, textTransform: "lowercase" }}>Name</div>
          <div style={{ fontSize: 18 }}>{fullName}</div>
        </div>

        <div>
          <div style={{ opacity: 0.7, fontSize: 12, textTransform: "lowercase" }}>Email</div>
          <div style={{ fontSize: 16 }}>{user.email}</div>
        </div>

        <div>
          <div style={{ opacity: 0.7, fontSize: 12, textTransform: "lowercase" }}>Joined</div>
          <div style={{ fontSize: 16 }}>{new Date(user.createdAt).toLocaleDateString()}</div>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
          <div style={{ flex: 1 }}>
            <div style={{ opacity: 0.7, fontSize: 12, textTransform: "lowercase", marginBottom: 4 }}>Color</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: user.color,
                  border: "1px solid white",
                }}
              />
              <span style={{ fontSize: 14 }}>{user.color}</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ opacity: 0.7, fontSize: 12, textTransform: "lowercase", marginBottom: 4 }}>Icon</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={`/icons/${user.icon}.svg`}
                alt={user.icon}
                style={{ width: 24, height: 24, filter: "invert(1)" }}
              />
              <span style={{ fontSize: 14, textTransform: "capitalize" }}>{user.icon}</span>
            </div>
          </div>
        </div>

        <button
          className="box"
          onClick={handleEditClick}
        >
          edit profile
        </button>

        <button
          className="box"
          onClick={handleDeleteClick}
        >
          delete profile
        </button>
      </div>
    </div>
  );
}
