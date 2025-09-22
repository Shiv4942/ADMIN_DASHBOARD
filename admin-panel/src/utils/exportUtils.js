/**
 * Exports data to a CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename = 'export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = [
    headers.join(','), // header row
    ...data.map(row => 
      headers.map(fieldName => 
        // Escape quotes and wrap in quotes
        `"${String(row[fieldName] || '').replace(/"/g, '""')}"`
      ).join(',')
    )
  ].join('\r\n');

  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Set the download attributes
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  // Append to the document, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports data to a JSON file
 * @param {Object|Array} data - Data to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToJSON = (data, filename = 'export') => {
  if (!data) {
    console.error('No data to export');
    return;
  }

  // Convert data to JSON string with pretty printing
  const jsonString = JSON.stringify(data, null, 2);
  
  // Create a Blob with the JSON data
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Set the download attributes
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  // Append to the document, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Imports data from a file
 * @param {File} file - The file to import
 * @returns {Promise<Object|Array>} - Parsed data
 */
export const importFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let data;
        
        if (file.type === 'application/json') {
          data = JSON.parse(content);
        } else if (file.type === 'text/csv') {
          // Simple CSV parsing (for more complex cases, consider using a library like PapaParse)
          const lines = content.split(/\r\n|\n/);
          const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, ''));
          
          data = lines.slice(1).filter(line => line.trim() !== '').map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return headers.reduce((obj, header, index) => {
              let value = values[index] || '';
              // Remove surrounding quotes if they exist
              if (typeof value === 'string') {
                value = value.replace(/^"|"$/g, '');
                // Try to parse as JSON if it looks like JSON
                if ((value.startsWith('{') && value.endsWith('}')) || 
                    (value.startsWith('[') && value.endsWith(']'))) {
                  try {
                    value = JSON.parse(value);
                  } catch (e) {
                    // If parsing fails, keep as string
                  }
                }
                // Try to parse as number if it's a number
                else if (!isNaN(Number(value)) && value.trim() !== '') {
                  value = Number(value);
                }
                // Convert 'true'/'false' to boolean
                else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                  value = value.toLowerCase() === 'true';
                }
              }
              obj[header] = value;
              return obj;
            }, {});
          });
        } else {
          reject(new Error('Unsupported file type'));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    if (file.type === 'application/json' || file.type === 'text/csv') {
      reader.readAsText(file);
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};
