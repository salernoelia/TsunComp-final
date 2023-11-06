import React, { useState } from 'react';

function SVGGenerator() {
  const [pathData, setPathData] = useState('M10 10 L100 100'); // Replace with your actual path data

  const handleDownload = () => {
    // Create a new SVG element with the provided path data
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <path d="${pathData}" fill="none" stroke="blue" stroke-width="2" />
    </svg>`;

    // Create a Blob containing the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });

    // Create a download link for the user
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom.svg'; // Specify the desired file name

    // Trigger a click event on the download link
    a.click();

    // Release the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>SVG Generator</h1>
      <textarea
        rows="4"
        cols="50"
        value={pathData}
        onChange={(e) => setPathData(e.target.value)}
        placeholder="Enter path data..."
      />
      <br />
      <button onClick={handleDownload}>Download SVG</button>
    </div>
  );
}

export default SVGGenerator;