import React, { useState } from 'react';
import { Folder, Settings, Search, Plus, Download, Sun, Moon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/Dialog";

// Settings Component
const SettingsDialog = ({ open, onOpenChange, settings, onSettingsChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <select 
              value={settings.fontFamily} 
              onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value })}
              className="w-full p-2 rounded border bg-transparent"
            >
              <option value="mono">Monospace</option>
              <option value="sans">Sans Serif</option>
              <option value="serif">Serif</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <select 
              value={settings.fontSize} 
              onChange={(e) => onSettingsChange({ ...settings, fontSize: e.target.value })}
              className="w-full p-2 rounded border bg-transparent"
            >
              <option value="sm">Small</option>
              <option value="base">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Line Height</label>
            <select 
              value={settings.lineHeight} 
              onChange={(e) => onSettingsChange({ ...settings, lineHeight: e.target.value })}
              className="w-full p-2 rounded border bg-transparent"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Tag Management Component
const TagManager = ({ note, tags, onUpdateTags, isDarkMode }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !note.tags.includes(newTag)) {
      const updatedTags = [...note.tags, newTag];
      onUpdateTags(updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = note.tags.filter(tag => tag !== tagToRemove);
    onUpdateTags(updatedTags);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {note.tags.map(tag => (
        <span 
          key={tag} 
          className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        >
          #{tag}
          <button 
            onClick={() => removeTag(tag)}
            className="ml-1 hover:text-red-500"
          >
            ×
          </button>
        </span>
      ))}
      <div className="flex items-center">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
          placeholder="Add tag..."
          className="bg-transparent text-sm border-b border-gray-700 focus:outline-none focus:border-gray-500 px-1"
        />
        <button 
          onClick={addTag}
          className="ml-1 text-sm hover:text-blue-500"
        >
          +
        </button>
      </div>
    </div>
  );
};

// Note Item Component
const NoteItem = ({ note, selected, onClick, isDarkMode }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer ${
        selected 
          ? isDarkMode ? 'bg-gray-100 bg-opacity-10' : 'bg-gray-200' 
          : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
    >
      <h3 className="text-base font-medium mb-1">{note.title}</h3>
      <p className="text-sm text-gray-400 truncate">{note.content || 'No content'}</p>
      <div className="flex gap-2 mt-2">
        {note.tags?.map(tag => (
          <span key={tag} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
            #{tag}
          </span>
        ))}
      </div>
      <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{note.date}</div>
    </div>
  );
};

// Folder Component
const FolderItem = ({ folder, selected, onClick, isDarkMode }) => {
  return (
    <div
      className={`flex items-center px-4 py-2 cursor-pointer ${
        selected 
          ? isDarkMode ? 'bg-gray-700' : 'bg-gray-300' 
          : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      <Folder size={16} className="mr-2" />
      <span>{folder.name}</span>
    </div>
  );
};

// Markdown Editor Component
const MarkdownEditor = ({ note, onChange, settings, isDarkMode }) => {
  const [preview, setPreview] = useState(false);

  const getFontClasses = () => {
    const classes = [];
    
    // Font family
    if (settings.fontFamily === 'mono') classes.push('font-mono');
    else if (settings.fontFamily === 'sans') classes.push('font-sans');
    else if (settings.fontFamily === 'serif') classes.push('font-serif');
    
    // Font size
    if (settings.fontSize === 'sm') classes.push('text-sm');
    else if (settings.fontSize === 'lg') classes.push('text-lg');
    else classes.push('text-base');
    
    // Line height
    if (settings.lineHeight === 'tight') classes.push('leading-tight');
    else if (settings.lineHeight === 'relaxed') classes.push('leading-relaxed');
    else classes.push('leading-normal');
    
    return classes.join(' ');
  };

  const saveToMarkdown = () => {
    const content = `# ${note.title}\n\nTags: ${note.tags.map(t => `#${t}`).join(', ')}\n\n${note.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onChange({ ...note, title: e.target.value })}
          className="bg-transparent text-xl font-medium focus:outline-none"
          placeholder="Note title"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={`px-3 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={saveToMarkdown}
            className={`px-3 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Save as Markdown"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <TagManager 
        note={note}
        tags={note.tags}
        onUpdateTags={(newTags) => onChange({ ...note, tags: newTags })}
        isDarkMode={isDarkMode}
      />
      
      <div className="flex-1 p-4">
        {preview ? (
          <div className={`prose prose-invert max-w-none ${getFontClasses()}`}>
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        ) : (
          <textarea
            value={note.content}
            onChange={(e) => onChange({ ...note, content: e.target.value })}
            className={`w-full h-full bg-transparent resize-none focus:outline-none ${getFontClasses()}`}
            placeholder="Start writing in Markdown!"
          />
        )}
      </div>
    </div>
  );
};

// Main App Component
const MarkdownNotesApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontFamily: 'sans',
    fontSize: 'base',
    lineHeight: 'normal'
  });

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Getting Started with Markdown',
      content: '# Welcome to Your Notes\n\nStart writing in Markdown!\nSome examples:\n\n## Headers\n\n### Like this\n\n## Lists\n- Item 1\n- Item 2\n- Item 3\n\n## Code\n```javascript\nfunction hello() {\n  console.log("Hello, world!");\n}\n```',
      date: '2024-02-20',
      tags: ['markdown', 'tutorial'],
      folderId: 'personal'
    }
  ]);
  
  const [folders] = useState([
    { id: 'personal', name: 'Personal' },
    { id: 'work', name: 'Work' },
    { id: 'projects', name: 'Projects' }
  ]);

  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [selectedFolder, setSelectedFolder] = useState('personal');

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note =>
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      folderId: selectedFolder,
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-gray-100' 
    : 'bg-gray-50 text-gray-900';

  const sidebarClasses = isDarkMode
    ? 'bg-gray-800'
    : 'bg-gray-100';

  return (
    <div className={`h-screen flex ${themeClasses}`}>
      {/* Sidebar */}
      <div className={`w-64 ${sidebarClasses} flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Notes</h1>
          <div className="flex gap-2">
            <button
              onClick={createNewNote}
              className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="New Note"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search notes..."
              className={`w-full rounded pl-10 pr-4 py-2 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="mb-4">
            <div className="px-4 py-2 text-sm font-medium text-gray-400">
              Folders
            </div>
            {folders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                selected={selectedFolder === folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className={`w-72 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl">All Notes</h2>
        </div>
        <div className="overflow-auto">
          {notes
            .filter(note => !selectedFolder || note.folderId === selectedFolder)
            .map(note => (
              <NoteItem
                key={note.id}
                note={note}
                selected={selectedNote?.id === note.id}
                onClick={() => setSelectedNote(note)}
                isDarkMode={isDarkMode}
              />
            ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1">
        {selectedNote ? (
          <MarkdownEditor
            note={selectedNote}
            onChange={updateNote}
            settings={settings}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select or create a note to get started
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default MarkdownNotesApp;
