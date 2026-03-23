// وظائف مساعدة لتطبيق تقسيم القطه

// حساب التوزيع
export const calculateTotals = (assignments, dishes) => {
  const totals = {};
  
  Object.entries(assignments).forEach(([person, dishIds]) => {
    totals[person] = 0;
    
    dishIds.forEach(dishId => {
      const dish = dishes.find(d => d.id === dishId);
      if (dish) {
        const assignedTo = Object.entries(assignments)
          .filter(([_, ids]) => ids.includes(dishId))
          .length;
        
        totals[person] += (dish.price * dish.quantity) / assignedTo;
      }
    });
  });
  
  return totals;
};

// تحويل العملات (إذا لزم الأمر)
export const convertCurrency = (amount, fromCurrency, toCurrency = 'SAR') => {
  const rates = {
    SAR: 1,
    KWD: 12.2, // مثال: 1 دينار كويتي = 12.2 ريال سعودي
  };
  
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return amount;
  }
  
  return (amount * rates[fromCurrency]) / rates[toCurrency];
};

// التحقق من صحة الإدخال
export const validatePersonName = (name, existingPeople) => {
  if (!name.trim()) {
    return { valid: false, error: 'الرجاء إدخال اسم' };
  }
  if (existingPeople.includes(name.trim())) {
    return { valid: false, error: 'هذا الاسم موجود مسبقاً' };
  }
  if (existingPeople.length >= 15) {
    return { valid: false, error: 'تم الوصول إلى الحد الأقصى للأشخاص (15)' };
  }
  return { valid: true };
};

// التحقق من صحة بيانات الطبق
export const validateDish = (dish) => {
  if (!dish.name.trim()) {
    return { valid: false, error: 'الرجاء إدخال اسم الطبق' };
  }
  if (!dish.price || isNaN(dish.price) || parseFloat(dish.price) <= 0) {
    return { valid: false, error: 'الرجاء إدخال سعر صحيح' };
  }
  if (!dish.quantity || isNaN(dish.quantity) || parseInt(dish.quantity) < 1) {
    return { valid: false, error: 'الرجاء إدخال كمية صحيحة' };
  }
  return { valid: true };
};