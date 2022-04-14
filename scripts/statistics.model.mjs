const statisticsModel = {
  createStatisticRow({ category, items }) {
    return `
      <tr>
        <td class="p-4 border border-slate-300 font-semibold">
          <div>
           ${category}
          </div>
        </td>
        <td class="p-4 border border-slate-300 text-gray-600">
          <div>
            ${items.active}
          </div>
        </td>
        <td class="p-4 border border-slate-300 text-gray-600">
          <div>
            ${items.archived}
          </div>
        </td>
      </tr>
    `;
  },

  calculate(savedNotes) {
    const statistics = [];

    for (const category of this.categories) {
      const currentCalculations = { category };
      const items = savedNotes.filter(
        (savedNote) => savedNote.category === category
      );

      const groupedItems = items.reduce(
        (groupedItems, savedNote) => {
          const state = savedNote.archived ? 'archived' : 'active';
          groupedItems[state] = groupedItems[state] + 1 || 1;

          return groupedItems;
        },
        {
          active: 0,
          archived: 0,
        }
      );

      currentCalculations.items = groupedItems;

      statistics.push(currentCalculations);
    }

    return statistics;
  },

  showCalculations(savedNotes) {
    const calculations = this.calculate(savedNotes);

    this.statistics.innerHTML = calculations
      .map(this.createStatisticRow)
      .join('');
  },

  _init() {
    this.categories = ['task', 'thought', 'idea', 'quote'];
    this.statistics = document.querySelector('#statistics');
  },
};

statisticsModel._init();

export default statisticsModel;
