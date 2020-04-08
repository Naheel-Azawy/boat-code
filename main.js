var defaultCode = `
print("Hi!!!!!!!")
for (let i = 1; i <= 5; i++) {
  print("Here " + (i > 1 ? "are" : "is") +
    " " + i + " boat" +
    (i > 1 ? "s" : "!!") + "!!! " +
    "BOAT".repeat(i))
}
await sleep(3000);
clear();
print("And here is a floating boat!")
await sleep(2000);
clear();
let s = 300;
let end = 5;
for (let i = 0; i < end; i++) {
  print("~ - ~ - ~ - ~ -");
  print(" ~ - BOAT ~ - ~");
  print("- ~ - ~ - ~ - ~");
  await sleep(s);
  clear();
  print("- ~ - ~ - ~ - ~");
  print("~ - ~ BOAT ~ - ~");
  print(" ~ - ~ - ~ - ~ -");
  if (i == end - 1) break;
  await sleep(s);
  clear();
  print(" ~ - ~ - ~ - ~ -");
  print("- ~ - ~ BOAT ~ -");
  print("- ~ - ~ - ~ - ~");
  await sleep(s);
  clear();
  print("- ~ - ~ - ~ - ~");
  print(" ~ - ~ - ~ BOAT -");
  print("~ - ~ - ~ - ~ -");
  await sleep(s);
  clear();
  print(" - ~ - ~ - ~ -");
  print("~ - ~ - ~ - BOAT");
  print("- ~ - ~ - ~ - ~");
  await sleep(s);
  clear();
  print("~ - ~ - ~ - ~ -");
  print("BOAT ~ - ~ - ~ -");
  print(" - ~ - ~ - ~ -");
  await sleep(s);
  clear();
  print(" - ~ - ~ - ~ -");
  print("- BOAT ~ - ~ - ~");
  print("~ - ~ - ~ - ~ -");
  await sleep(s);
  clear();
}
print(" == THE END ==");
`;

var con = document.getElementById("con");

var BOAT = '<img style="width:30px" src="boat-tiny.png"></img>';

function write(text, color) {
    text = text + "";
    text = text.split(" ").join("&nbsp")
        .split("\n").join("<br>")
        .split("BOAT").join(BOAT);
    if (color) {
        text = `<font color="${color}">${text}</font>`;
    }
    con.innerHTML += text;
}

function print(text, color) {
    write(text + "\n", color);
}

function print_err(text) {
    print("ERROR: " + text, "red");
}

function clear() {
    con.innerHTML = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    var urlSrc = url.searchParams.get("src");
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

var is_running = false;

function run() {
    if (is_running) {
        alert("Already running! Please wait while it finishes running");
        return;
    }
    is_running = true;
    con.innerHTML = "";
    var code = editor.getValue();
    code = `(async function() {
        try {
         ${code}
        } catch (_err) {
         print_err(_err);
        }
        is_running = false;
        })();`
    eval(code);
}

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
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
    url += encodeURIComponent(editor.getValue());
    copyTextToClipboard(url);
}

editor.setValue(loadStuff().src);

editor.on('change', function(cm, changeObj) {
    saveStuff({src: cm.getValue()});
});

run();
