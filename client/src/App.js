// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, BookOpen, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:7001/api/words';

function App() {
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ english: '', georgian: '' });
  const [loading, setLoading] = useState(false);

  // Fetch words from Backend
  const fetchWords = async (searchTerm = '') => {
    try {
      const response = await axios.get(`${API_URL}?search=${searchTerm}`);
      setWords(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchWords(search);
  }, [search]);

  // Handle Adding New Word
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.english || !formData.georgian) return;
    
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ english: '', georgian: '' }); // Reset form
      fetchWords(search); // Refresh list
    } catch (error) {
      console.error('Error adding word', error);
    }
    setLoading(false);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setWords(words.filter(word => word._id !== id));
    } catch (error) {
      console.error('Error deleting', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-indigo-600 flex justify-center items-center gap-3">
            <BookOpen size={40} />
            My Dictionary
          </h1>
          <p className="text-slate-500">English to georgian Personal Glossary</p>
        </header>

        {/* Input Section (Add Word) */}
        <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="English word..."
              value={formData.english}
              onChange={(e) => setFormData({...formData, english: e.target.value})}
              className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="text"
              placeholder="Georgian translation..."
              value={formData.georgian}
              onChange={(e) => setFormData({...formData, georgian: e.target.value})}
              className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-200"
            >
              <Plus size={20} />
              {loading ? 'Adding...' : 'Add Word'}
            </button>
          </form>
        </div>

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rewind / Search for a definition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Word Grid */}
<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  {words.length > 0 ? (
    words.map((item) => (
      <div
        key={item._id}
        className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition flex justify-between items-center"
      >
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {item.english}
          </h3>
          <p className="text-lg text-indigo-500 mt-1">
            {item.georgian}
          </p>
        </div>
        <button
          onClick={() => handleDelete(item._id)}
          className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center py-12 text-slate-400">
      No words found. Add some above!
    </div>
  )}
</div>

      </div>
    </div>
  );
}

export default App;