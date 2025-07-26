class DiaryApp {
    constructor() {
        this.entries = this.loadEntries();
        this.currentDate = new Date().toISOString().split('T')[0];
        this.currentView = 'diary';
        this.currentMonth = new Date();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentDateDisplay();
        this.renderDiaryView();
        this.renderRecentEntries();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.nav-btn').dataset.view;
                if (view) {
                    this.switchView(view);
                } else if (e.target.closest('#exportBtn')) {
                    this.exportEntries();
                }
            });
        });

        // Date navigation
        document.getElementById('prevDay').addEventListener('click', () => this.navigateDate(-1));
        document.getElementById('nextDay').addEventListener('click', () => this.navigateDate(1));
        document.getElementById('datePicker').addEventListener('change', (e) => {
            this.currentDate = e.target.value;
            this.renderDiaryView();
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.navigateMonth(1));

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.renderSearchResults(e.target.value);
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(`${view}View`).classList.add('active');

        // Render appropriate content
        if (view === 'calendar') {
            this.renderCalendar();
        } else if (view === 'search') {
            this.renderSearchResults('');
        }
    }

    navigateDate(days) {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() + days);
        this.currentDate = date.toISOString().split('T')[0];
        this.updateCurrentDateDisplay();
        this.renderDiaryView();
    }

    navigateMonth(months) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + months);
        this.renderCalendar();
    }

    updateCurrentDateDisplay() {
        const date = new Date(this.currentDate);
        const formatted = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('currentDateDisplay').textContent = formatted;
        document.getElementById('datePicker').value = this.currentDate;
    }

    getCurrentEntry() {
        return this.entries.find(entry => entry.date === this.currentDate);
    }

    renderDiaryView() {
        const entry = this.getCurrentEntry();
        const displayEl = document.getElementById('entryDisplay');
        const editorEl = document.getElementById('entryEditor');

        displayEl.classList.remove('hidden');
        editorEl.classList.add('hidden');

        if (!entry) {
            displayEl.innerHTML = `
                <div class="empty-entry">
                    <div class="empty-icon">
                        <i class="fas fa-pen"></i>
                    </div>
                    <h3>No entry for this day</h3>
                    <p>Start writing about your day, thoughts, or experiences.</p>
                    <button class="btn-primary" onclick="app.showEditor()">
                        Write Today's Entry
                    </button>
                </div>
            `;
        } else {
            const moodIcon = this.getMoodIcon(entry.mood);
            displayEl.innerHTML = `
                <div class="entry-header">
                    <div class="entry-info">
                        ${entry.mood ? `<div class="mood-icon mood-${entry.mood}">${moodIcon}</div>` : ''}
                        <div class="entry-meta">
                            <h2>${entry.title || 'My Day'}</h2>
                            <p>Created ${this.formatTime(entry.createdAt)}${entry.updatedAt !== entry.createdAt ? ` • Updated ${this.formatTime(entry.updatedAt)}` : ''}</p>
                        </div>
                    </div>
                    <div class="entry-actions">
                        <button class="btn-icon" onclick="app.showEditor()" title="Edit entry">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="app.deleteEntry('${entry.id}')" title="Delete entry">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="entry-content">
                    ${entry.content || '<p style="text-align: center; color: #6b7280; font-style: italic;">No content written yet.</p>'}
                </div>
            `;
        }

        this.renderRecentEntries();
    }

    showEditor() {
        const entry = this.getCurrentEntry();
        const displayEl = document.getElementById('entryDisplay');
        const editorEl = document.getElementById('entryEditor');

        displayEl.classList.add('hidden');
        editorEl.classList.remove('hidden');

        editorEl.innerHTML = `
            <div class="editor-header">
                <h2>${entry ? 'Edit Entry' : 'New Entry'}</h2>
                <div class="editor-actions">
                    <button class="btn-save" onclick="app.saveEntry()">
                        <i class="fas fa-save"></i>
                        Save
                    </button>
                    <button class="btn-icon" onclick="app.cancelEdit()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="editor-form">
                <div class="form-group">
                    <label for="entryTitle">Title (optional)</label>
                    <input type="text" id="entryTitle" class="form-input" placeholder="Give your entry a title..." value="${entry?.title || ''}">
                </div>
                
                <div class="form-group">
                    <label>How are you feeling?</label>
                    <div class="mood-selector">
                        <button type="button" class="mood-btn ${entry?.mood === 'happy' ? 'selected' : ''}" data-mood="happy">
                            <i class="fas fa-smile"></i>
                            Happy
                        </button>
                        <button type="button" class="mood-btn ${entry?.mood === 'neutral' ? 'selected' : ''}" data-mood="neutral">
                            <i class="fas fa-meh"></i>
                            Neutral
                        </button>
                        <button type="button" class="mood-btn ${entry?.mood === 'sad' ? 'selected' : ''}" data-mood="sad">
                            <i class="fas fa-frown"></i>
                            Sad
                        </button>
                        <button type="button" class="mood-btn ${entry?.mood === 'love' ? 'selected' : ''}" data-mood="love">
                            <i class="fas fa-heart"></i>
                            Loving
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="entryContent">Your thoughts</label>
                    <textarea id="entryContent" class="form-input form-textarea" placeholder="What's on your mind today? Write about your experiences, thoughts, feelings, or anything you'd like to remember...">${entry?.content || ''}</textarea>
                    <div class="form-footer">
                        <span id="charCount">0 characters</span>
                        <span>Ctrl+S to save • Esc to cancel</span>
                    </div>
                </div>
            </div>
        `;

        // Setup mood selector
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                e.target.closest('.mood-btn').classList.add('selected');
            });
        });

        // Setup character counter
        const textarea = document.getElementById('entryContent');
        const charCount = document.getElementById('charCount');
        const updateCharCount = () => {
            charCount.textContent = `${textarea.value.length} characters`;
        };
        textarea.addEventListener('input', updateCharCount);
        updateCharCount();

        // Setup keyboard shortcuts
        document.addEventListener('keydown', this.handleEditorKeydown.bind(this));

        // Focus on content
        textarea.focus();
    }

    handleEditorKeydown(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.saveEntry();
        } else if (e.key === 'Escape') {
            this.cancelEdit();
        }
    }

    saveEntry() {
        const title = document.getElementById('entryTitle').value;
        const content = document.getElementById('entryContent').value;
        const selectedMood = document.querySelector('.mood-btn.selected');
        const mood = selectedMood ? selectedMood.dataset.mood : null;

        const existingEntry = this.getCurrentEntry();
        const now = new Date().toISOString();

        if (existingEntry) {
            existingEntry.title = title;
            existingEntry.content = content;
            existingEntry.mood = mood;
            existingEntry.updatedAt = now;
        } else {
            const newEntry = {
                id: Date.now().toString(),
                date: this.currentDate,
                title,
                content,
                mood,
                createdAt: now,
                updatedAt: now
            };
            this.entries.push(newEntry);
        }

        this.saveEntries();
        this.renderDiaryView();
        document.removeEventListener('keydown', this.handleEditorKeydown);
    }

    cancelEdit() {
        this.renderDiaryView();
        document.removeEventListener('keydown', this.handleEditorKeydown);
    }

    deleteEntry(entryId) {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.entries = this.entries.filter(entry => entry.id !== entryId);
            this.saveEntries();
            this.renderDiaryView();
        }
    }

    renderRecentEntries() {
        const recentEntries = this.entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        const listEl = document.getElementById('recentEntriesList');
        
        if (recentEntries.length === 0) {
            listEl.innerHTML = '<p style="color: #6b7280; font-style: italic; text-align: center;">No entries yet</p>';
            return;
        }

        listEl.innerHTML = recentEntries.map(entry => `
            <div class="entry-item" onclick="app.selectDate('${entry.date}')">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                <div class="entry-title">${entry.title || 'Untitled Entry'}</div>
            </div>
        `).join('');
    }

    selectDate(date) {
        this.currentDate = date;
        this.updateCurrentDateDisplay();
        this.renderDiaryView();
    }

    renderCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Update header
        document.getElementById('calendarMonth').textContent = 
            this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Generate calendar grid
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().toDateString();

        let calendarHTML = '';
        
        // Week day headers
        weekDays.forEach(day => {
            calendarHTML += `<div class="calendar-day">${day}</div>`;
        });

        // Empty cells for days before first day of month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-date"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const hasEntry = this.entries.some(entry => entry.date === dateStr);
            const isToday = date.toDateString() === today;

            calendarHTML += `
                <div class="calendar-date ${isToday ? 'today' : ''} ${hasEntry ? 'has-entry' : ''}" 
                     onclick="app.selectDateFromCalendar('${dateStr}')">
                    ${day}
                </div>
            `;
        }

        document.getElementById('calendarGrid').innerHTML = calendarHTML;
    }

    selectDateFromCalendar(date) {
        this.currentDate = date;
        this.switchView('diary');
        this.updateCurrentDateDisplay();
        this.renderDiaryView();
    }

    renderSearchResults(query) {
        const resultsEl = document.getElementById('searchResults');
        
        if (!query) {
            resultsEl.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <h3>Search your diary</h3>
                    <p>Enter keywords to find specific entries, thoughts, or experiences.</p>
                </div>
            `;
            return;
        }

        const filteredEntries = this.entries.filter(entry => 
            entry.title.toLowerCase().includes(query.toLowerCase()) ||
            entry.content.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredEntries.length === 0) {
            resultsEl.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-file-alt"></i>
                    <h3>No entries found</h3>
                    <p>Try searching with different keywords or check your spelling.</p>
                </div>
            `;
            return;
        }

        const resultsHTML = `
            <div style="margin-bottom: 1rem;">
                <p style="color: #6b7280; font-size: 0.875rem;">
                    Found ${filteredEntries.length} result${filteredEntries.length !== 1 ? 's' : ''} for "${query}"
                </p>
            </div>
            ${filteredEntries.map(entry => `
                <div class="search-result" onclick="app.selectEntryFromSearch('${entry.date}')">
                    <div class="search-result-header">
                        <div class="search-result-title">
                            ${this.highlightText(entry.title || 'Untitled Entry', query)}
                        </div>
                        <div class="search-result-date">
                            <i class="fas fa-calendar"></i>
                            ${new Date(entry.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>
                    ${entry.content ? `
                        <div class="search-result-content">
                            ${this.highlightText(entry.content.substring(0, 200) + '...', query)}
                        </div>
                    ` : ''}
                    <div class="search-result-footer">
                        <div class="search-result-meta">
                            ${entry.content.length} characters
                        </div>
                        <div class="search-result-action">
                            Read more →
                        </div>
                    </div>
                </div>
            `).join('')}
        `;

        resultsEl.innerHTML = resultsHTML;
    }

    selectEntryFromSearch(date) {
        this.currentDate = date;
        this.switchView('diary');
        this.updateCurrentDateDisplay();
        this.renderDiaryView();
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    getMoodIcon(mood) {
        const icons = {
            happy: '<i class="fas fa-smile"></i>',
            neutral: '<i class="fas fa-meh"></i>',
            sad: '<i class="fas fa-frown"></i>',
            love: '<i class="fas fa-heart"></i>'
        };
        return icons[mood] || '';
    }

    formatTime(dateStr) {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    exportEntries() {
        if (this.entries.length === 0) {
            alert('No entries to export!');
            return;
        }

        const dataStr = JSON.stringify(this.entries, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `diary-entries-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    loadEntries() {
        const saved = localStorage.getItem('diary-entries');
        return saved ? JSON.parse(saved) : [];
    }

    saveEntries() {
        localStorage.setItem('diary-entries', JSON.stringify(this.entries));
    }
}

// Initialize the app
const app = new DiaryApp();