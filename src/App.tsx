import { useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PeopleList } from './components/PeopleList';
import { DishList } from './components/DishList';
import { AssignmentTable } from './components/AssignmentTable';
import { ResultsTable } from './components/ResultsTable';
import { DarkModeToggle } from './components/DarkModeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateTotals } from './utils/calculations';
import type { Dish, Person, Assignments, NewDish } from './types';
import { FiMoon, FiSun, FiRefreshCw, FiShare, FiGithub } from 'react-icons/fi';
import { useRef } from 'react';

export default function QattahApp() {
  // State with localStorage persistence
  const [people, setPeople] = useLocalStorage<Person[]>('qattah-people', []);
  const [dishes, setDishes] = useLocalStorage<Dish[]>('qattah-dishes', []);
  const [assignments, setAssignments] = useLocalStorage<Assignments>('qattah-assignments', {});

  // Calculate totals memoized
  const totals = useMemo(
    () => calculateTotals(dishes, assignments, people),
    [dishes, assignments, people]
  );

  // Results table ref
  const resultsRef = useRef<HTMLDivElement>(null);

  // Add person
  const addPerson = useCallback((name: string) => {
    setPeople(prev => [...prev, name]);
    setAssignments(prev => ({ ...prev, [name]: [] }));
  }, [setPeople, setAssignments]);

  // Remove person
  const removePerson = useCallback((person: Person) => {
    if (window.confirm(`هل أنت متأكد من حذف "${person}"؟`)) {
      setPeople(prev => prev.filter(p => p !== person));
      setAssignments(prev => {
        const next = { ...prev };
        delete next[person];
        return next;
      });
    }
  }, [setPeople, setAssignments]);

  // Add dish
  const addDish = useCallback((dish: Omit<Dish, 'id'>) => {
    const newDish: Dish = { ...dish, id: Date.now() };
    setDishes(prev => [...prev, newDish]);
  }, [setDishes]);

  // Remove dish
  const removeDish = useCallback((id: Dish['id']) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطبق؟')) {
      setDishes(prev => prev.filter(d => d.id !== id));
      setAssignments(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(person => {
          next[person] = next[person].filter(dishId => dishId !== id);
        });
        return next;
      });
    }
  }, [setDishes, setAssignments]);

  // Remove all dishes
  const removeAllDishes = useCallback(() => {
    if (window.confirm('هل أنت متأكد من حذف جميع الأطباق؟')) {
      setDishes([]);
      setAssignments(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(person => {
          next[person] = [];
        });
        return next;
      });
    }
  }, [setDishes, setAssignments]);

  // Assign/unassign dish to person
  const assignDishToPerson = useCallback((person: Person, dishId: Dish['id']) => {
    setAssignments(prev => {
      const current = prev[person] || [];
      if (current.includes(dishId)) {
        return { ...prev, [person]: current.filter(id => id !== dishId) };
      } else {
        return { ...prev, [person]: [...current, dishId] };
      }
    });
  }, [setAssignments]);

  // Reset all
  const resetAll = useCallback(() => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط كل البيانات؟ سيتم حذف جميع الأشخاص والأطباق.')) {
      setPeople([]);
      setDishes([]);
      setAssignments({});
    }
  }, [setPeople, setDishes, setAssignments]);

  // Export CSV
  const handleExportCSV = useCallback((csvData: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `qattah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  تقسيم القطه
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  حساب المصاريف والمشاركة بين الأفراد
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Fahad-BA/QattahApp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <div className="flex items-center gap-2">
                <FiSun className="text-yellow-500" />
                <DarkModeToggle />
                <FiMoon className="text-indigo-400" />
              </div>
              <button
                onClick={resetAll}
                className="btn-danger flex items-center gap-2"
                aria-label="إعادة ضبط الكل"
              >
                <FiRefreshCw />
                إعادة ضبط
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: People & Dishes */}
            <div className="lg:col-span-2 space-y-8">
              <PeopleList
                people={people}
                onAddPerson={addPerson}
                onRemovePerson={removePerson}
                maxPeople={15}
              />

              <DishList
                dishes={dishes}
                onAddDish={addDish}
                onRemoveDish={removeDish}
                onRemoveAllDishes={removeAllDishes}
              />

              {people.length > 0 && dishes.length > 0 && (
                <AssignmentTable
                  people={people}
                  dishes={dishes}
                  assignments={assignments}
                  onAssignDish={assignDishToPerson}
                />
              )}
            </div>

            {/* Right column: Results & Actions */}
            <div className="space-y-8">
              <div ref={resultsRef}>
                <ResultsTable
                  people={people}
                  dishes={dishes}
                  assignments={assignments}
                  totals={totals}
                  onExportCSV={handleExportCSV}
                />
              </div>

              {/* Stats & Info */}
              <div className="card">
                <h3 className="font-bold text-lg mb-4">📊 إحصائيات</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                      {people.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">أفراد</div>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-900/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-secondary-700 dark:text-secondary-300">
                      {dishes.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">أطباق</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {Object.keys(totals).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">مشاركين</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      {Object.values(totals).reduce((sum, t) => sum + t, 0).toFixed(2)}﷼
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">المجموع</div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800">
                <h3 className="font-bold text-lg mb-2">💡 نصائح سريعة</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    أضف جميع الأشخاص المشاركين في الفاتورة.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    أدخل كل طلب مع سعره وكميته.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    عيّن لكل طبق الأشخاص الذين شاركوا فيه.
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-12 border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p className="mt-2">
              البيانات تُحفظ تلقائياً في متصفحك • يمكنك استخدام التطبيق دون اتصال
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}