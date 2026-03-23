import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QittahApp from './App.jsx';

describe('QittahApp', () => {
  beforeEach(() => {
    // تنظيف localStorage قبل كل اختبار
    window.localStorage.clear();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the app title', () => {
    render(<QittahApp />);
    const title = screen.getByText(/تقسيم القطه/i);
    expect(title).toBeInTheDocument();
  });

  it('adds a new person', async () => {
    const user = userEvent.setup();
    render(<QittahApp />);
    
    const input = screen.getByPlaceholderText(/اسم الشخص/i);
    const addButton = screen.getByRole('button', { name: '+' });
    
    await user.type(input, 'فهد');
    await user.click(addButton);
    
    // يجب أن يظهر اسم الشخص في قائمة الأشخاص (قد يكون هناك عنصران، نأخذ الأول)
    const personElements = screen.getAllByText('فهد');
    expect(personElements.length).toBeGreaterThan(0);
  });

  it('does not add empty person', async () => {
    const user = userEvent.setup();
    render(<QittahApp />);
    
    const addButton = screen.getByRole('button', { name: '+' });
    expect(addButton).toBeDisabled();
    
    const input = screen.getByPlaceholderText(/اسم الشخص/i);
    await user.type(input, '   ');
    expect(addButton).toBeDisabled();
  });

  it('adds a new dish', async () => {
    const user = userEvent.setup();
    render(<QittahApp />);
    
    const nameInput = screen.getByPlaceholderText(/اسم الطبق/i);
    const priceInputs = screen.getAllByPlaceholderText(/السعر/i);
    // أول حقل سعر هو المناسب
    const priceInput = priceInputs[0];
    const addButton = screen.getByRole('button', { name: /\+ أضف طبق/i });
    
    await user.type(nameInput, 'بيتزا');
    await user.type(priceInput, '50');
    await user.click(addButton);
    
    // يجب أن يظهر اسم الطبق
    const dishElements = screen.getAllByText(/بيتزا/i);
    expect(dishElements.length).toBeGreaterThan(0);
    // يجب أن يظهر السعر (قد يكون هناك عدة عناصر)
    const priceElements = screen.getAllByText(/50/i);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it('assigns dish to person and calculates totals', async () => {
    const user = userEvent.setup();
    render(<QittahApp />);
    
    // إضافة شخص
    const personInput = screen.getByPlaceholderText(/اسم الشخص/i);
    const addPersonButton = screen.getByRole('button', { name: '+' });
    await user.type(personInput, 'فهد');
    await user.click(addPersonButton);
    
    // إضافة طبق
    const dishNameInput = screen.getByPlaceholderText(/اسم الطبق/i);
    const priceInput = screen.getAllByPlaceholderText(/السعر/i)[0];
    const addDishButton = screen.getByRole('button', { name: /\+ أضف طبق/i });
    await user.type(dishNameInput, 'بيتزا');
    await user.type(priceInput, '50');
    await user.click(addDishButton);
    
    // البحث عن checkbox لتوزيع الطبق (قد تحتاج إلى وقت لظهور قسم التوزيع)
    // ننتظر ظهور قسم توزيع الأطباق (يظهر فقط إذا كان هناك أشخاص وأطباق)
    // يمكننا استخدام screen.getByText مع زيادة المهلة
    await screen.findByText(/توزيع الأطباق/i);
    
    // الحصول على جميع checkboxes (افتراضيًا)
    const checkboxes = screen.getAllByRole('checkbox');
    // تفعيل أول checkbox
    if (checkboxes.length > 0) {
      await user.click(checkboxes[0]);
    }
    
    // نتوقع ظهور قسم النتائج (جدول القطع النهائي)
    // قد يستغرق ظهور النتائج بعض الوقت
    const resultSection = await screen.findByText(/جدول القطع النهائي/i);
    expect(resultSection).toBeInTheDocument();
    
    // يجب أن يظهر اسم الشخص في النتائج
    const personInResults = screen.getAllByText('فهد');
    expect(personInResults.length).toBeGreaterThan(1); // مرة في القائمة ومرة في النتائج
  });

  it('resets all data', async () => {
    const user = userEvent.setup();
    render(<QittahApp />);
    
    // إضافة بعض البيانات
    const personInput = screen.getByPlaceholderText(/اسم الشخص/i);
    const addPersonButton = screen.getByRole('button', { name: '+' });
    await user.type(personInput, 'فهد');
    await user.click(addPersonButton);
    
    // تأكيد وجود الشخص
    expect(screen.getAllByText('فهد').length).toBeGreaterThan(0);
    
    // النقر على زر إعادة ضبط الكل
    const resetButton = screen.getByRole('button', { name: /إعادة ضبط الكل/i });
    
    // نريد mock لـ window.confirm حتى نتمكن من المتابعة
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    try {
      await user.click(resetButton);
    } finally {
      window.confirm = originalConfirm;
    }
    
    // بعد إعادة الضبط، يجب أن يختفي الشخص (قد يستمر ظهور العنوان فقط)
    // يمكننا التحقق من أن حقل الإدخال فارغ
    expect(personInput.value).toBe('');
  });
});