/*220501001 Hatice Reyhan Caliskan 220501009 Betul Canol*/
let nodes = [];
let createdNodes = [];
let rack = []; /*This is an array for orinizing nodes on the canas the order they created*/
let moving = null, offset = { x: 0, y: 0 };
let nearest = null;
let optionNode = null;
let lining = null;
let bg;
let localStorageTypesKey = 'circuitsim_types', localStorageOperationsKey = 'circuitsim_operations', localStorageNodeKey = 'circuitsim_node';

function setup() {
    if (window.location.search?.substring(1) == 'full') {
        let cnvcont = document.getElementsByClassName("cnvcont")[0]
        cnvcont.style.width = "300%";
        cnvcont.style.height = "300%";
    }
    createCanvas(1, 1).parent(select('.cnvcont'));
    let cnvcont = select('.cnvcont')
    document.getElementsByTagName("canvas")[0].addEventListener('contextmenu', (e) => e.preventDefault())
    resizeCanvas(cnvcont.width, cnvcont.height);
    bg = createBG();
    image(bg, 0, 0);
    resizeWindow();
}

function draw() {
    setNearest();
}

/*When the cursor is on the rectangle 
if pressed del deletes the node
if pressed ctrl + a rename node
if pressed ctrl + b break connection
if pressed ctrl + c color*/
function keyPressed() {
    if (key == 'Delete') {
        if (!isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) return; 
        optionNode = nearest;
        deleteNode(optionNode)
    } else if (keyIsDown(CONTROL) && (key == 'a' || key == 'A')) {
        if (!isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) return;
        optionNode = nearest;
        renameNode(optionNode);
    } else if (keyIsDown(CONTROL) && (key == 'b' || key == 'B')) {
        if (!isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) return;
        optionNode = nearest;
        breakOutputConnection(optionNode);
    }
}
let mousePressedTimeout = true;
function mousePressed() {
    if (!mousePressedTimeout) return;
    if (!nearest) return;
    if (isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) {
        nearest.onclick?.();
        moving = nearest;
        offset = { x: nearest.x - mouseX, y: nearest.y - mouseY };
    }
    for (let i = 0; i < nearest.inputPos.length; i++) {
        let p = nearest.inputPos[i];
        if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, mouseX, mouseY)) {
            lining = { node: nearest, index: i, type: 'input', x: nearest.x + p.x, y: nearest.y + p.y };
            moving = null;
        }
    }
    for (let i = 0; i < nearest.outputPos.length; i++) {
        let p = nearest.outputPos[i];
        if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, mouseX, mouseY)) {
            if (nearest.outputNodes[i] == null) {
                lining = { node: nearest, index: i, type: 'output', x: nearest.x + p.x, y: nearest.y + p.y };
                moving = null;
            }
        }
    }
}
let wireEnd; 
function mouseDragged() { /*Draw the line(wire) visually on the canvas while the mouse is being dragged*/
    image(bg, 0, 0);
    wireEnd = { x: mouseX, y: mouseY }
    if (moving) {
        if (rack.includes(moving)) rack.splice(rack.indexOf(moving), 1)
        moving.move(mouseX + offset.x, mouseY + offset.y);
    } else if (lining) {
        for (let i = 0; i < nearest.inputPos.length; i++) {
            let p = nearest.inputPos[i];
            if (dist(mouseX, mouseY, nearest.x + p.x, nearest.y + p.y) < 15) {
                wireEnd.x = nearest.x + p.x;
                wireEnd.y = nearest.y + p.y;
            }
        }
        line(lining.x, lining.y, wireEnd.x, wireEnd.y); 
    }
}
function mouseReleased() { /*When the mouse is released stop drawign the wire*/
    moving = null;
    if (lining?.type == 'output') {
        for (let i = 0; i < nearest.inputPos.length; i++) {
            let p = nearest.inputPos[i];
            if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, wireEnd.x, wireEnd.y)) {
                let isConnected = false;
                if (lining.node.type == types.junction) {
                    lining.node.outputNodes.push({ node: nearest, index: i })
                } else {
                    lining.node.outputNodes[lining.index] = { node: nearest, index: i }
                }
            }
        }
    } else if (lining?.type == 'input') {
        for (let i = 0; i < nearest.outputPos.length; i++) {
            let p = nearest.outputPos[i];
            if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, wireEnd.x, wireEnd.y)) {
                if (nearest.type == types.junction) {
                    nearest.outputNodes.push({ node: lining.node, index: lining.index })
                } else {
                    nearest.outputNodes[i] = { node: lining.node, index: lining.index }
                }
            }
        }
    }
    lining = null;
    image(bg, 0, 0);
}

let setintervalvar;
function touchStarted() { /*Detect if the touch is just a tap or a hold*/
    setNearest();
    mousePressed();
    setintervalvar = setTimeout(() => {
        touchHold();
    }, 500);
}
function touchMoved() { /*Mouse dragged gets called*/
    mouseDragged();
    clearInterval(setintervalvar)
}
function touchEnded() { /*Mouse released gets called*/
    mouseReleased();
    clearTimeout(setintervalvar);
    mousePressedTimeout = false;
    setTimeout(() => {
        mousePressedTimeout = true;
    }, 100);
}
function touchHold() {
    if (isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) {
        optionNode = nearest;
        showOptions();
    }
}

/*Rename Nodes*/
function renameNode(node) {
    if (!node) {
        hideOptions();
        return;
    }
    if (node.type == types.input || node.type == types.output) {
        let name = prompt("Enter a new name: ");
        if (!name) {return;}
        if (!name.match(/^\w+$/)) { alert("Only letters, numbers, and underscores!"); return; }
        node.name = name;
    }
    image(bg, 0, 0);
    hideOptions();
    optionNode = null;
}
/*Delete Nodes*/
function deleteNode(node) {
    if (!node) {
        hideOptions();
        return;
    }
    for (let i = 0; i < node.outputNodes.length; i++) {
        if(node.outputNodes[i]?.node?.inputConnected == true){
            node.outputNodes[i].node.inputConnected = false;
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].outputNodes.length; j++) {
            if (nodes[i].outputNodes[j]?.node == node) {
                nodes[i].outputNodes[j] = null;
            }
        }
    }
    nodes.splice(nodes.indexOf(node), 1);
    image(bg, 0, 0);
    optionNode = null;
    hideOptions();
}
/*Break Output Connection*/
function breakOutputConnection(node) {
    if (!node) {
        hideOptions();
        return;
    }
    for(let i = 0; i < node.outputNodes.length; i++){
        node.outputNodes[i]?.node.setInput(0, node.outputNodes[i].index);
        if(node.outputNodes[i]?.node.inputConnected == true){
            node.outputNodes[i].node.inputConnected == false;
        }
    }
    node.outputNodes.fill(null);
    image(bg, 0, 0);
    optionNode = null;
    hideOptions();
}

/*This func does a DFS (Depth First Search) to record all the nodes it visited
also  */
function DFS(node, _ids = []) {
    let _nodes = [];
    if (!node) return _nodes;
    if (node.type == types.output) return _nodes;
    if (_ids.includes(node.id)) return _nodes;
    if (node.type == types.input) {
        node.name = node.name || node.type;
    }
    _ids.push(node.id)
    _nodes.push(node)
    for (let i = 0; i < node.outputNodes.length; i++) {
        if (!node.outputNodes[i]) continue;
        if (node.outputNodes[i]?.node.type == types.output) {
            node.outputNodes[i].node.name = node.outputNodes[i].node.name || node.outputNodes[i].node.type;
            _ids.push(node.outputNodes[i].node.id);
            _nodes.push(node.outputNodes[i].node);
        } else
            _nodes.push(...DFS(node.outputNodes[i]?.node, _ids));
        if (!node.outputNodes[i].node.inputNodes) node.outputNodes[i].node.inputNodes = [];
        let check = node.outputNodes[i].node.inputNodes.filter(n => ((n.node.id == node.id) && (n.index == i)))
        if (check.length == 0)
            node.outputNodes[i].node.inputNodes.push({ node, index: i });
    }
    return _nodes;
}
function getBooleanFunction(outputs) {
    let outputArr = [];
    for (let i = 0; i < outputs.length; i++) {
        outputArr.push(revDFS(outputs[i], 0));
    }
    return outputArr;
}

/*This part does a rverse DFS to create boolean funvction froma  givern node toı its connections*/
function revDFS(node, idx) {
    if (!node) return '';
    if (node.type == types.input || node.type == types.pulse) {
        return node.name;
    }
    if (!node.inputNodes) return '';
    let variables = {}
    let varASCII = 97;
    for (let i = 0; i < node.inputNodes.length; i++) {
        variables[char(varASCII++)] = {
            node: node.inputNodes[i]?.node,
            index: node.inputNodes[i]?.index
        }
    }
    let out = operations[node.type];
    if (typeof out != 'string') {
        out = out[idx];
    }
    out = listFromString(out);
    for (let i = 0; i < out.length; i++) {
        if (out[i].match(/^\w$/g)) {
            out[i] = revDFS(variables[out[i]].node, variables[out[i]].index);
        }
    }
    out = out.join('')
    return out;
}

/*Places nodes in a tidy manner next to each other*/
function placeNode(node) {
    let x = 50, y = 100;
    if (rack.length > 0) {
        x = rack[rack.length - 1].x + rack[rack.length - 1].w / 2 + node.w / 2 + 20;
        y = rack[rack.length - 1].y;
        if (x + node.w / 2 + 10 > width) {
            x = 50;
            y += 50;
        }
    }
    node.x = x;
    node.y = y;
    rack.push(node);
    nodes.push(node)
}

window.addEventListener('resize', resizeWindow)

function resizeWindow() {
    if (windowWidth < windowHeight) {
        select('.sidebar').elt.className = 'sidebar hr';
    } else {
        select('.sidebar').elt.className = 'sidebar vr';
    }
    let cnvcont = select('.cnvcont')
    resizeCanvas(cnvcont.width, cnvcont.height - 10);
    image(bg, 0, 0, width, height);
}

function setNearest() {
    let minDist = 1000000;
    for (let i = 0; i < nodes.length; i++) {
        let distance = dist(mouseX, mouseY, nodes[i].x, nodes[i].y);
        if (distance < minDist) {
            minDist = distance;
            nearest = nodes[i];
        }
        nodes[i].show();
        nodes[i].operate()
    }
}

/*Background Settings*/
function createBG(){
    let bg = createGraphics(width, height);
    let size = 50;
    bg.stroke(0, 50)
    bg.background('#f5aecf')
    for (let j = 0; j < height; j += size) bg.line(0, j, width, j);
    for (let i = 0; i < width; i += size) bg.line(i, 0, i, height);
    bg.fill(0, 60);
    bg.noStroke()
    bg.textAlign(CENTER, CENTER)
    bg.translate(windowWidth / 2, windowHeight / 2)
    bg.rotate(-PI / 16)
    return bg;
}

/*Clear Button Alert*/
function clearAllData(){
    if(confirm("SİLMEK İSTEDİĞİNE EMİN MİSİN?")){
            localStorage.clear();
            window.location.reload()
        }
}

var handleEvent = function (e) {
    if (moving)
        e.preventDefault();      //Disables scrolling by mouse wheel and touch move
};

cnvcontcont.addEventListener('touchmove', handleEvent, false);