import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layers } from 'lucide-react';

const Inventory = () => {
  const [leftSectionsVisible, setLeftSectionsVisible] = useState({
    navigation: true,
    categories: true,
  });

  const toggleSection = (section) => {
    setLeftSectionsVisible((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {leftSectionsVisible.navigation && (
        <div className="w-48 bg-gray-800 text-white p-4 fixed top-0 bottom-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Menu</span>
              <Menu
                className="cursor-pointer text-gray-300 hover:text-white"
                onClick={() => toggleSection('navigation')}
                size={20}
              />
            </div>
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded">
              <Link to="/demand">📈 Demand</Link>
            </div>
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded">
              <Link to="/inventory">📦 Inventory</Link>
            </div>
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded">
              <Link to="/">📊 Dashboard</Link>
            </div>
          </div>
        </div>
      )}

      {leftSectionsVisible.categories && (
        <div
          className="w-72 bg-white p-4 border-r fixed top-0 bottom-0"
          style={{ left: leftSectionsVisible.navigation ? '12rem' : '0' }}
        >
          <div className="sticky top-0 bg-white z-10 pb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Categories</span>
              <Layers
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => toggleSection('categories')}
              />
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              <p className="text-gray-500">Category list will go here</p>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{
          marginLeft: `${(leftSectionsVisible.navigation ? 12 : 0) + (leftSectionsVisible.categories ? 18 : 0)}rem`,
        }}
      >
        <div className="flex gap-2 mb-4">
          {!leftSectionsVisible.navigation && (
            <div
              className="flex items-center gap-2 bg-gray-800 text-white p-2 rounded cursor-pointer"
              onClick={() => toggleSection('navigation')}
            >
              <Menu size={20} />
              <span>Show Menu</span>
            </div>
          )}
          {!leftSectionsVisible.categories && (
            <div
              className="flex items-center gap-2 bg-white border p-2 rounded cursor-pointer"
              onClick={() => toggleSection('categories')}
            >
              <Layers size={20} />
              <span>Show Categories</span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Inventory Page</h2>
          <p>Inventory-specific content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
