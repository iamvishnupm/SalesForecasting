import axios from './api/axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Menu, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval="preserveEnd"
          />
          <YAxis />
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value) => [Math.round(value), '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="quantity_sold"
            name="Quantity Sold"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="prediction"
            name="Prediction"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DateSelector = ({ selectedYear, selectedMonth, onDateChange, yearOptions }) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex gap-2 mb-4">
      <select
        value={selectedYear}
        onChange={(e) => onDateChange(e.target.value, selectedMonth)}
        className="p-2 border rounded-md bg-white"
      >
        {yearOptions.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        value={selectedMonth}
        onChange={(e) => onDateChange(selectedYear, e.target.value)}
        className="p-2 border rounded-md bg-white"
      >
        {months.map(month => (
          <option key={month} value={month}>
            {String(month).padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
};

const CategoryItem = ({ name, value, children, isExpanded, onToggle, onItemSelect, data }) => {
  return (
    <div className="space-y-2">
      <div
        className="flex items-center cursor-pointer hover:bg-gray-50 py-2"
        onClick={() => {
          onToggle();
          if (onItemSelect) onItemSelect(name, data);
        }}
      >
        {children && (
          <span className="w-5">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        <span className="text-gray-800">{name}</span>
        {value && (
          <span className="ml-2 text-gray-600">
            ${value}
          </span>
        )}
      </div>
      {isExpanded && children && (
        <div className="space-y-2">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { onItemSelect });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const CountrySelector = ({ selectedCountry, onCountryChange }) => {
  const countries = ['All', 'India', 'Canada', 'USA', 'UAE', 'Italy'];

  return (
    <select
      value={selectedCountry}
      onChange={(e) => onCountryChange(e.target.value)}
      className="w-full p-2 border rounded-md mb-4 bg-white"
    >
      {countries.map(country => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

const DataTable = ({ data, selectedYear, selectedMonth }) => {
  // Get the number of days in the selected month and year
  const numDays = new Date(selectedYear, selectedMonth, 0).getDate();

  // Generate the date columns based on the selected year and month
  const dateCols = Array.from({ length: numDays }, (_, i) =>
    `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
  );
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-3">Information</th>
            {dateCols.map((day) => (
              <th key={day} className="text-left p-3 min-w-[120px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t">
              <td className="p-3">{row.information}</td>
              {dateCols.map((day) => (
                <td key={day} className="p-3">{row[day] || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState(2021);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('electronics');
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({}); // Only declare this once
  const [error, setError] = useState(null);
  const [yearOptions, setYearOptions] = useState([]); // State for fetched years
  const [chartData, setChartData] = useState([]);


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/data/', {
          params: { type: 'category' },
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Unable to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch year
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get('/data/', {
          params: { type: 'year' },
        });
        setYearOptions(response.data.years || []); // Assuming response includes 'years'
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, []);

  // fetchPredictionData
  useEffect(() => {
    const fetchPredictionData = async () => {
      if (!selectedCategory) return;

      try {
        const response = await axios.get('/prediction/', {
          params: {
            category: selectedCategory,
            year: selectedYear,
            month: selectedMonth,
          }
        });
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
        setError("Unable to fetch prediction data.");
      }
    };

    fetchPredictionData();
  }, [selectedYear, selectedMonth, selectedCategory]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/salesdata/filtered_data/', {
          params: {
            category: selectedCategory,
            year: selectedYear,
            month: selectedMonth,
          }
        });

        const apiData = response.data;

        // Transform the data to match the table structure
        const transformedData = [
          { information: 'Quantity Sold', ...formatData(apiData, 'quantity_sold') },
          { information: 'Forecast', ...formatData(apiData, 'forecast') },
          { information: 'Revenue', ...formatData(apiData, 'revenue') }
        ];

        setTableData(transformedData);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Unable to fetch sales data.");
      }
    };

    if (selectedCategory) {
      fetchSalesData();
    }
  }, [selectedYear, selectedMonth, selectedCategory]);

  const formatData = (itemData = [], key) => {
    return itemData.reduce((acc, curr) => {
      acc[curr.Date] = curr[key] || '';
      return acc;
    }, {});
  };

  const handleDateChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const [leftSectionsVisible, setLeftSectionsVisible] = useState({
    navigation: true,
    categories: true
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSection = (section) => {
    setLeftSectionsVisible(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleItemSelect = (item, itemData) => {
    setSelectedCategory(item);
    if (!itemData || itemData.length === 0) {
      return; // Exit if itemData is empty
    }

    // Transform the data for display
    const transformedData = [
      { information: 'Quantity Sold', ...formatData(itemData, 'quantity_sold') },
      { information: 'Forecast', ...formatData(itemData, 'forecast') },
      { information: 'Revenue', ...formatData(itemData, 'revenue') }
    ];
    setTableData(transformedData);
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
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded"><Link to="/demand">📈 Demand</Link></div>
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded"><Link to="/inventory">📦 Inventory</Link></div>
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded"><Link to="/">📊 Dashboard</Link></div>
          </div>
        </div>
      )}

      {leftSectionsVisible.categories && (
        <div className="w-72 bg-white pb-0 p-4 border-r fixed top-0 bottom-0" style={{ left: leftSectionsVisible.navigation ? '12rem' : '0' }}>
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
                onItemSelect={() => handleItemSelect(category)}
                data={null}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{
          marginLeft: `${(leftSectionsVisible.navigation ? 12 : 0) + (leftSectionsVisible.categories ? 18 : 0)}rem`
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

        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {selectedCategory ? selectedCategory : 'Overview'}: Daily Data
            </h2>
            <span className="text-gray-600">
              Country: {selectedCountry}
            </span>
          </div>

          <DateSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onDateChange={handleDateChange}
            yearOptions={yearOptions} // Pass fetched years here
          />


          <DataTable data={tableData}
            selectedYear={selectedYear} selectedMonth={selectedMonth} />

          <div>
            <h2 className="text-xl font-bold mb-4">Performance Trends</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="quantity_sold"
                    name="Quantity Sold"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="prediction"
                    name="Prediction"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;