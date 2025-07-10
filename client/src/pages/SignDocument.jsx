import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

export default function SignDocument() {
  const { id } = useParams();
  const iframeRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/docs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setPdfUrl(`/uploads/${res.data.filename}`);
      })
      .catch((err) => {
        alert('Failed to load document');
        console.error(err);
      });
  }, [id]);

  const handleIframeClick = (e) => {
    const rect = iframeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width).toFixed(2);
    const y = ((e.clientY - rect.top) / rect.height).toFixed(2);
    setSignaturePosition({ x, y });
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.post(`/api/signatures`, {
      documentId: id,
      x: signaturePosition.x,
      y: signaturePosition.y
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Signature position saved'))
      .catch((err) => alert('Failed to save position'));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Signature Placement</h2>
      {pdfUrl && (
        <div className="relative w-full h-[80vh] border rounded overflow-hidden">
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-full"
            onClick={handleIframeClick}
          />
          {signaturePosition && (
            <div
              className="absolute w-24 h-8 bg-green-500 text-white text-center text-xs flex items-center justify-center rounded"
              style={{
                left: `${signaturePosition.x * 100}%`,
                top: `${signaturePosition.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              Signature
            </div>
          )}
        </div>
      )}
      {signaturePosition && (
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Position
        </button>
      )}
    </div>
  );
}
