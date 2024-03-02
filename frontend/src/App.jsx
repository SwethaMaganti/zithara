import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ROWS_PER_PAGE = 20;

function App() {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    if (term === '') {
      fetchData();
    } else {
      const filtered = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.location.toLowerCase().includes(term)
      );
  
      setFilteredCustomers(filtered);
      setPage(0);
    }
  };
  

  const formatDateAndTime = (datetime) => {
    const dateObj = new Date(datetime);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return { date, time };
  };

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === 'time') {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    }
    return 0;
  });

  const startRow = page * ROWS_PER_PAGE;
  const endRow = startRow + ROWS_PER_PAGE;
  const displayedCustomers = sortedCustomers.slice(startRow, endRow);

  return (
    <div>
      <h1>Customer Data</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or location"
          className="search-input"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>
              Date
              <button onClick={() => handleSort('date')} className="sort-btn">{sortBy === 'date' && sortOrder === 'asc' ? '▲' : '▼'}</button>
            </th>
            <th>
              Time
              <button onClick={() => handleSort('time')} className="sort-btn">{sortBy === 'time' && sortOrder === 'asc' ? '▲' : '▼'}</button>
            </th>
          </tr>
        </thead>
        <tbody>
        {displayedCustomers.map((customer, index) => {
          const { date, time } = formatDateAndTime(customer.created_at);
          const sNo = startRow + index + 1;
          return (
            <tr key={index}>
              <td>{sNo}</td>
              <td>{customer.name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{date}</td>
              <td>{time}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
      <div className='btns'>
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
        <button onClick={() => setPage(page + 1)} disabled={endRow >= filteredCustomers.length}>Next</button>
      </div>
    </div>
  );
}

export default App;
