import { Dish, Assignments, Totals } from '../types';

/**
 * حساب المبالغ المستحقة على كل شخص بناءً على الأطباق المعينة.
 * Builds a reverse index (dishId → people) for O(n) performance.
 */
export const calculateTotals = (
  dishes: Dish[],
  assignments: Assignments,
  people: string[]
): Totals => {
  const totals: Totals = {};
  const hasPerson = new Set(people);

  // Build reverse index: dishId → assigned people
  const dishToPeople = new Map<number, string[]>();
  for (const [person, dishIds] of Object.entries(assignments)) {
    if (!hasPerson.has(person)) continue;
    for (const dishId of dishIds) {
      if (!dishToPeople.has(dishId)) {
        dishToPeople.set(dishId, []);
      }
      dishToPeople.get(dishId)!.push(person);
    }
  }

  // Initialize totals
  for (const person of people) {
    totals[person] = 0;
  }

  // Calculate shares
  for (const dish of dishes) {
    const assignedPeople = dishToPeople.get(dish.id);
    if (!assignedPeople || assignedPeople.length === 0) continue;

    const costPerPerson = (dish.price * dish.quantity) / assignedPeople.length;
    for (const person of assignedPeople) {
      totals[person] += costPerPerson;
    }
  }

  return totals;
};

/**
 * حساب المجموع الكلي للفاتورة.
 */
export const calculateGrandTotal = (totals: Totals): number =>
  Object.values(totals).reduce((sum, total) => sum + total, 0);

/**
 * إنشاء بيانات CSV من الحالة الحالية.
 */
export const generateCSVData = (
  people: string[],
  dishes: Dish[],
  assignments: Assignments,
  totals: Totals
): string => {
  const headers = ['الاسم', 'الأطباق', 'المبلغ', 'ملاحظات'];
  const rows = people.map(person => {
    const dishNames = (assignments[person] || [])
      .map(id => dishes.find(d => d.id === id)?.name)
      .filter(Boolean)
      .join('، ');
    return [
      person,
      dishNames || 'لا يوجد',
      totals[person]?.toFixed(2) || '0.00',
      (assignments[person] || []).length > 0 ? '' : 'لم يُعيّن له أي أطباق'
    ];
  });

  const grandTotal = calculateGrandTotal(totals);
  rows.push(['المجموع', '', grandTotal.toFixed(2), '']);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * إنشاء رابط مشاركة يحتوي على البيانات مشفرة.
 */
export const createShareableLink = (
  people: string[],
  dishes: Dish[],
  assignments: Assignments
): string => {
  const state = {
    people,
    dishes,
    assignments
  };
  const encoded = btoa(JSON.stringify(state));
  return `${window.location.origin}${window.location.pathname}?state=${encoded}`;
};

/**
 * تحليل رابط المشاركة واستخراج البيانات.
 */
export const parseShareableLink = (
  encoded: string
): { people: string[]; dishes: Dish[]; assignments: Assignments } | null => {
  try {
    const decoded = atob(encoded);
    const state = JSON.parse(decoded);
    return state;
  } catch {
    return null;
  }
};