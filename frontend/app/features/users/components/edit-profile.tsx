import { useState } from "react";
import type { UserResponse } from "../users.schema";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth/auth.store";
import { UserIcon } from "../../simulation/sim.schema";
import { usersApi } from "../users.api";

type UserProfileProps = {
  user: UserResponse;
};

export function EditProfile({ user }: UserProfileProps) {
  const navigate = useNavigate();
  const { hydrateUser, logout } = useAuthStore();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [color, setColor] = useState(user.color);
  const [shape, setShape] = useState(user.icon);

  const [submitHover, setSubmitHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const handleSubmitClick = () => {
    usersApi.edit(user.id, {
      firstName,
      lastName,
      color,
      icon: shape,
    }).then(() => {
      hydrateUser();
      navigate(`/user`);
    }).catch((err) => {
      console.error("Error updating profile:", err);
      alert("an error occurred while updating your profile. please try again later.");
      navigate(`/user`);
    });
  }

  const handleCancelClick = () => {
    navigate(`/user`);
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
        maxWidth: 400,
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: 20,
          borderBottom: "1px solid #fff",
          paddingBottom: 10,
        }}
      >
        edit profile
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div
            style={{
              opacity: 0.7,
              fontSize: 12,
              textTransform: "lowercase",
              marginBottom: 6,
            }}
          >
            Name
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="first name"
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "black",
                color: "white",
                border: "1px solid white",
                padding: 8,
                outline: "none",
              }}
            />

            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="last name"
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "black",
                color: "white",
                border: "1px solid white",
                padding: 8,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              opacity: 0.7,
              fontSize: 12,
              textTransform: "lowercase",
            }}
          >
            Email
          </div>

          <div style={{ fontSize: 16 }}>{user.email}</div>
        </div>

        <div>
          <div
            style={{
              opacity: 0.7,
              fontSize: 12,
              textTransform: "lowercase",
            }}
          >
            Joined
          </div>

          <div style={{ fontSize: 16 }}>
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                opacity: 0.7,
                fontSize: 12,
                textTransform: "lowercase",
                marginBottom: 4,
              }}
            >
              Color
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 4,
              border: "1px solid white",
              height: 42,
              boxSizing: "border-box",
            }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: 32,
                  height: 32,
                  background: "black",
                  cursor: "pointer",
                }}
              />

              <span style={{ fontSize: 14 }}>{color}</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                opacity: 0.7,
                fontSize: 12,
                textTransform: "lowercase",
                marginBottom: 4,
              }}
            >
              Shape
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 4,
              border: "1px solid white",
              height: 42,
              boxSizing: "border-box",
            }}>
              <img
                src={`/icons/${shape}.svg`}
                alt={shape}
                style={{
                  width: 24,
                  height: 24,
                  filter: "invert(1)",
                }}
              />

              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as UserIcon)}
                style={{
                  flex: 1,
                  backgroundColor: "black",
                  color: "white",
                  padding: 6,
                  outline: "none",
                }}
              >
                {Object.values(UserIcon).map((icon) => (
                  <option
                    key={icon}
                    value={icon}
                    style={{
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          className="box"
          onClick={handleSubmitClick}
          onMouseEnter={() => setSubmitHover(true)}
          onMouseLeave={() => setSubmitHover(false)}
        >
          done
        </button>

        <button
          className="box"
          onClick={handleCancelClick}
          onMouseEnter={() => setCancelHover(true)}
          onMouseLeave={() => setCancelHover(false)}
        >
          cancel
        </button>
      </div>
    </div>
  );
}
