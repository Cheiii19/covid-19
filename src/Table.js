import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table({ countries, dark }) {
  return (
    <div className={`table ${dark && "table_dark"}`}>
      {countries.map(({ country, cases, id }) => (
        <tr>
          <td key={id}>{country}</td>
          <td key={id}>
            <strong>{numeral(cases).format(",")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
