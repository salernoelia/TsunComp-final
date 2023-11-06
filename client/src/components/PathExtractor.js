import React, { useState } from 'react';

function PathExtractor() {
  const [pathData, setPathData] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const extractedPathData = extractPathFromSVG(content);
      setPathData(extractedPathData);
    };

    reader.readAsText(file);
  };

  const extractPathFromSVG = (svgContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');

    // Find the path element (modify the selector to match your specific SVG structure)
    const pathElement = doc.querySelector('path');

    // Extract the path data from the path element
    const pathData = pathElement.getAttribute('d');

    return pathData;
  };

  const handleDownload = () => {
    // Create a new SVG element with the provided path data
    const svgString = `
    
    <?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
    "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="512" height="512" viewBox="0 0 512 512"
    preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0,512) scale(0.100000,-0.100000)"fill="#000000" stroke="none">
    <path d="${pathData}" fill="none" stroke="blue" stroke-width="2" />
    </g>
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
      <input type="file" accept=".svg" onChange={handleFileChange} />
      {pathData && (
        <div>
          <h2>Extracted Path Data:</h2>
          <pre>{pathData}</pre>
          <button onClick={handleDownload}>Download SVG</button>
        </div>
      )}
    </div>
  );
}

export default PathExtractor;