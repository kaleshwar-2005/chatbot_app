const inputEl = document.getElementById('userInput');
const btnEl = document.getElementById('sendBtn');
const chatContainerEl = document.getElementById('chatBox');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const newChatBtn = document.getElementById('newChatBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Model selection elements
const settingsBtn = document.getElementById('settingsBtn');
const modelModal = document.getElementById('modelModal');
const closeModelModal = document.getElementById('closeModelModal');
const modelSelect = document.getElementById('modelSelect');
const currentModelDisplay = document.getElementById('currentModelDisplay');
const saveModelBtn = document.getElementById('saveModelBtn');
const cancelModelBtn = document.getElementById('cancelModelBtn');

// Add scroll to bottom button logic
const formEl = document.getElementById('chatForm');
const scrollToBottomBtn = document.getElementById('scrollToBottom');

// Sidebar functionality
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    }
});

// New chat functionality
newChatBtn.addEventListener('click', () => {
    clearChat();
    updateChatTitle('New Chat');
});

// Suggestion chips functionality
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        inputEl.value = prompt;
        inputEl.focus();
        btnEl.disabled = false;
    });
});

// Auto-resize textarea
inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    btnEl.disabled = !inputEl.value.trim();
});

// Enter to send (Shift+Enter for new line)
inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!btnEl.disabled) {
            createQueryAndResponse();
        }
    }
});

// Show/hide scroll to bottom button
chatContainerEl.addEventListener('scroll', () => {
    if (chatContainerEl.scrollTop > 300) {
        scrollToBottomBtn.classList.add('visible');
    } else {
        scrollToBottomBtn.classList.remove('visible');
    }
});

// Scroll to bottom functionality
scrollToBottomBtn.addEventListener('click', () => {
    chatContainerEl.scrollTo({
        top: chatContainerEl.scrollHeight,
        behavior: 'smooth'
    });
});

function updateChatTitle(title) {
    const chatTitle = document.querySelector('.chat-title h4');
    chatTitle.textContent = title;
}

function clearChat() {
    // Remove all messages except welcome message
    const messages = chatContainerEl.querySelectorAll('.chat-message');
    messages.forEach(msg => msg.remove());
    
    // Show welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'flex';
    }
}

function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatContainerEl.appendChild(typingDiv);
    chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
    return typingDiv;
}

function formatBotResponse(text) {
    // Add a friendly greeting if the response is long
    if (text.length > 100) {
        text = "Here's what I found:\n\n" + text;
    }

    // Split the response into sections if it contains code blocks
    if (text.includes('```')) {
        const parts = text.split('```');
        let formattedText = '';
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Regular text
                formattedText += parts[i].split('\n').map(line => {
                    // Format section headers
                    if (line.trim().endsWith(':')) {
                        return `<div class="section-header">${line}</div>`;
                    }
                    // Format bullet points
                    if (line.trim().startsWith('* ')) {
                        return `<div class="bullet-point">${line.replace('* ', '')}</div>`;
                    }
                    // Format numbered lists
                    if (/^\d+\.\s/.test(line.trim())) {
                        return `<div class="numbered-point">${line}</div>`;
                    }
                    // Format important notes
                    if (line.toLowerCase().includes('note:') || line.toLowerCase().includes('important:')) {
                        return `<div class="important-note">${line}</div>`;
                    }
                    // Format steps
                    if (line.toLowerCase().includes('step')) {
                        return `<div class="step">${line}</div>`;
                    }
                    return line;
                }).join('<br>');
            } else {
                // Code block
                formattedText += `<div class="code-block-wrapper">
                    <div class="code-header">Code Example:</div>
                    <pre class="code-block">${parts[i]}</pre>
                </div>`;
            }
        }
        return formattedText;
    }
    
    // If no code blocks, just format regular text
    return text.split('\n').map(line => {
        if (line.trim().endsWith(':')) {
            return `<div class="section-header">${line}</div>`;
        }
        if (line.trim().startsWith('* ')) {
            return `<div class="bullet-point">${line.replace('* ', '')}</div>`;
        }
        if (/^\d+\.\s/.test(line.trim())) {
            return `<div class="numbered-point">${line}</div>`;
        }
        if (line.toLowerCase().includes('note:') || line.toLowerCase().includes('important:')) {
            return `<div class="important-note">${line}</div>`;
        }
        if (line.toLowerCase().includes('step')) {
            return `<div class="step">${line}</div>`;
        }
        return line;
    }).join('<br>');
}

function createMessageElement(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', isUser ? 'user' : 'bot');
    
    if (isUser) {
        messageDiv.textContent = message;
    } else {
        messageDiv.innerHTML = formatBotResponse(message);
    }
    return messageDiv;
}

function scrollToBottom() {
    chatContainerEl.scrollTo({
        top: chatContainerEl.scrollHeight,
        behavior: 'smooth'
    });
}

async function createQueryAndResponse() {
    if (!inputEl.value.trim()) return;

    const userMessage = inputEl.value;
    inputEl.value = '';

    // Add user message
    chatContainerEl.appendChild(createMessageElement(userMessage, true));
    scrollToBottom();

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCq4G02lankPBQ6FDdTTEt2aY4lyg8O-jU';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        // Remove typing indicator
        typingIndicator.remove();

        // Add bot response
        chatContainerEl.appendChild(createMessageElement(botResponse));
        scrollToBottom();

    } catch (error) {
        typingIndicator.remove();
        chatContainerEl.appendChild(createMessageElement('Sorry, I encountered an error. Please try again.'));
        scrollToBottom();
    }
}

formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    createQueryAndResponse();
});

// Enable/disable send button based on input
inputEl.addEventListener('input', () => {
    btnEl.disabled = !inputEl.value.trim();
});

// Initial scroll to bottom
scrollToBottom();

// Initialize model selection
function initializeModelSelection() {
    const currentModel = getCurrentModel();
    modelSelect.value = currentModel;
    currentModelDisplay.textContent = OLLAMA_CONFIG.models[currentModel] || currentModel;
}

// Model selection modal functionality
settingsBtn.addEventListener('click', () => {
    modelModal.style.display = 'block';
    initializeModelSelection();
});

closeModelModal.addEventListener('click', () => {
    modelModal.style.display = 'none';
});

cancelModelBtn.addEventListener('click', () => {
    modelModal.style.display = 'none';
});

saveModelBtn.addEventListener('click', () => {
    const selectedModel = modelSelect.value;
    if (setCurrentModel(selectedModel)) {
        currentModelDisplay.textContent = OLLAMA_CONFIG.models[selectedModel] || selectedModel;
        modelModal.style.display = 'none';
        // Show success message
        showNotification('Model updated successfully!', 'success');
    } else {
        showNotification('Invalid model selection!', 'error');
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modelModal) {
        modelModal.style.display = 'none';
    }
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 