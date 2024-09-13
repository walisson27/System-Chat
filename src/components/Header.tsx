import { toggleDarkMode } from '@/utils/themeSwitcher';

export const Header = () => (
  <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
    <h3 className="text-lg font-semibold">Chat</h3>
    <button onClick={toggleDarkMode} className="ml-4 p-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white">
      Toggle Dark Mode
    </button>
  </div>
);
