import { Dish, Person, Assignments } from '../types';
import { FiLink } from 'react-icons/fi';

interface AssignmentTableProps {
  people: Person[];
  dishes: Dish[];
  assignments: Assignments;
  onAssignDish: (person: Person, dishId: Dish['id']) => void;
}

export const AssignmentTable = ({
  people,
  dishes,
  assignments,
  onAssignDish,
}: AssignmentTableProps) => {
  if (people.length === 0 || dishes.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <FiLink className="text-primary-600" />
        <h2 className="text-xl font-bold">توزيع الأطباق</h2>
      </div>

      <div className="space-y-6">
        {dishes.map((dish) => {
          const assignedPeople = Object.entries(assignments)
            .filter(([_, dishIds]) => dishIds.includes(dish.id))
            .map(([person]) => person);
          const costPerPerson =
            assignedPeople.length > 0
              ? (dish.price * dish.quantity) / assignedPeople.length
              : 0;

          return (
            <div
              key={dish.id}
              className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-purple-100 dark:border-gray-700"
            >
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{dish.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {(dish.price * dish.quantity).toFixed(2)}⃁
                    {assignedPeople.length > 0 && (
                      <>
                        {' '}
                        • مقسم على {assignedPeople.length} أشخاص •{' '}
                        {costPerPerson.toFixed(2)}⃁ للشخص
                      </>
                    )}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`badge ${
                      assignedPeople.length > 0
                        ? 'badge-primary'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {assignedPeople.length > 0
                      ? `${assignedPeople.length} مشارك`
                      : 'غير موزع'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {people.map((person) => (
                  <label
                    key={`${dish.id}-${person}`}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(assignments[person] || []).includes(dish.id)}
                      onChange={() => onAssignDish(person, dish.id)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      aria-label={`تعيين ${dish.name} لـ ${person}`}
                    />
                    <span className="flex-1">{person}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};