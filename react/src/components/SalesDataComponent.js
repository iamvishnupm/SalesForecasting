import axios from '../api/axios';
import React, { useState, useEffect } from 'react';

const PredictionComponent = () => {
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Function to fetch prediction data
    const fetchPredictionData = async () => {
        try {
            let url = '/prediction/';
            const params = {};

            if (selectedCategory) {
                params.category = selectedCategory;
            }
            if (selectedYear) {
                params.year = selectedYear;
            }
            if (selectedMonth) {
                params.month = selectedMonth;
            }

            const response = await axios.get(url, { params });
            setPredictions(response.data);
        } catch (err) {
            console.error("Error fetching prediction data:", err);
            setError("Unable to fetch prediction data.");
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPredictionData();
    }, [selectedCategory, selectedYear, selectedMonth]);

    // Handlers for updating the filter states
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div>
            <h1>Predictions</h1>
            {error && <p>{error}</p>}

            {/* Filters */}
            <div>
                <label htmlFor="category">Category:</label>
                <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">All</option>
                    {/* Add options for categories here */}
                </select>

                <label htmlFor="year">Year:</label>
                <select id="year" value={selectedYear} onChange={handleYearChange}>
                    <option value="">All</option>
                    {/* Add options for years here */}
                </select>

                <label htmlFor="month">Month:</label>
                <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">All</option>
                    {/* Add options for months here */}
                </select>
            </div>

            <ul>
                {predictions.map((prediction, index) => (
                    <li key={index}>{JSON.stringify(prediction)}</li>
                ))}
            </ul>
        </div>
    );
};

export default PredictionComponent;