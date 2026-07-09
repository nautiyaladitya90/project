// Coding Practice Logic

let currentLang = 'web';
let pyodideInstance = null;

// Monaco Editor Instances
let monacoHtml = null;
let monacoPython = null;
let monacoC = null;

const defaultHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; }
</style>
</head>
<body>
  <h1>Hello World</h1>
  <script>
    console.log('Running JS');
  </script>
</body>
</html>`;

const defaultPython = `print('Hello Python!')`;
const defaultC = `#include <stdio.h>

int main() {
    printf("Hello, C World!\\n");
    return 0;
}`;

document.addEventListener('DOMContentLoaded', async () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const lang = e.target.getAttribute('data-lang');
            switchEditorView(lang);
        });
    });

    // Action Buttons
    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('clear-btn').addEventListener('click', clearCode);

    // Initialize initial view
    switchEditorView('web');

    // Setup Pyodide asynchronously without blocking
    loadPyodide().then(py => {
        pyodideInstance = py;
        console.log("Pyodide Loaded Successfully");
    }).catch(err => {
        console.error("Pyodide Load Error", err);
    });

    // Initialize Monaco Editor
    if (window.require) {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' }});
        
        window.MonacoEnvironment = {
            getWorkerUrl: function(workerId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                    self.MonacoEnvironment = {
                        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/'
                    };
                    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs/base/worker/workerMain.js');
                `)}`;
            }
        };

        require(['vs/editor/editor.main'], function() {
            monacoHtml = monaco.editor.create(document.getElementById('html-code-container'), {
                value: defaultHtml,
                language: 'html',
                theme: 'vs-dark',
                automaticLayout: true
            });

            monacoPython = monaco.editor.create(document.getElementById('py-code-container'), {
                value: defaultPython,
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true
            });

            monacoC = monaco.editor.create(document.getElementById('c-code-container'), {
                value: defaultC,
                language: 'c',
                theme: 'vs-dark',
                automaticLayout: true
            });
        });
    }
});

function switchEditorView(lang) {
    currentLang = lang;
    
    // Hide all editors
    document.getElementById('editor-web').style.display = 'none';
    document.getElementById('editor-python').style.display = 'none';
    document.getElementById('editor-c').style.display = 'none';

    // Output views
    const frame = document.getElementById('output-frame');
    const consoleOut = document.getElementById('output-console');

    if (lang === 'web') {
        document.getElementById('editor-web').style.display = 'flex';
        frame.style.display = 'block';
        consoleOut.style.display = 'none';
        if (monacoHtml) setTimeout(() => monacoHtml.layout(), 10);
    } else if (lang === 'python') {
        document.getElementById('editor-python').style.display = 'flex';
        frame.style.display = 'none';
        consoleOut.style.display = 'block';
        if (monacoPython) setTimeout(() => monacoPython.layout(), 10);
    } else if (lang === 'c') {
        document.getElementById('editor-c').style.display = 'flex';
        frame.style.display = 'none';
        consoleOut.style.display = 'block';
        if (monacoC) setTimeout(() => monacoC.layout(), 10);
    }
}

async function runCode() {
    if (currentLang === 'web') {
        runWebCode();
    } else if (currentLang === 'python') {
        await runPythonCode();
    } else if (currentLang === 'c') {
        runCCode();
    }
}

function runWebCode() {
    const html = monacoHtml ? monacoHtml.getValue() : '';
    const frame = document.getElementById('output-frame');

    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
}

async function runPythonCode() {
    const code = monacoPython ? monacoPython.getValue() : '';
    const consoleOut = document.getElementById('output-console');
    
    if (!pyodideInstance) {
        consoleOut.textContent = "Python environment is still loading. Please wait...";
        return;
    }

    consoleOut.textContent = "Running Python code...\n";
    
    try {
        // Redirect stdout
        pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `);
        
        await pyodideInstance.runPythonAsync(code);
        
        const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
        consoleOut.textContent = stdout || "Execution finished with no output.";
        
    } catch (err) {
        consoleOut.textContent = "Error:\n" + err;
    }
}

function runCCode() {
    const consoleOut = document.getElementById('output-console');
    const code = monacoC ? monacoC.getValue() : '';
    
    consoleOut.innerHTML = "<span class='console-loader'>Compiling C Code... (Mock UI)</span>\n";
    
    setTimeout(() => {
        if (code.includes('printf')) {
            // Very basic mock to extract text inside printf
            const match = code.match(/printf\\s*\\(\\s*"(.*?)"/);
            if (match) {
                let txt = match[1].replace(/\\\\n/g, '\\n');
                consoleOut.innerHTML += txt + "\\n";
            } else {
                consoleOut.innerHTML += "Program finished executing.\\n";
            }
        } else {
             consoleOut.innerHTML += "Mock C Execution: Code compiled and ran successfully (No output detected).\\n";
        }
        consoleOut.innerHTML += "\\n[Process exited 0]";
    }, 1000);
}

function clearCode() {
    if (currentLang === 'web' && monacoHtml) {
        monacoHtml.setValue('');
        document.getElementById('output-frame').contentDocument.body.innerHTML = '';
    } else if (currentLang === 'python' && monacoPython) {
        monacoPython.setValue('');
        document.getElementById('output-console').textContent = 'Ready...';
    } else if (currentLang === 'c' && monacoC) {
        monacoC.setValue('');
        document.getElementById('output-console').textContent = 'Ready...';
    }
}
