var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var size = document.getElementById('size');
var text = document.getElementById('text');
var fontSize = document.getElementById('sizeFont');
var fontType = document.getElementById('font');
var customColor = document.getElementById('customcolor');
var uploadImage = document.getElementById('upload');
var currColor = document.getElementById('currentcolor');
var fillShape = document.getElementById('fillshape');
var fileName = document.getElementById('filename');

canvas.height = window.innerHeight - 160;
canvas.width = window.innerWidth - 175;

let mouse = false;
let mouseX;
let mouseY;
let shiftButton = false;
let mode = "brush";
let color = "rgb(0, 0, 0)";
let drawingPath = [];
let drawingStep = -1;
var bufferImg = new Image();

function resize() {
    size.title = size.value;
    ctx.lineWidth = size.value;
}

//Store the path step
function storePath() {
    drawingStep++;
    drawingPath.push(canvas.toDataURL());
}

function undo() {
    if (drawingStep > 0) {
        drawingStep--;
        bufferImg.src = drawingPath[drawingStep];
        bufferImg.onload = () => {
            canvas.height = canvas.height;
            ctx.drawImage(bufferImg, 0, 0);
        }
    } else {
        if (drawingStep == 0) {
            canvas.height = canvas.height;
        }
        drawingStep = -1;
    }
}

function redo() {
    if (drawingStep < drawingPath.length - 1) {
        drawingStep++;
        bufferImg.src = drawingPath[drawingStep];
        bufferImg.onload = () => {
            canvas.height = canvas.height;
            ctx.drawImage(bufferImg, 0, 0);
        }
    }
}

function clear() {
    if(confirm("Are you sure want to clear the canvas?")) {
        if (drawingStep >= 0) {
            drawingStep = -1;
            drawingPath.length = 0;
        }
        canvas.height = canvas.height;
    }
}

//Event for canvas
function mouseDownCanvas(e) {
    mouse = true;
    resize();
    chooseColor();

    if (drawingStep != drawingPath.length - 1) {
        drawingPath.length = drawingStep + 1;
    }
    if (mode == 'text') {
        text.style.display = 'block';
        text.style.left = e.offsetX + 128 + "px";
        text.style.top = e.offsetY + 97 + "px";
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (mode == 'line' || mode == 'triangle' || mode == 'circle' || mode == 'rectangle') {
        bufferImg.src = canvas.toDataURL();
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else {
        ctx.lineCap = "round";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
}

function mouseUpCanvas() {
    mouse = false;
    storePath();
    ctx.beginPath();
}

function mouseOutCanvas() {
    mouse = false;
    ctx.beginPath();
}

function mouseInCanvas(e) {
    if (mode == 'brush') {
        canvas.style.cursor = 'url("https://img.icons8.com/emoji/48/000000/paintbrush-emoji.png") 4 41, auto';
    } else if (mode == 'eraser') {
        canvas.style.cursor = 'url("https://img.icons8.com/fluency/48/000000/erase.png") 12 40, auto';
    } else if (mode == 'text') {
        canvas.style.cursor = 'text';
    } else if (mode == 'line' || mode == 'triangle' || mode == 'circle' || mode == 'rectangle') {
        canvas.style.cursor = 'crosshair';
    } else {
        canvas.style.cursor = 'default'
    }
}

function draw(e) {
    mouseInCanvas();
    if (!mouse) {
        return;
    }
    if (mode == 'eraser') {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
    }
    if (mode == "brush" || mode == "eraser") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.moveTo(e.offsetX, e.offsetY);
        ctx.stroke();
        // dot-dot line
        // ctx.moveTo(e.offsetX, e.offsetY);
        // ctx.lineTo(e.offsetX, e.offsetY);
        // ctx.stroke();
    } else if (mode == 'line') {
        //thousand line
        // ctx.beginPath();
        // ctx.moveTo(mouseX, mouseY);
        // ctx.lineTo(e.offsetX, e.offsetY);
        // ctx.stroke();
        // ctx.closePath();
        canvas.height = canvas.height;
        ctx.drawImage(bufferImg, 0, 0);
        resize();
        chooseColor();
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.closePath();
    } else if (mode == 'circle') {
        canvas.height = canvas.height;
        ctx.drawImage(bufferImg, 0, 0);
        resize();
        chooseColor();
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, Math.sqrt(Math.pow(e.offsetX - mouseX, 2) + Math.pow(e.offsetY - mouseY, 2)), 0, Math.PI * 2, true);
        if(fillShape.checked) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    } else if (mode == 'rectangle') {
        canvas.height = canvas.height;
        ctx.drawImage(bufferImg, 0, 0);
        resize();
        chooseColor();
        ctx.beginPath();
        if(shiftButton) {
            if(fillShape.checked) {
                if (e.offsetX - mouseX >= 0 && e.offsetY - mouseY < 0) {
                    min = (e.offsetX - mouseX < mouseY - e.offsetY) ? e.offsetX - mouseX : mouseY - e.offsetY;
                    ctx.fillRect(mouseX, mouseY, min, -min);
                } else if (e.offsetX - mouseX < 0 && e.offsetY - mouseY >= 0) {
                    min = (mouseX - e.offsetX < e.offsetY - mouseY) ? mouseX - e.offsetX : e.offsetY - mouseY;
                    ctx.fillRect(mouseX, mouseY, -min, min);
                } else if (e.offsetX - mouseX >= 0 &&  e.offsetY - mouseY >= 0) {
                    min = (e.offsetX - mouseX < e.offsetY - mouseY) ? e.offsetX - mouseX : e.offsetY - mouseY;
                    ctx.fillRect(mouseX, mouseY, min, min);
                } else {
                    min = (mouseX - e.offsetX < e.offsetY - mouseY) ? mouseX - e.offsetX : e.offsetY - mouseY;
                    ctx.fillRect(mouseX, mouseY, min, min);
                }
            } else {
                let min;
                if (e.offsetX - mouseX >= 0 && e.offsetY - mouseY < 0) {
                    min = (e.offsetX - mouseX < mouseY - e.offsetY) ? e.offsetX - mouseX : mouseY - e.offsetY;
                    ctx.strokeRect(mouseX, mouseY, min, -min);
                } else if (e.offsetX - mouseX < 0 && e.offsetY - mouseY >= 0) {
                    min = (mouseX - e.offsetX < e.offsetY - mouseY) ? mouseX - e.offsetX : e.offsetY - mouseY;
                    ctx.strokeRect(mouseX, mouseY, -min, min);
                } else if (e.offsetX - mouseX >= 0 &&  e.offsetY - mouseY >= 0) {
                    min = (e.offsetX - mouseX < e.offsetY - mouseY) ? e.offsetX - mouseX : e.offsetY - mouseY;
                    ctx.strokeRect(mouseX, mouseY, min, min);
                } else {
                    min = (mouseX - e.offsetX < e.offsetY - mouseY) ? mouseX - e.offsetX : e.offsetY - mouseY;
                    ctx.strokeRect(mouseX, mouseY, min, min);
                }
            }
        } else {
            if(fillShape.checked) {
                ctx.fillRect(mouseX, mouseY, e.offsetX - mouseX, e.offsetY - mouseY);
            } else {
                ctx.strokeRect(mouseX, mouseY, e.offsetX - mouseX, e.offsetY - mouseY);
            }
        }
    } else if (mode == 'triangle') {
        canvas.height = canvas.height;
        ctx.drawImage(bufferImg, 0, 0);
        resize();
        chooseColor();
        ctx.beginPath();
        ctx.moveTo(mouseX + (e.offsetX - mouseX) / 2, mouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(mouseX, e.offsetY);
        ctx.closePath();
        if(fillShape.checked) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
}

function onkeyDown(e) {
    if (mode == "text") {
        if (e.key == "Enter") {
            ctx.font = fontSize.value + "px " + fontType.value;
            if(fillShape.checked) {
                ctx.fillText(text.value, mouseX, mouseY);
            } else {
                ctx.lineWidth = 2;
                ctx.strokeText(text.value, mouseX, mouseY);
                ctx.lineWidth = size.value;
            }
            text.style.display = "none";
            text.value = "";
        }
    }
}

function clearFileName() {
    fileName.value = "";
}

function download() {
    let link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = fileName.value + ".png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    clearFileName();
}

function upload() {
    uploadImage.click();
}

function image(e) {
    let reader = new FileReader();
    reader.onload = (event) => {
        bufferImg.onload = function () {
            canvas.width = bufferImg.width;
            canvas.height = bufferImg.height;
            ctx.drawImage(bufferImg, 0, 0);
        }
        bufferImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function chooseColor() {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}

function palette(palette) {
    let id = document.getElementById(palette);
    if(customColor.checked) {
        id.disabled = false;
        color = id.value;
        currColor.style.background = id.value;
        chooseColor();
    } else {
        for(var i = 1; i <= 12; i++) {
            document.getElementById('color' + i).disabled = false;
        }
        id.disabled = true;
        color = id.value;
        currColor.style.background = id.value;
        chooseColor();
    }
}

// function pickColor(event) {
//     let col = document.getElementById('color1');
//     col.style.backgroundColor = 'rgb(255, 0 , 0)';
//     alert(col.style.backgroundColor);
//     chooseColor();
// }

// function colorr() {
//     if(pickColor.checked) {
        
//     } else {
//         let abc = document.querySelector('colorr');
//         abc.style.pointerEvents = "none";
//     }
// }

//function for toolbar
function chooseTool(tool) {
    text.style.display = 'none';
    switch (tool) {
        case 'brush':
            mode = 'brush';
            break;
        case 'eraser':
            mode = 'eraser';
            break;
        case 'undo':
            undo();
            break;
        case 'redo':
            redo();
            break;
        case 'clear':
            clear();
            break;
        case 'color':
            chooseColor();
            break;
        case 'text':
            mode = 'text';
            break;
        case 'download':
            download();
            break;
        case 'upload':
            upload();
            break;
        case 'shape':
            shape();
            break;
        case 'line':
            mode = 'line';
            break;
        case 'circle':
            mode = 'circle'
            break;
        case 'triangle':
            mode = 'triangle';
            break;
        case 'rectangle':
            mode = 'rectangle';
            break;
    }
}

window.addEventListener("keydown", (event)=> {
    shiftButton = true;
})

window.addEventListener("keyup", (event)=> {
    shiftButton = false;
})

//canvas event
canvas.addEventListener("mousedown", mouseDownCanvas);
canvas.addEventListener("mouseup", mouseUpCanvas);
canvas.addEventListener("mouseout", mouseOutCanvas)
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("onmouseenter", mouseInCanvas);
canvas.addEventListener("onkeydown", onkeyDown);

uploadImage.addEventListener('change', image);
size.addEventListener('change', resize);
// fontSize.addEventListener('change', changeFontSize);
// fontType.addEventListener('change', changeFontType);

// // Create gradient vertical
// var grd = ctx.createLinearGradient(0,0,200,0);
// grd.addColorStop(0,"red");
// grd.addColorStop(1,"white");

// // Fill with gradient vertical
// ctx.fillStyle = grd;
// ctx.fillRect(10,10,150,80);

// // Create gradient circle
// var grd = ctx.createRadialGradient(75,50,5,90,60,100);
// grd.addColorStop(0,"red");
// grd.addColorStop(1,"white");

// // Fill with gradient circle
// ctx.fillStyle = grd;
// ctx.fillRect(10,10,150,80);


// // Text Stroke
// ctx.font = "30px Arial";
// ctx.strokeText("Hello World", 10, 75);

// // Text with center position and add color
// ctx.font = "30px Comic Sans MS";
// ctx.fillStyle = "red";
// ctx.textAlign = "center";
// ctx.fillText("Hello World", canvas.width/2, canvas.height/2);

/*
https://getbootstrap.com/docs/4.4/components/navbar/
https://www.w3schools.com/graphics/canvas_images.asp
https://getbootstrap.com/docs/5.0/components/offcanvas/
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
https://icons8.com/
https://icofont.com/icons
*/