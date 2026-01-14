
import React, { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
}

const Barcode: React.FC<BarcodeProps> = ({ value, width = 200, height = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        // Code 39 standard often requires '*' as start/stop characters
        // bwip-js handles inclusions usually, but we ensure it matches the prompt's request
        const formattedValue = value.startsWith('*') && value.endsWith('*') 
          ? value 
          : `*${value}*`;

        bwipjs.toCanvas(canvasRef.current, {
          bcid: 'code39',       // Barcode type
          text: formattedValue, // Text to encode
          scale: 3,             // 3x scaling factor
          height: height,       // Bar height, in millimeters
          includetext: true,    // Show human-readable text
          textxalign: 'center', // Always good for ID cards
          backgroundcolor: 'ffffff'
        });
      } catch (e) {
        console.error('Barcode generation error:', e);
      }
    }
  }, [value, height]);

  return (
    <div className="flex justify-center w-full">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
};

export default Barcode;
