import React, { useState, useEffect } from 'react';
import { Save, X, Heart, Smile, Meh, Frown } from 'lucide-react';
import { Entry } from '../App';

interface EntryEditorProps {
  entry: Entry | null;
  onSave: (entry: Partial<Entry>) => void;
  onCancel: () => void;
}

const moods = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'emerald' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'amber' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'red' },
  { value: 'love', label: 'Loving', icon: Heart, color: 'pink' }
];

const EntryEditor: React.FC<EntryEditorProps> = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || '');

  useEffect(() => {
    setTitle(entry?.title || '');
    setContent(entry?.content || '');
    setMood(entry?.mood || '');
  }, [entry]);

  const handleSave = () => {
    onSave({ title, content, mood: mood || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6" onKeyDown={handleKeyDown}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
          />
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-3">
            {moods.map((moodOption) => {
              const IconComponent = moodOption.icon;
              const isSelected = mood === moodOption.value;
              
              return (
                <button
                  key={moodOption.value}
                  type="button"
                  onClick={() => setMood(isSelected ? '' : moodOption.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-${moodOption.color}-500 bg-${moodOption.color}-50 text-${moodOption.color}-700`
                      : 'border-gray-200 hover:border-amber-300 text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${
                    isSelected ? `text-${moodOption.color}-500` : 'text-gray-500'
                  }`} />
                  <span className="text-sm font-medium">{moodOption.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Your thoughts
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Write about your experiences, thoughts, feelings, or anything you'd like to remember..."
            rows={12}
            className="w-full p-4 border border-amber-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-gray-700 leading-relaxed"
            autoFocus
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{content.length} characters</span>
            <span>Ctrl+S to save • Esc to cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryEditor;