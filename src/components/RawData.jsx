import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://qeqlcikxfougmgahwyit.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcWxjaWt4Zm91Z21nYWh3eWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTIzNDUsImV4cCI6MjA2NjI4ODM0NX0.yd6hSjW3TsdiUoT77Aq0p2HUhKjzw4FxgSk6EFJVaQ8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function RawData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      // Call the Postgres function
      const { data, error } = await supabase.rpc('get_latest_hour_hashtags');
      if (error) setError(error.message);
      setData(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Raw Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RawData; 