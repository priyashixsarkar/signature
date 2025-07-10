import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchDocuments, signDocument } from '../services/api';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, setAuth }) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetchDocuments(token);
        console.log('Fetched Docs:', res.data); // ✅ Debug line
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching docs', err.response || err);
      }
    };
    if (auth) loadDocs();
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('./Login.jsx');
  };

  const handleSign = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await signDocument(id, token);
      const updated = await fetchDocuments(token);
      setDocuments(updated.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Signing failed');
    }
  };

  useEffect(() => {
    if (!auth) navigate('/Login');
  }, [auth, navigate]);

  const filteredDocs = documents.filter((doc) => {
    if (filter === 'signed') return doc.signed;
    if (filter === 'unsigned') return !doc.signed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-xl p-8 mb-10 border-t-4 border-indigo-500"
        >
          <h1 className="text-3xl font-bold mb-1">Welcome, {auth?.name}</h1>
          <p className="text-sm text-gray-500 mb-4">Role: {auth?.role}</p>
          <div className="flex space-x-4">
            <Link to="/upload" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Upload Document
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center space-x-3 mb-6">
          {['all', 'signed', 'unsigned'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full shadow transition-all duration-200 ${
                filter === f
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.length === 0 ? (
            <div className="text-gray-500">No documents to display.</div>
          ) : (
            filteredDocs.map((doc) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 border"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Uploaded on {new Date(doc.createdAt).toLocaleString()}
                  </p>
                  {doc.signed ? (
                    <p className="text-green-600 text-sm">
                      Signed by {doc.signedBy?.name || 'Unknown'}
                    </p>
                  ) : (
                    <p className="text-yellow-600 text-sm">Awaiting signature</p>
                  )}
                </div>

                <iframe
                  src={`https://signature-s6cy.onrender.com/uploads/${doc.filename}`}
                  title="PDF Preview"
                  className="w-full h-56 border rounded-md mb-3"
                />

                <div className="flex justify-between items-center">
                  {doc.signed ? (
                    <a
                      href={`https://signature-s6cy.onrender.com/uploads/${doc.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Download Signed PDF
                    </a>
                  ) : auth.role === 'User' && (
                    <button
                      onClick={() => handleSign(doc._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-sm rounded-md"
                    >
                      Sign Document
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
