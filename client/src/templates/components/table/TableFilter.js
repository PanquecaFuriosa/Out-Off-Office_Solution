import React, { useState } from "react";
import { MenuItem, TextField, Button } from "@mui/material";

const TableFilter = ({ columns, rows, setFilteredRows }) => {
    const [filterColumn, setFilterColumn] = useState(""); // Column to filter
    const [filterText, setFilterText] = useState(""); // Text column to filter

    const handleChangeFilterColumn = (event) => {
        setFilterColumn(event.target.value);
    };

    const handleChangeFilterText = (event) => {
        setFilterText(event.target.value);
    };

    const handleFilter = () => {
        if (filterColumn === "") {
          setFilteredRows(rows);
        } else {
          const filteredRows = rows.filter((row) => {
            const cellValue = row[filterColumn];
            if (typeof cellValue === "number") {
              
              return cellValue.toString().toLowerCase().includes(filterText.toLowerCase());
            } else if (typeof cellValue === "string") {
              return cellValue.toLowerCase().includes(filterText.toLowerCase());
            }
            return false; 
          });
          setFilteredRows(filteredRows);
        }
      };

    return (
        <div style={{ marginTop: "20px" }}>
            <TextField
                select
                label="Filter By"
                value={filterColumn}
                onChange={handleChangeFilterColumn}
                variant="outlined"
                style={{ width: "150px", marginRight: "10px" }}
            >
                {columns.map((column) => (
                    <MenuItem key={column} value={column}>
                        {column}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Search by"
                value={filterText}
                onChange={handleChangeFilterText}
                variant="outlined"
                style={{ marginRight: "10px" }}
            />
            <Button
                variant="container"
                className="options-button"
                onClick={handleFilter}
                startIcon={<i className="bi bi-search"></i>}
            >
                Search
            </Button>
        </div>
    );
};

export default TableFilter;
