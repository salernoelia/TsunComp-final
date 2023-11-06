import React, { useState } from 'react';
import potrace from 'potrace';

function ImageConverter() {
  const [svgData, setSvgData] = useState(null);



  const handleImageUpload = (event) => {

    console.log(event.target.files[0]);

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      console.log(e);
      const buffer = Buffer.from(e.target.result);
      const potraceOptions = {
        threshold: 128, // Adjust as needed
      };

      potrace.trace(buffer, potraceOptions, (err, svg) => {
        if (err) {
          console.error('Error converting image to SVG:', err);
        } else {
          setSvgData(svg);
        }
      });
    };

    reader.readAsArrayBuffer(file);
  };



  const handleDownloadSVG = () => {
    if (svgData) {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
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
      <input type="file" accept=".png" onChange={handleImageUpload} />
      {svgData && (
        <div>
          <h2>Converted SVG:</h2>
          <div dangerouslySetInnerHTML={{ __html: svgData }} />
          <button onClick={handleDownloadSVG}>Download SVG</button>
        </div>
        
      )}
    </div>
  );
}

export default ImageConverter;