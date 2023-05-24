import React, { useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";

const UserTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    usePagination
  );

  return (
    <div>
      <table
        {...getTableProps()}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{ background: "lightgray" }}
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ padding: "8px" }}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{ borderBottom: "1px solid black" }}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ padding: "8px" }}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
        <span style={{ marginLeft: "10px" }}>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            value={pageIndex + 1}
            onChange={(e) => {
              const inputPageNumber = e.target.value
                ? Number(e.target.value)
                : pageIndex + 1;
              const pageNumber = Math.min(
                Math.max(inputPageNumber, 1),
                pageCount
              );
              gotoPage(pageNumber - 1);
            }}
            min={1}
            max={pageCount}
            style={{ width: "50px" }}
          />
        </span>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ marginLeft: "10px" }}
        >
          {[1, 2, 5, 10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const limit = 100;

function App() {
  const [users, setUsers] = useState([]);
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "first_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone_number" },
    { Header: `${limit}`, accessor: "uid" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://random-data-api.com/api/v2/users?size=${limit}&is_xml=true`
        );
        const data = await response.json();
        setUsers(data);
        console.log(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Fetch 30 users
  }, []);

  return (
    <div>
      <h1>User Data Table</h1>
      <UserTable columns={columns} data={users} />
    </div>
  );
}

export default App;
