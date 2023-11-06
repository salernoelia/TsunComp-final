import React, { useState } from 'react';

function SVGEditor() {
  const [svgContent, setSVGContent] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const modifiedSVGContent = addLineToSVG(content);
      setSVGContent(modifiedSVGContent);
    };

    reader.readAsText(file);
  };

  const addLineToSVG = (svgContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');

    // Create a new line element
    const svgNS = 'http://www.w3.org/2000/svg';
    const line = doc.createElementNS(svgNS, 'line');
    line.setAttribute('x1', '50');
    line.setAttribute('y1', '50');
    line.setAttribute('x2', '150');
    line.setAttribute('y2', '150');
    line.setAttribute('stroke', 'red');

    // Append the line to the SVG
    doc.querySelector('svg').appendChild(line);

    // Serialize the modified SVG content
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  };

  const handleDownloadSVG = () => {
    if (svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_image.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <input type="file" accept=".svg" onChange={handleFileChange} />
      {svgContent && (
        <div>
          <h2>Modified SVG:</h2>
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
          <button onClick={handleDownloadSVG}>Download SVG</button>
        </div>
      )}
    </div>
  );
}

export default SVGEditor;