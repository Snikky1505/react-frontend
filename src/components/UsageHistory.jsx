import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { createTheme } from 'react-data-table-component';

createTheme('custom', {
  text: {
    primary: '#1f2937', // text-gray-800
    secondary: '#6b7280', // text-gray-500
  },
  background: {
    default: '#FFEFF0', // bg-gray-50
  },
  context: {
    background: '#e5e7eb', // bg-gray-200
    text: '#111827', // text-gray-900
  },
  divider: {
    default: '#e5e7eb',
  },
});

const customStyles = {
  headCells: {
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      backgroundColor: '#FFEFF0', // bg-gray-100
      color: '#374151', // text-gray-700
    },
  },
};

function UsageHistory() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
      { name: 'Transaction ID', selector: row => row.tx_id, sortable: true },
      { name: 'Company ID', selector: row => row.company_id, sortable: true },
      { name: 'Email', selector: row => row.email, sortable: true },
      { name: 'Amount Fee', selector: row => row.amount, sortable: true },
      { name: 'Payment Status', selector: row => row.payment_status, sortable: true },
      { name: 'Created At', selector: row => row.created_at, sortable: true },
    ];

    useEffect(() => {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/usageHistory`, {
        companyId: localStorage.getItem('companyId'),
        email: localStorage.getItem('email'),
      },{
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }})
        .then(response => {
          console.log('Data fetched:', response.data); // Debugging line
          setData(response.data.data); // sesuaikan jika response bentuknya { data: [...] }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, []);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Usage History</h1>
          <p className="text-gray-500">History Transaction of Name Screening</p>
        </div>
  
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* <div className="h-[400px] flex items-center justify-center text-gray-500 ">
            Datatable Usage History would go here
          </div> */}

          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            highlightOnHover
            striped
            responsive
            theme="custom"
            customStyles={customStyles}
          />
        </div>
      </div>
    )
  }
  
  export default UsageHistory
  
  