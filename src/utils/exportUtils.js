/**
 * Utility to export an array of objects to a CSV file.
 * 
 * @param {Array} data - The array of objects to export
 * @param {Array} headers - Array of header objects { label: 'Name', key: 'name' }
 * @param {string} filename - The name of the downloaded file
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
  if (!data || !data.length) {
    alert("No data available to export");
    return;
  }

  // Create the header row
  const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');

  // Create the data rows
  const dataRows = data.map(row => {
    return headers.map(h => {
      let val = row[h.key];
      if (val === null || val === undefined) val = '';
      // Escape double quotes by doubling them
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
