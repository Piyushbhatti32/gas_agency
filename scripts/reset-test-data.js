const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Function to reset test data
async function resetTestData() {
  try {
    console.log('Resetting test data...');
    const response = await fetchWithTimeout('http://localhost:3000/api/reset-and-setup', {
      method: 'POST'
    });
    
    const data = await response.json();
    console.log('Reset complete:', data);
    return data;
  } catch (error) {
    console.error('Error resetting test data:', error);
    throw error;
  }
}

// Run the reset
resetTestData()
  .then(result => {
    console.log('Success:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });
