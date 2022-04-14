import noteModel, { ADD_NOTE, EDIT_NOTE } from './note.model.mjs';

import { getFormattedDate, parseDates } from '../utils/dates.utils.mjs';

const noteFormModel = {
  populateForm(note) {
    const nameFiled = document.querySelector('#nameField');
    const categorySelect = document.querySelector('#categorySelect');
    const contentField = document.querySelector('#contentField');

    nameFiled.value = note.name;
    categorySelect.value = note.category;
    contentField.value = note.content;
  },

  open(type, note) {
    this.noteFormWrapper.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    this.noteFormBtn.innerText = type;

    if (type === 'Edit') {
      this.populateForm(note);
      this.noteForm.onsubmit = (e) => this.onNoteEdit(e, note);
    } else if (type === 'Add') {
      this.noteForm.reset();
      this.noteForm.onsubmit = this.onNoteAdd.bind(this);
    }
  },

  close() {
    this.noteFormWrapper.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  },

  onNoteAdd(e) {
    e.preventDefault();

    const noteFormData = Object.fromEntries(
      new FormData(this.noteForm).entries()
    );

    const note = {
      id: Date.now().toString(),
      ...noteFormData,
      archived: false,
      dates: parseDates(noteFormData.content),
      createdAt: getFormattedDate(new Date()),
    };

    noteModel.handleAction({ type: ADD_NOTE, payload: note });

    this.noteForm.reset();
    this.close();
  },

  onNoteEdit(e, prevNote) {
    e.preventDefault();

    const noteFormData = Object.fromEntries(
      new FormData(this.noteForm).entries()
    );

    const editedNote = {
      ...prevNote,
      ...noteFormData,
      dates: parseDates(noteFormData.content),
    };

    noteModel.handleAction({ type: EDIT_NOTE, payload: editedNote });

    this.noteForm.reset();
    this.close();
  },

  _init() {
    this.noteFormWrapper = document.querySelector('#noteFormWrapper');
    this.noteFormBtn = document.querySelector('#noteFormBtn');
    this.noteForm = document.querySelector('#noteForm');

    const closeNoteBtn = document.querySelector('#closeFormBtn');

    closeNoteBtn.addEventListener('click', this.close.bind(this));
  },
};

noteFormModel._init();

export default noteFormModel;
