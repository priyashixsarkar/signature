// src/components/SignaturePlacer.jsx
import React, { useRef, useState } from 'react';

export default function SignaturePlacer({ onSave }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(null);

  const handleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPosition({ x, y });
    onSave({ x, y }); // Send to parent for backend save
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative border w-full h-[500px] bg-gray-100"
    >
      {position && (
        <div
          className="absolute w-24 h-8 bg-blue-500 text-white text-center text-xs rounded shadow"
          style={{
            left: `${position.x * 100}%`,
            top: `${position.y * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          Signature
        </div>
      )}
    </div>
  );
}
