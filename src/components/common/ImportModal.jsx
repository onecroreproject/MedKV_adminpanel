import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function ImportModal({ isOpen, onClose, onImport, entityName = "Data" }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const text = await file.text();
      // Simple CSV parser for generic import
      const rows = text.split('\n').filter(row => row.trim());
      if (rows.length < 2) {
        alert("The CSV file must contain a header row and at least one data row.");
        setIsProcessing(false);
        return;
      }
      
      const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const parsedData = rows.slice(1).map(row => {
        // Handle commas inside quotes properly (regex split)
        const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
        const obj = {};
        headers.forEach((header, i) => {
          let val = values[i] ? values[i].trim() : '';
          // Remove surrounding quotes if present
          if (val.startsWith('"') && val.endsWith('"')) {
             val = val.substring(1, val.length - 1).replace(/""/g, '"');
          }
          obj[header] = val;
        });
        return obj;
      });

      await onImport(parsedData);
      onClose();
      setFile(null);
    } catch (error) {
      alert("Failed to parse or import file: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-text-main text-lg">Import {entityName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-text-muted mb-2">Upload a CSV file to bulk import {entityName.toLowerCase()}. Make sure the column headers match the expected fields.</p>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-text-main">
              {file ? file.name : "Click or drag CSV file to upload"}
            </p>
            <p className="text-xs text-text-muted mt-1">.csv files only</p>
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleImport}
              disabled={!file || isProcessing}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 disabled:opacity-70 flex items-center gap-2"
            >
              {isProcessing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
              ) : (
                <><Upload className="w-4 h-4" /> Import</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
