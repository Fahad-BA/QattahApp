import { useState } from 'react';
import { Person } from '../types';
import { FiUserPlus, FiUsers } from 'react-icons/fi';

interface PeopleListProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onRemovePerson?: (person: Person) => void;
  maxPeople?: number;
}

export const PeopleList = ({
  people,
  onAddPerson,
  onRemovePerson,
  maxPeople = 15,
}: PeopleListProps) => {
  const [newPerson, setNewPerson] = useState('');

  const handleAdd = () => {
    if (newPerson.trim() && people.length < maxPeople) {
      onAddPerson(newPerson.trim());
      setNewPerson('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiUsers className="text-primary-600" />
          الأفراد ({people.length}/{maxPeople})
        </h2>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="أدخل اسم الشخص..."
          className="input-field rounded-r-none"
          aria-label="اسم الشخص الجديد"
        />
        <button
          onClick={handleAdd}
          disabled={!newPerson.trim() || people.length >= maxPeople}
          className="btn-primary rounded-l-none flex items-center gap-2"
          aria-label="إضافة شخص"
        >
          <FiUserPlus />
          إضافة
        </button>
      </div>

      {people.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {people.map((person) => (
            <div
              key={person}
              className="badge badge-primary flex items-center gap-2 animate-fade-in"
            >
              <span>{person}</span>
              {onRemovePerson && (
                <button
                  onClick={() => onRemovePerson(person)}
                  className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                  aria-label={`حذف ${person}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <FiUsers className="text-4xl mx-auto mb-2 opacity-50" />
          <p>لم يتم إضافة أي أفراد بعد.</p>
          <p className="text-sm mt-1">ابدأ بإضافة الأشخاص المشاركين.</p>
        </div>
      )}

      {people.length >= maxPeople && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
          وصلت إلى الحد الأقصى للأفراد ({maxPeople}). لا يمكن إضافة المزيد.
        </div>
      )}
    </div>
  );
};