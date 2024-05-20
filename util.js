const randomRgbColor = () => {
    let r = Math.floor(Math.random() * 256); // Random between 0-255
    let g = Math.floor(Math.random() * 256); 
    let b = Math.floor(Math.random() * 256); 
    return "rgb(" + r + "," + g + "," + b + ")";
};
