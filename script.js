const inputEl = document.getElementById('userInput');
const btnEl = document.getElementById('sendBtn');
const chatContainerEl = document.getElementById('chatBox');
const formEl = document.getElementById('chatForm');
const scrollToBottomBtn = document.getElementById('scrollToBottom');

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