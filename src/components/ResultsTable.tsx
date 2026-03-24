import { Dish, Person, Assignments, Totals } from '../types';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';
import { generateCSVData } from '../utils/calculations';

interface ResultsTableProps {
  people: Person[];
  dishes: Dish[];
  assignments: Assignments;
  totals: Totals;
  onPrint?: () => void;
  onExportCSV?: (csvData: string) => void;
  onShare?: (url: string) => void;
}

export const ResultsTable = ({
  people,
  dishes,
  assignments,
  totals,
  onPrint,
  onExportCSV,
  onShare,
}: ResultsTableProps) => {
  if (Object.keys(totals).length === 0) return null;

  const grandTotal = Object.values(totals).reduce((sum, total) => sum + total, 0);

  const handleExport = () => {
    const csvData = generateCSVData(people, dishes, assignments, totals);
    if (onExportCSV) onExportCSV(csvData);
    else {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `qattah_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-green-600 text-2xl" />
          <h2 className="text-xl font-bold">جدول القطع النهائي</h2>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2 text-sm"
            aria-label="تصدير البيانات"
          >
            <FiDownload />
            تصدير
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {people.map((person) => {
          const assignedDishes = (assignments[person] || [])
            .map((id) => dishes.find((d) => d.id === id))
            .filter(Boolean) as Dish[];

          return (
            <div
              key={person}
              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-green-100 dark:border-gray-700 animate-fade-in"
            >
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary-700 dark:text-primary-300">
                        {person.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{person}</h3>
                      {assignedDishes.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {assignedDishes.map((d) => d.name).join('، ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {totals[person]?.toFixed(2)}﷼
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                    {assignedDishes.length > 0
                      ? `${assignedDishes.length} طبق`
                      : 'لا يوجد أطباق'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <div className="text-xl font-bold">المجموع الكلي</div>
            <div className="text-sm opacity-90 mt-1">إجمالي المبلغ المستحق على الجميع</div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-4xl font-bold">{grandTotal.toFixed(2)}﷼</div>
            <div className="text-sm opacity-90 text-center mt-1">
              {people.length} أشخاص • {dishes.length} أطباق
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};