var con = document.getElementById("con");

var BOAT = '<img style="width:30px" src="boat-tiny.png"></img>';

function print(text) {
    text = text + "";
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
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
}

// Do something with your data.
function loadStuff() {
    var url = new URL(window.location.href);
    var urlSrc = decodeURI(url.searchParams.get("src"));
    if (urlSrc && urlSrc != "null")
        return {src: urlSrc};
    else if (saveData.obj && saveData.obj.src && saveData.obj.src != "null")
        return saveData.obj;
    else
        return {src: defaultCode};
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

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function copy() {
    var url = "https://naheel-azawy.github.io/boat-code?src=";
    url += encodeURI(editor.getValue());
    copyTextToClipboard(url);
}

editor.setValue(loadStuff().src);

editor.on('change', function(cm, changeObj) {
    saveStuff({src: cm.getValue()});
});

run();
