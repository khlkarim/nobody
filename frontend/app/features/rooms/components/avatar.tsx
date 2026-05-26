import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Avatar() {
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  const handleClick = () => {


    navigate("/user");
  }

  return (
    <div>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleClick}
      >
        <img
          src="/avatar.png"
          alt="avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>

      {hover && (
        <div
          style={{
            position: "absolute",
            top: 54,

            backgroundColor: "black",
            color: "white",
            padding: "4px 8px",
            borderRadius: 4,

            whiteSpace: "nowrap",
            fontSize: 8,
          }}
        >
          go to profile
        </div>
      )}
    </div>
  );
}