// Function to convert hex to RGB
function hexToRGB(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// Function to convert RGB to hex
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Function to interpolate between two colors
function interpolateColors(color1, color2, factor) {
    const rgb1 = hexToRGB(color1);
    const rgb2 = hexToRGB(color2);
    
    const result = rgb1.map((start, i) => {
        return Math.round(start + (rgb2[i] - start) * factor);
    });
    
    return rgbToHex(...result);
}

// Predefined pleasing colors
const colors = [
    '#3498db', // Blue
    '#2ecc71', // Green
    '#e74c3c', // Red
    '#9b59b6', // Purple
    '#1abc9c', // Turquoise
    '#e67e22', // Orange
    '#34495e', // Navy
    '#16a085', // Dark Turquoise
];

let currentColorIndex = 0;
let animationFrame;
const transitionDuration = 4000; // 4 seconds for each color transition
let startTime;

// Function to animate color transition
function animateColor(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / transitionDuration;

    if (progress < 1) {
        const currentColor = colors[currentColorIndex];
        const nextColor = colors[(currentColorIndex + 1) % colors.length];
        const interpolatedColor = interpolateColors(currentColor, nextColor, progress);

        const elements = document.querySelectorAll('.post-content-wrapper');
        elements.forEach(element => {
            element.style.borderLeftColor = interpolatedColor;
        });

        animationFrame = requestAnimationFrame(animateColor);
    } else {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        startTime = null;
        animationFrame = requestAnimationFrame(animateColor);
    }
}

// Initialize color change
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.post-content-wrapper');
    elements.forEach(element => {
        element.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        element.style.borderLeftColor = colors[0];
    });
    
    // Start the animation
    requestAnimationFrame(animateColor);
}); 