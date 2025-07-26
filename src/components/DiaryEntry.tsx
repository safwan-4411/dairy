import React from 'react';
import { Edit3, Trash2, Heart, Smile, Meh, Frown } from 'lucide-react';
import { Entry } from '../App';

interface DiaryEntryProps {
  entry: Entry | null;
  onEdit: () => void;
  onDelete: (entryId: string) => void;
}

const moodIcons = {
  happy: { icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  neutral: { icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50' },
  sad: { icon: Frown, color: 'text-red-500', bg: 'bg-red-50' },
  love: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' }
};

const DiaryEntry: React.FC<DiaryEntryProps> = ({ entry, onEdit, onDelete }) => {
  if (!entry) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-8">
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Edit3 className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">No entry for this day</h3>
          <p className="text-gray-600 mb-6">
            Start writing about your day, thoughts, or experiences.
          </p>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Write Today's Entry
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MoodIcon = entry.mood && moodIcons[entry.mood as keyof typeof moodIcons] 
    ? moodIcons[entry.mood as keyof typeof moodIcons].icon 
    : null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {entry.mood && MoodIcon && (
              <div className={`p-2 rounded-lg ${moodIcons[entry.mood as keyof typeof moodIcons].bg}`}>
                <MoodIcon className={`h-5 w-5 ${moodIcons[entry.mood as keyof typeof moodIcons].color}`} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {entry.title || 'My Day'}
              </h2>
              <p className="text-sm text-gray-600">
                Created {formatTime(entry.createdAt)}
                {entry.updatedAt !== entry.createdAt && (
                  <span> • Updated {formatTime(entry.updatedAt)}</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              title="Edit entry"
            >
              <Edit3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete entry"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {entry.content ? (
          <div className="prose prose-amber max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {entry.content}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">No content written yet.</p>
            <button
              onClick={onEdit}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Add some thoughts →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryEntry;