import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    TablePagination,
} from "@mui/material";
import TableRowStyle from "./TableRowStyle";
import TableCellStyle from "./TableCellStyle";

const CustomTable = ({
    columns,
    filteredRows,
    setFilteredRows,
    rowProperties,
    items,
    onPageChange = undefined,
    onSizeChange = undefined,
}) => {
    const [page, setPage] = useState(0); // List page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows to show
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

   
    /**
     * Calculates the page number for a given first employee index based on the new number of rows per page.
     * @param {String} firstemployeeIndex - The index of the first employee being displayed.
     * @param {String} newRowsPerPage - The new number of employees per page.
     * @returns the page number where the first employee will be located after changing the number of rows per page.
     */
    const calculateOnResizePage = (firstemployeeIndex, newRowsPerPage) => {
        return Math.floor(firstemployeeIndex / newRowsPerPage);
    };

    /**
     * Handles the page change event and updates the current page state.
     */
    const handlePageChange = (_, newPage) => {
        setPage(newPage);
        if (onPageChange !== undefined) onPageChange(newPage);
    };

    /**
     * Handles the rows per page change event and updates the current page state and rows per page.
     */
    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        const newPage = calculateOnResizePage(
            page * rowsPerPage,
            newRowsPerPage
        );
        setRowsPerPage(newRowsPerPage);
        setPage(newPage);

        if (onSizeChange !== undefined) onSizeChange(newRowsPerPage);

        if (onPageChange !== undefined) onPageChange(newPage);
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }

        const sortedRows = [...filteredRows].sort((rowA, rowB) => {
            const valueA = rowA[column];
            const valueB = rowB[column];

            if (typeof valueA === "string" && typeof valueB === "string") {
                return sortDirection === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA); 
            } else if (typeof valueA === "number" && typeof valueB === "number") {
                return sortDirection === "asc"
                    ? valueA - valueB
                    : valueB - valueA;
            } else {
                return 0;
            }
        });

        setFilteredRows(sortedRows);
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCellStyle
                                    sx={
                                        column === "Actions"
                                            ? { textAlign: "center" }
                                            : {}
                                    }
                                    key={index}
                                >
                                    <TableSortLabel
                                        active={true} 
                                        direction={sortColumn === column ? sortDirection : 'asc'} 
                                        sx={{ "color": "#FFFFFF !important" }}
                                        onClick={() => handleSort(column)}
                                    >
                                        {column}
                                    </TableSortLabel>
                                </TableCellStyle>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows &&
                            filteredRows.map((row, key) => (
                                <TableRowStyle key={key}>
                                    {rowProperties.map((property, colIndex) => (
                                        <TableCellStyle
                                            align="left"
                                            key={colIndex}
                                        >
                                            {row[property]}
                                        </TableCellStyle>
                                    ))}
                                </TableRowStyle>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={-1}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage={"Rows per page"}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to}`}
                nextIconButtonProps={{
                    disabled: items.length < rowsPerPage,
                }}
            />
        </>
    );
};

export default CustomTable;
