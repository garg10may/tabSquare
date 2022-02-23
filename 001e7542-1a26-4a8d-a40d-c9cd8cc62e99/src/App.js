import React  from 'react';
import './App.css';
import CustomerList from './components/customer-list/index.js';
import 'h8k-components';

const title = "Customer List";

function App() {
  return (
    <div>
      <h8k-navbar header={title} />
      <CustomerList/>
    </div>
  );
}

export default App;
