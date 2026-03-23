import { Dish, Assignments, Totals } from '../types';

/**
 * حساب المبالغ المستحقة على كل شخص بناءً على الأطباق المعينة.
 */
export const calculateTotals = (
  dishes: Dish[],
  assignments: Assignments,
  people: string[]
): Totals => {
  const totals: Totals = {};

  people.forEach(person => {
    totals[person] = 0;
  });

  dishes.forEach(dish => {
    const assignedPeople = Object.entries(assignments)
      .filter(([_, dishIds]) => dishIds.includes(dish.id))
      .map(([person]) => person);

    if (assignedPeople.length === 0) return;

    const costPerPerson = (dish.price * dish.quantity) / assignedPeople.length;

    assignedPeople.forEach(person => {
      totals[person] += costPerPerson;
    });
  });

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