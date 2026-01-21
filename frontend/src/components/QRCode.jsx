import { useEffect, useRef } from 'react';

/**
 * QRCode Component
 * Generates and displays QR codes using canvas API
 */
const QRCode = ({
  value,
  size = 200,
  level = 'M', // L, M, Q, H
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000',
  className = '',
  ...props
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    // Simple QR code generation (basic implementation)
    // In production, you'd use a library like qrcode.js
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = foregroundColor;
    
    // Simplified QR pattern (you'd use a proper QR library)
    const moduleSize = size / 25;
    const pattern = generateQRPattern(value);

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (pattern[row] && pattern[row][col]) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }, [value, size, backgroundColor, foregroundColor]);

  // Simple pattern generator (placeholder - use proper QR library)
  const generateQRPattern = (text) => {
    const pattern = Array(25).fill(null).map(() => Array(25).fill(false));
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generate a pseudo-random pattern based on text
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const seed = (i * 25 + j + hash) % 3;
        pattern[i][j] = seed === 0;
      }
    }

    // Add corner finder patterns
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: 20 },
      { row: 20, col: 0 },
    ];

    corners.forEach(({ row, col }) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            (i === 0 || i === 6 || j === 0 || j === 6) ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            pattern[row + i][col + j] = true;
          }
        }
      }
    });

    return pattern;
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      {...props}
    />
  );
};

export default QRCode;
// Style improvement
