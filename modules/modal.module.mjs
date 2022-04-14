const modal = {
  open() {
    this.createNoteModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  },
  close() {
    this.createNoteModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  },
  _init() {
    this.createNoteModal = document.querySelector('#createNoteModal');

    const createNoteBtn = document.querySelector('#createNoteBtn');
    const closeNoteBtn = document.querySelector('#closeModalBtn');

    createNoteBtn.addEventListener('click', this.open.bind(this));
    closeNoteBtn.addEventListener('click', this.close.bind(this));
  },
};

modal._init();

export default modal;
