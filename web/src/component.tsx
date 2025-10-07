import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Types for window.openai
interface OpenAI {
  toolOutput?: {
    counter: number;
    notes: Array<{id: number, text: string, timestamp: string}>;
    visitors: number;
  };
  callTool?: (toolName: string, args: any) => Promise<void>;
  theme?: 'light' | 'dark';
}

declare global {
  interface Window {
    openai?: OpenAI;
  }
}

function CounterNotesApp() {
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const toolOutput = window.openai?.toolOutput || { counter: 0, notes: [], visitors: 0 };
  const theme = window.openai?.theme || 'light';
  const isDark = theme === 'dark';

  const handleIncrement = async () => {
    setIsLoading(true);
    try {
      await window.openai?.callTool?.('personal_data', { command: 'increment counter' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsLoading(true);
    try {
      await window.openai?.callTool?.('personal_data', { command: `save note ${noteText}` });
      setNoteText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all data?')) return;
    setIsLoading(true);
    try {
      await window.openai?.callTool?.('personal_data', { command: 'reset' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      background: isDark ? '#1a1a1a' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      borderRadius: '12px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>🎯 Personal Counter & Notes</h1>
        <p style={{ margin: 0, color: isDark ? '#aaa' : '#666', fontSize: '14px' }}>
          Interactive app with live data
        </p>
      </div>

      {/* Counter Section */}
      <div style={{
        background: isDark ? '#2a2a2a' : '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', color: isDark ? '#aaa' : '#666', marginBottom: '4px' }}>
              Global Counter
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: isDark ? '#4ade80' : '#22c55e' }}>
              {toolOutput.counter}
            </div>
          </div>
          <button
            onClick={handleIncrement}
            disabled={isLoading}
            style={{
              background: isDark ? '#4ade80' : '#22c55e',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ➕ Increment
          </button>
        </div>
      </div>

      {/* Add Note Section */}
      <div style={{
        background: isDark ? '#2a2a2a' : '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
          📝 Add New Note
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder="Type your note here..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: isDark ? '1px solid #444' : '1px solid #ddd',
              background: isDark ? '#1a1a1a' : '#fff',
              color: isDark ? '#fff' : '#000',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleAddNote}
            disabled={isLoading || !noteText.trim()}
            style={{
              background: isDark ? '#3b82f6' : '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isLoading || !noteText.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !noteText.trim() ? 0.5 : 1,
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div style={{
        background: isDark ? '#2a2a2a' : '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
          📚 Saved Notes ({toolOutput.notes.length})
        </div>
        {toolOutput.notes.length === 0 ? (
          <div style={{ color: isDark ? '#666' : '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            No notes yet. Add one above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {toolOutput.notes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: isDark ? '#1a1a1a' : '#fff',
                  padding: '12px',
                  borderRadius: '6px',
                  border: isDark ? '1px solid #444' : '1px solid #e5e5e5'
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  {note.text}
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#666' : '#999' }}>
                  {note.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats & Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '14px', color: isDark ? '#aaa' : '#666' }}>
          👥 Total requests: {toolOutput.visitors}
        </div>
        <button
          onClick={handleReset}
          disabled={isLoading}
          style={{
            background: isDark ? '#ef4444' : '#dc2626',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          🔄 Reset All
        </button>
      </div>
    </div>
  );
}

// Mount the app
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<CounterNotesApp />);
}
