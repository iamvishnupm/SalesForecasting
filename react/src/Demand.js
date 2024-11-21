import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import axios from './api/axios';

const CountrySelector = ({ selectedCountry, onCountryChange }) => {
  const countries = ['All', 'India', 'Canada', 'USA', 'UAE', 'Italy'];

  return (
    <select
      value={selectedCountry}
      onChange={(e) => onCountryChange(e.target.value)}
      className="w-full p-2 border rounded-md mb-4 bg-white"
    >
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

const CategoryItem = ({ name, isExpanded, onToggle, children }) => {
  return (
    <div className="space-y-2">
      <div
        className="flex items-center cursor-pointer hover:bg-gray-50 py-2"
        onClick={onToggle}
      >
        {children && (
          <span className="w-5">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        <span className="text-gray-800">{name}</span>
      </div>
      {isExpanded && children && <div className="space-y-2">{children}</div>}
    </div>
  );
};

const Demand = () => {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [leftSectionsVisible, setLeftSectionsVisible] = useState({
    navigation: true,
    categories: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/data/', {
          baseURL: 'http://127.0.0.1:8000/api',
          params: { type: 'category' },
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

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
          className="w-72 bg-white pb-0 p-4 border-r fixed top-0 bottom-0"
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

            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>

          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {categories.map((category) => (
              <CategoryItem
                key={category}
                name={category}
                isExpanded={expandedCategories[category]}
                onToggle={() => toggleCategory(category)}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{
          marginLeft: `${
            (leftSectionsVisible.navigation ? 12 : 0) + (leftSectionsVisible.categories ? 18 : 0)
          }rem`,
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-xl font-bold mb-4">Demand Page Content</h2>
          <p>Welcome to the Demand section! Add your main content here.</p>
        </div>
      </div>
    </div>
  );
};

export default Demand;
