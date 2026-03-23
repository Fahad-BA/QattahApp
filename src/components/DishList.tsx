import { useState } from 'react';
import { Dish, NewDish } from '../types';
import { FiPlus, FiTrash2, FiDollarSign, FiPackage } from 'react-icons/fi';

interface DishListProps {
  dishes: Dish[];
  onAddDish: (dish: Omit<Dish, 'id'>) => void;
  onRemoveDish: (id: Dish['id']) => void;
  onRemoveAllDishes: () => void;
}

export const DishList = ({
  dishes,
  onAddDish,
  onRemoveDish,
  onRemoveAllDishes,
}: DishListProps) => {
  const [newDish, setNewDish] = useState<NewDish>({
    name: '',
    price: '',
    quantity: 1,
  });

  const handleAdd = () => {
    if (newDish.name.trim() && newDish.price) {
      onAddDish({
        name: newDish.name.trim(),
        price: parseFloat(newDish.price),
        quantity: parseInt(newDish.quantity.toString()),
      });
      setNewDish({ name: '', price: '', quantity: 1 });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const totalDishesCost = dishes.reduce(
    (sum, dish) => sum + dish.price * dish.quantity,
    0
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiPackage className="text-secondary-600" />
          الأطباق ({dishes.length})
        </h2>
        <button
          onClick={onRemoveAllDishes}
          disabled={dishes.length === 0}
          className="btn-danger text-sm flex items-center gap-2"
          aria-label="حذف جميع الأطباق"
        >
          <FiTrash2 />
          حذف الكل
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={newDish.name}
          onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
          onKeyPress={handleKeyPress}
          placeholder="اسم الطبق (مثال: بيتزا، مشروبات...)"
          className="input-field"
          aria-label="اسم الطبق"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <FiDollarSign className="absolute right-3 top-3.5 text-gray-400" />
            <input
              type="number"
              value={newDish.price}
              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
              placeholder="السعر (مثال: 25.5)"
              className="input-field pr-10"
              step="0.01"
              min="0"
              aria-label="سعر الطبق"
            />
          </div>
          <input
            type="number"
            value={newDish.quantity}
            onChange={(e) =>
              setNewDish({ ...newDish, quantity: parseInt(e.target.value) || 1 })
            }
            placeholder="الكمية"
            className="input-field"
            min="1"
            aria-label="كمية الطبق"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!newDish.name.trim() || !newDish.price}
          className="btn-secondary w-full flex items-center justify-center gap-2"
          aria-label="إضافة طبق"
        >
          <FiPlus />
          إضافة طبق
        </button>
      </div>

      {dishes.length > 0 ? (
        <>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-slide-up"
              >
                <div className="flex-1">
                  <div className="font-medium text-lg">{dish.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {dish.price}﷼ × {dish.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-secondary-700 dark:text-secondary-300">
                    {(dish.price * dish.quantity).toFixed(2)}﷼
                  </span>
                  <button
                    onClick={() => onRemoveDish(dish.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    aria-label={`حذف ${dish.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">المجموع الكلي للأطباق:</span>
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {totalDishesCost.toFixed(2)}﷼
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <FiPackage className="text-4xl mx-auto mb-2 opacity-50" />
          <p>لم يتم إضافة أي أطباق بعد.</p>
          <p className="text-sm mt-1">أضف الأطباق التي تم طلبها.</p>
        </div>
      )}
    </div>
  );
};