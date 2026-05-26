import { useState } from 'react';

export default function Avatar() {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: 48,
          height: 48,

          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid white",

          transform: hover ? "scale(1.1)" : "scale(1)",
          transition: "0.2s",
          position: "relative",
        }}
      >
        <img
          src="/avatar.png"
          alt="avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {hover && (
        <div
          style={{
            position: "absolute",
            top: 54,
						right: -8,

            backgroundColor: "black",
            color: "white",
            padding: "4px 8px",
            borderRadius: 4,
						
            whiteSpace: "nowrap",
            fontSize: 12,
          }}
        >
          go to profile
        </div>
      )}
    </div>
  );
}