var con = document.getElementById("con");

var BOAT = '<img style="width:30px" src="boat-tiny.png"></img>';

function print(text) {
    con.innerHTML += text.split(" ").join("&nbsp")
        .split("\n").join("<br>")
        .split("BOAT").join(BOAT) + "<br>";
}

function clear() {
    con.innerHTML = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var defaultCode = `
print("Hi!!!!!!!")
for (let i = 0; i < 5; i++)
  print("Hello MASHA!!! " + "BOAT".repeat(i))
`;

var saveData = JSON.parse(localStorage.saveData || null) || {};

// Store your data.
function saveStuff(obj) {
    saveData.obj = obj;
    // saveData.foo = foo;
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
}

// Do something with your data.
function loadStuff() {
    return saveData.obj || {src: defaultCode};
}

var editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
    lineNumbers: true, theme: "ayu-dark"
});
editor.setSize("auto", "60vh");

function run() {
    con.innerHTML = "";
    var code = editor.getValue();
    eval(code);
}

editor.setValue(loadStuff().src);

editor.on('change', function(cm, changeObj) {
    saveStuff({src: cm.getValue()});
});

run();
