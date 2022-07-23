# Software Studio 2022 Spring
## Assignment 01 Web Canvas


### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | Y         |
| Text input                                       | 10%       | Y         |
| Cursor icon                                      | 10%       | Y         |
| Refresh button                                   | 5%        | Y         |


| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | Y         |
| Un/Re-do button                                  | 10%       | Y         |
| Image tool                                       | 5%        | Y         |
| Download                                         | 5%        | Y         |

| **Other useful widgets**                         | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Custom Color Checkbox                            | 1~5%      | Y         |
| Fill Checkbox                                    | 1~5%      | Y         |
| Press Shift Button                               | 1~5%      | Y         |
| Tooltip                                          | 1~5%      | Y         |
| Modal                                            | 1~5%      | Y         |
---

### How to use 
You can move the cursor to the tool icon for a second to show that tool is that.
| **Button** | **Name** | **Feature** |
| :----: | :-------: | :-------
|![](https://img.icons8.com/plumpy/48/ffffff/paint.png) | Brush | Left click in canvas to draw something |
|![](https://img.icons8.com/plumpy/48/ffffff/eraser-tool.png) | Eraser | Left click in canvas to erase something in canvas |
|![](https://img.icons8.com/plumpy/48/ffffff/type.png) | Text | Left click to insert text in canvas and press enter to make it show up in canvas |
|![](https://img.icons8.com/external-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto/48/000000/external-shape-design-thinking-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto.png)| Shape | Left click the icon to show up the shape list |
|![](https://img.icons8.com/plumpy/24/000000/line.png) | Line | Left click to draw line in canvas |
|![](https://img.icons8.com/plumpy/24/000000/circled.png) | Circle | Left click to draw circle in canvas |
|![](https://img.icons8.com/plumpy/24/000000/triangle-stroked.png) | Triangle | Left click to draw triangle in canvas |
|![](https://img.icons8.com/plumpy/24/000000/rectangle-stroked.png) | Rectangle | Left click to draw rectangle in canvas, to draw a square, hold the SHIFT key while drawing |
|![](https://img.icons8.com/plumpy/48/ffffff/undo.png) | Undo | Left click to undo the work (go to the previous drawing) |
|![](https://img.icons8.com/plumpy/48/ffffff/redo.png) | Redo | Left click to redo the work (go to the next drawing) |
|![](https://img.icons8.com/plumpy/48/ffffff/synchronize.png) | Clear | Left click to clear the drawing in canvas |
|![](https://img.icons8.com/plumpy/48/000000/download--v1.png) | Download | Left click to download the drawing in canvas and type the file name you want to save as. After that click download button in the pop up table|
|![](https://img.icons8.com/plumpy/48/000000/upload--v1.png) | Upload | Left click to upload picture to the canvas |
Size's slider to set the brush and eraser size.
2 selection box, one for font type and the other for the size. Left click to choose what you want.

There is a checkbox on the top of canvas, Custom Color and Fill.
* **Custom Color** <br>
If the checkbox is checked, you can choose or change the color of palette (12 circles with colors). <br>
If the checkbox is unchecked, you can't change the color of palette. But you can choose the color of it.<br>
When it is chosen, the square color will change base on the color you choose in palette without accidentaly change the color you have save in the palette. <br>
* **Fill** <br>
If the checkbox is checked, it will fill the shape and text. <br>
If the checkbox is unchecked, the shape and text will only have the stroke without color inside. <br>


### Function description

* **Custom Color Checkbox**

Change the palette colors to the other colors. 

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

Enabled all palettes and then disabled the chosen one when the custom color checkbox is unchecked.

* **Fill Checkbox**

To fill shapes and text, we can use the function from the javascript.

    if(fillShape.checked) { //FOR TEXT
        ctx.fillText(text.value, mouseX, mouseY);
    } else {
        ctx.lineWidth = 2;
        ctx.strokeText(text.value, mouseX, mouseY);
        ctx.lineWidth = size.value;
    }

    if(fillShape.checked) { //FOR CIRCLE AND TRIANGLE
        ctx.fill();
    } else {
        ctx.stroke();
    }

    if(fillShape.checked) { //FOR RECTANGLE
        ctx.fillRect(mouseX, mouseY, e.offsetX - mouseX, e.offsetY - mouseY);
    } else {
        ctx.strokeRect(mouseX, mouseY, e.offsetX - mouseX, e.offsetY - mouseY);
    }

* **Press Shift Button**

Press and hold Shift button to draw a square shape when using the rectangle function.
Track when the shift button is down and up. Keydown means it's pressed and keyup when it's not pressed anymore.
To draw a square, need to tract the minimum length of the rectangle and use it as the square height and width.

    window.addEventListener("keydown", (event)=> {
        shiftButton = true;
    })

    window.addEventListener("keyup", (event)=> {
        shiftButton = false;
    })

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

* **Tooltip**

To show the tooltip, add title in the button or any tag.

    <button> title="Brush" </button>

* **Modal**

Modal will pop up when the download icon is clicked. I use the template provided by the bootstrap5.

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Download</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        onclick="cancelDownload()"></button>
                </div>
                <div class="modal-body">
                    <label>Save as : </label>
                    <input type="text" id="filename">
                    <label>.png</label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        onclick="cancelDownload()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="chooseTool('download')">Download</button>
                </div>
            </div>
        </div>
    </div>


### Gitlab page link

    https://web-canvas-4cd5c.web.app/