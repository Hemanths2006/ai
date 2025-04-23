// app.js
// Terminal functionality
const terminalBody = document.getElementById('terminalBody');
const commandInput = document.getElementById('commandInput');
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const contactBtn = document.getElementById('contactBtn');
const contactMessage = document.getElementById('contactMessage');

// Scroll to bottom of terminal
function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Add command to terminal
function addCommand(input, output, isError = false, isSystem = false, isAI = false) {
    const commandDiv = document.createElement('div');
    commandDiv.classList.add('command');
    
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('command-input');
    inputDiv.textContent = `> ${input}`;
    commandDiv.appendChild(inputDiv);
    
    const outputDiv = document.createElement('div');
    outputDiv.classList.add('command-output');
    
    if (isError) {
        outputDiv.classList.add('error');
    } else if (isSystem) {
        outputDiv.classList.add('system');
    } else if (isAI) {
        outputDiv.classList.add('ai');
    } else {
        outputDiv.classList.add('success');
    }
    
    outputDiv.textContent = output;
    commandDiv.appendChild(outputDiv);
    
    terminalBody.insertBefore(commandDiv, document.getElementById('prompt'));
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('command');
    typingDiv.id = 'typingIndicator';
    
    const outputDiv = document.createElement('div');
    outputDiv.classList.add('command-output', 'system');
    outputDiv.textContent = 'Zeds Ai is thinking...';
    
    typingDiv.appendChild(outputDiv);
    terminalBody.insertBefore(typingDiv, document.getElementById('prompt'));
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Matrix background effect
function createMatrixEffect() {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const container = document.getElementById('matrixBg');
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = '-100%';
        column.style.left = `${i * fontSize}px`;
        column.style.width = `${fontSize}px`;
        column.style.color = `hsl(${Math.random() * 60 + 100}, 100%, 50%)`;
        column.style.fontSize = `${fontSize}px`;
        column.style.fontFamily = 'monospace';
        column.style.whiteSpace = 'nowrap';
        column.style.animation = `matrixRain ${Math.random() * 5 + 3}s linear infinite`;
        column.style.animationDelay = `${Math.random() * 2}s`;
        
        let text = '';
        const length = Math.floor(Math.random() * 20) + 10;
        for (let j = 0; j < length; j++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        column.textContent = text;
        container.appendChild(column);
    }
}

// Send message to DeepSeek R1 API
async function sendToDeepSeek(message) {
    const model = 'deepseek/deepseek-r1:free';
    const temperature = 0.7;
    const maxTokens = 1024;
    
    try {
        showTypingIndicator();
        
        const headers = {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        };
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: temperature,
                max_tokens: maxTokens
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        hideTypingIndicator();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        hideTypingIndicator();
        console.error('Error calling DeepSeek API:', error);
        return `Error: ${error.message}`;
    }
}

// Handle command input
commandInput.addEventListener('keypress', async function(e) {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command) {
            // Add command to terminal
            addCommand(command, 'Processing...', false, true);
            commandInput.value = '';
            
            // Process command
            if (command.startsWith('/')) {
                // Handle system commands
                if (command === '/help') {
                    addCommand(command, `
Available commands:
/help - Show this help message
/clear - Clear the terminal
                    `, false, true);
                } else if (command === '/clear') {
                    // Clear terminal except the first system message and prompt
                    const commands = document.querySelectorAll('.command');
                    for (let i = 1; i < commands.length - 1; i++) {
                        commands[i].remove();
                    }
                } else {
                    addCommand(command, `Unknown command: ${command}`, true, true);
                }
            } else {
                // Send to DeepSeek API
                const response = await sendToDeepSeek(command);
                addCommand(command, response, response.startsWith('Error:'), false, true);
            }
            
            commandInput.focus();
        }
    }
});

// Authentication
// Check auth state
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        authModal.style.display = 'none';
        adminPanel.style.display = 'block';
        addCommand('/auth', `Admin logged in as ${user.email}`, false, true);
    } else {
        // User is signed out
        authModal.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            loginError.textContent = '';
        })
        .catch(error => {
            loginError.textContent = 'Invalid credentials';
        });
});

// Contact button
contactBtn.addEventListener('click', function() {
    contactMessage.style.display = 'block';
});

// Logout
logoutBtn.addEventListener('click', function() {
    auth.signOut();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createMatrixEffect();
    commandInput.focus();
    
    // Add welcome message
    setTimeout(() => {
        addCommand('system', 'Zeds Ai  Console initialized. Type /help for available commands.', false, true);
    }, 1000);
});
