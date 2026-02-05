import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

const LandingPage = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit =(e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="flex items-center justify-center mb-8">
          <Wand2 className="w-12 h-12 text-purple-500 mr-4" />
          <h1 className="text-4xl font-bold">Website Builder AI</h1>
        </div>
        
        <p className="text-xl text-gray-400 mb-12">
          Transform your ideas into beautiful websites with the power of AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your dream website..."
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[120px] text-white"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Generate Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;