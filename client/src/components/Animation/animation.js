import React from 'react';

const Animation = ({ fadeOut }) => {
  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

          .signature-text {
            font-family: 'Great Vibes', cursive;
            font-size: 7rem;
            fill: none;
            stroke: #ffffff;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 1800;
            stroke-dashoffset: 1800;
            animation: draw 4s ease forwards, glow 2s ease-in-out 4s infinite alternate;
            filter: drop-shadow(0 0 5px #ffffff88) drop-shadow(0 0 15px #ffffffcc);
          }

          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes glow {
            0% {
              stroke: #ffffff;
              filter: drop-shadow(0 0 4px #ffffff55) drop-shadow(0 0 10px #ffffffaa);
            }
            100% {
              stroke: #ffffff;
              filter: drop-shadow(0 0 8px #ffffffaa) drop-shadow(0 0 20px #ffffffee);
            }
          }

          .fade-out {
            animation: fadeOut 2s ease forwards;
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
              stroke-dashoffset: 0;
            }
            to {
              opacity: 0;
              stroke-dashoffset: 1800;
            }
          }
        `}
      </style>

      <svg
        viewBox="0 0 800 200"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={`signature-text ${fadeOut ? 'fade-out' : ''}`}
        >
          Yadam
        </text>
      </svg>
    </div>
  );
};

const styles = {
  wrapper: {
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle at center, #0d0d0d 0%, #000000 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
};

export default Animation;
