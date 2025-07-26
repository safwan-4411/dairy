import React from 'react';
import { Search, Calendar, FileText } from 'lucide-react';
import { Entry } from '../App';

interface SearchBarProps {
  entries: Entry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEntrySelect: (entry: Entry) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  entries, 
  searchQuery, 
  onSearchChange, 
  onEntrySelect 
}) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-amber-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your diary entries..."
            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="p-6">
        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found {entries.length} result{entries.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}

        {searchQuery && entries.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
            <p className="text-gray-600">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search your diary</h3>
            <p className="text-gray-600">
              Enter keywords to find specific entries, thoughts, or experiences.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onEntrySelect(entry)}
              className="w-full text-left p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                  {entry.title ? highlightText(entry.title, searchQuery) : 'Untitled Entry'}
                </h3>
                <div className="flex items-center text-xs text-gray-500 ml-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(entry.date)}
                </div>
              </div>
              
              {entry.content && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {highlightText(entry.content.substring(0, 200) + '...', searchQuery)}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-500">
                  {entry.content.length} characters
                </div>
                <div className="text-xs text-emerald-600 group-hover:text-emerald-700 font-medium">
                  Read more →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;