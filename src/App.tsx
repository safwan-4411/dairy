import React, { useState, useEffect } from 'react';
import { Calendar, PenTool, BookOpen, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import DiaryEntry from './components/DiaryEntry';
import EntryEditor from './components/EntryEditor';
import CalendarView from './components/CalendarView';
import SearchBar from './components/SearchBar';

export interface Entry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState<'diary' | 'calendar' | 'search'>('diary');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedEntries = localStorage.getItem('diary-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diary-entries', JSON.stringify(entries));
  }, [entries]);

  const getCurrentEntry = () => {
    return entries.find(entry => entry.date === currentDate) || null;
  };

  const saveEntry = (entryData: Partial<Entry>) => {
    const existingEntry = getCurrentEntry();
    const now = new Date().toISOString();

    if (existingEntry) {
      const updatedEntry = {
        ...existingEntry,
        ...entryData,
        updatedAt: now
      };
      setEntries(prev => prev.map(entry => 
        entry.id === existingEntry.id ? updatedEntry : entry
      ));
      setSelectedEntry(updatedEntry);
    } else {
      const newEntry: Entry = {
        id: Date.now().toString(),
        date: currentDate,
        title: entryData.title || '',
        content: entryData.content || '',
        mood: entryData.mood,
        createdAt: now,
        updatedAt: now
      };
      setEntries(prev => [...prev, newEntry]);
      setSelectedEntry(newEntry);
    }
    setIsEditing(false);
  };

  const deleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    setSelectedEntry(null);
  };

  const exportEntries = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diary-entries-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(date.toISOString().split('T')[0]);
    setSelectedEntry(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                My Daily Diary
              </h1>
            </div>

            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setView('diary')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'diary'
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <PenTool className="h-4 w-4 inline-block mr-2" />
                Write
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'calendar'
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Calendar className="h-4 w-4 inline-block mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setView('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'search'
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Search className="h-4 w-4 inline-block mr-2" />
                Search
              </button>
              <button
                onClick={exportEntries}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                disabled={entries.length === 0}
              >
                <Download className="h-4 w-4 inline-block mr-2" />
                Export
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'diary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Date Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateDate('prev')}
                    className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-800 text-center">
                    {formatDate(currentDate)}
                  </h2>
                  <button
                    onClick={() => navigateDate('next')}
                    className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => {
                    setCurrentDate(e.target.value);
                    setSelectedEntry(null);
                    setIsEditing(false);
                  }}
                  className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />

                <div className="mt-6 space-y-3">
                  <h3 className="font-medium text-gray-700">Recent Entries</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {entries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => {
                            setCurrentDate(entry.date);
                            setSelectedEntry(entry);
                            setIsEditing(false);
                          }}
                          className="w-full text-left p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all border border-amber-200"
                        >
                          <div className="font-medium text-sm text-gray-800">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {entry.title || 'Untitled Entry'}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {isEditing ? (
                <EntryEditor
                  entry={getCurrentEntry()}
                  onSave={saveEntry}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <DiaryEntry
                  entry={getCurrentEntry()}
                  onEdit={() => setIsEditing(true)}
                  onDelete={deleteEntry}
                />
              )}
            </div>
          </div>
        )}

        {view === 'calendar' && (
          <CalendarView
            entries={entries}
            onDateSelect={(date) => {
              setCurrentDate(date);
              setView('diary');
              setSelectedEntry(null);
              setIsEditing(false);
            }}
          />
        )}

        {view === 'search' && (
          <SearchBar
            entries={filteredEntries}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEntrySelect={(entry) => {
              setCurrentDate(entry.date);
              setSelectedEntry(entry);
              setView('diary');
              setIsEditing(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;