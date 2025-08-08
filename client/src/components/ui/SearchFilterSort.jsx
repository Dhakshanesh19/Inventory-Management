import React, { useState } from 'react';

const SearchFilterSort = ({ onSearch, onFilter, onSort }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortValue, setSortValue] = useState('name');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterValue(filter);
    if (onFilter) onFilter(filter);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortValue(sort);
    if (onSort) onSort(sort);
  };

  return (
    <div className="search-filter-container">
      <input
        type="text"
        placeholder="Search products by name or SKU..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      
      <select 
        value={filterValue} 
        onChange={handleFilterChange}
        className="filter-select"
      >
        <option value="all">All Products</option>
        <option value="low-stock">Low Stock</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
      
      <select 
        value={sortValue} 
        onChange={handleSortChange}
        className="filter-select"
      >
        <option value="name">Sort by Name</option>
        <option value="sku">Sort by SKU</option>
        <option value="quantity">Sort by Stock</option>
        <option value="price">Sort by Price</option>
      </select>
    </div>
  );
};

export default SearchFilterSort;
