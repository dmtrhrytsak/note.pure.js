import noteFormModel from './note-form.model.mjs';
import statisticsModel from './statistics.model.mjs';

export const ADD_NOTE = 'ADD_NOTE';
export const EDIT_NOTE = 'EDIT_NOTE';
export const REMOVE_NOTE = 'REMOVE_NOTE';
export const TOGGLE_NOTE_ARCHIVED = 'TOGGLE_NOTE_ARCHIVED';

const noteModel = {
  createNoteRow({ id, name, category, content, archived, createdAt }) {
    return `
      <tr data-note-id=${id}>
        <td class="p-4 border border-slate-300 font-semibold">
          <div class="flex items-center">
            ${this.chooseCategoryIcon(category)}

            <div>
            <p>
              ${name}
            </p>

            <div class="flex space-x-1 text-sm text-blue-500">
              <button class="underline" id="editNoteBtn">Edit</button>
              ${
                archived
                  ? `<button class="underline" data-action-type="${TOGGLE_NOTE_ARCHIVED}">Unarchive</button>`
                  : `<button class="underline" data-action-type="${TOGGLE_NOTE_ARCHIVED}">Archive</button>`
              }
              
              <button class="underline" data-action-type="${REMOVE_NOTE}">Remove</button>
            </div>
          </div>
          </div>
        </td>
        <td class="p-4 border border-slate-300 text-gray-600 overflow-x-auto">${createdAt}</td>
        <td class="p-4 border border-slate-300 text-gray-600 overflow-x-auto">${category}</td>
        <td class="p-4 border border-slate-300 text-gray-600 overflow-x-auto">${content}</td>
        <td class="p-4 border border-slate-300 text-gray-600 overflow-x-auto"></td>
      </tr>
    `;
  },

  chooseCategoryIcon(category) {
    const icons = {
      task: `
        <span class="inline-block w-10 h-10 p-2 mr-3 rounded-full bg-blue-700 text-center">
          <i class="fa-solid fa-dolly text-blue-200"></i>
        </span>
      `,
      thought: `
        <span class="inline-block w-10 h-10 p-2 mr-3 rounded-full bg-indigo-700 text-center">
          <i class="fa-solid fa-message text-indigo-200"></i>
        </span>
      `,
      idea: `
        <span class="inline-block w-10 h-10 p-2 mr-3 rounded-full bg-green-700 text-center">
          <i class="fa-solid fa-lightbulb text-green-200"></i>
        </span>
      `,
      quote: `
        <span class="inline-block w-10 h-10 p-2 mr-3 rounded-full bg-teal-700 text-center">
          <i class="fa-solid fa-quote-left text-teal-200"></i>
        </span>
      `,
    };

    return icons[category];
  },

  save() {
    localStorage.setItem('notes', JSON.stringify(this.savedNotes));
  },

  handleClick(e) {
    const target = e.target;
    const actionType = e.target.dataset.actionType;

    const noteRow = e.target.closest('tr');
    const noteId = noteRow?.dataset.noteId;

    if (actionType) {
      this.handleAction({ type: actionType, payload: noteId });
    } else if (target.id === 'editNoteBtn') {
      const note = this.savedNotes.find((savedNote) => savedNote.id === noteId);

      noteFormModel.open('Edit', note);
    } else if (target.id === 'createNoteBtn') {
      noteFormModel.open('Add');
    }
  },

  handleAction(action) {
    switch (action.type) {
      case ADD_NOTE: {
        this.savedNotes = [...this.savedNotes, action.payload];

        break;
      }

      case EDIT_NOTE: {
        this.savedNotes = this.savedNotes.map((savedNote) =>
          savedNote.id === action.payload.id ? action.payload : savedNote
        );

        break;
      }

      case REMOVE_NOTE: {
        this.savedNotes = this.savedNotes.filter(
          (savedNote) => savedNote.id !== action.payload
        );

        break;
      }

      case TOGGLE_NOTE_ARCHIVED: {
        this.savedNotes = this.savedNotes.map((savedNote) => ({
          ...savedNote,
          archived:
            savedNote.id === action.payload
              ? !savedNote.archived
              : savedNote.archived,
        }));

        break;
      }

      default:
        break;
    }

    this.save();
    this.render();
    statisticsModel.showCalculations(this.savedNotes);
  },

  render() {
    const activeNotes = this.savedNotes.filter(
      (savedNote) => !savedNote.archived
    );
    const archivedNotes = this.savedNotes.filter(
      (savedNote) => savedNote.archived
    );

    this.activeNotes.innerHTML = activeNotes
      .map((activeNote) => this.createNoteRow(activeNote))
      .join('');
    this.archivedNotes.innerHTML = archivedNotes
      .map((archivedNote) => this.createNoteRow(archivedNote))
      .join('');
  },

  _init() {
    this.savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

    this.activeNotes = document.querySelector('#activeNotes');
    this.archivedNotes = document.querySelector('#archivedNotes');

    document.addEventListener('click', this.handleClick.bind(this));

    this.render();
    statisticsModel.showCalculations(this.savedNotes);
  },
};

noteModel._init();

export default noteModel;
