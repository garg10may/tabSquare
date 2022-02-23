import React from "react";
import "./index.css";

function CustomerList() {

  const [customers, setCustomers] = React.useState([]);
  const [name, setName] = React.useState('');

  const addCustomer = () => {
    if (name.length > 0) {
      setCustomers([...customers, name]);
      setName('');
    }
  }

  return (
    <div className="mt-75 layout-column justify-content-center align-items-center">
      <section className="layout-row align-items-center justify-content-center">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text" className="large" placeholder="Name" data-testid="app-input" />
        <button
          onClick={addCustomer}
          type="submit"
          className="ml-30"
          data-testid="submit-button">
          Add Customer
        </button>
      </section>


      {customers.length > 0 && (
        <ul className="styled mt-50" data-testid="customer-list">
          {customers.map((customer, index) => (
            <li
              className="slide-up-fade-in"
              data-testid={"list-item" + index}
              key={"list-item" + index}
            >
              {customer}
            </li>
          ))}
        </ul>
      )
      }
    </div >
  );
}

export default CustomerList