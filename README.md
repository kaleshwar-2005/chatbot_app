# AI Chatbot with Ollama Integration

A modern, responsive AI chatbot that connects to your local Ollama LLM instead of cloud APIs.

## Features

- 🤖 **Local AI Processing** - Uses your own Ollama models
- 🎨 **Modern UI** - Clean, responsive design with smooth animations
- 🔄 **Model Switching** - Easily switch between different Ollama models
- 💬 **Real-time Chat** - Smooth typing animations and message display
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚙️ **Configurable** - Easy to customize model parameters

## Setup Instructions

### 1. Install Ollama

First, install Ollama on your system:

**Windows:**
```bash
# Download from https://ollama.ai/download
# Or use winget
winget install Ollama.Ollama
```

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Start Ollama

```bash
ollama serve
```

### 3. Download a Model

Choose and download a model (examples):

```bash
# Llama 2 (7B parameters)
ollama pull llama2

# Mistral (7B parameters) - Good balance of speed and quality
ollama pull mistral

# Code Llama (7B parameters) - Great for coding tasks
ollama pull codellama

# Llama 3 (8B parameters) - Latest model
ollama pull llama3:8b

# Gemma (2B parameters) - Lightweight and fast
ollama pull gemma
```

### 4. Run the Chatbot

1. Open `index.html` in your web browser
2. Click the "Settings" button in the sidebar
3. Select your preferred model from the dropdown
4. Start chatting!

## Configuration

### Model Selection

You can easily switch between models:
1. Click the "Settings" button in the sidebar
2. Choose your preferred model from the dropdown
3. Click "Save Selection"

### Available Models

The chatbot supports these models (make sure they're installed in Ollama):

- **Llama 2** - Good general-purpose model
- **Mistral** - Fast and efficient
- **Code Llama** - Specialized for coding tasks
- **Gemma** - Lightweight and fast
- **Phi** - Microsoft's small but capable model
- **Neural Chat** - Good for conversations
- **Llama 3** - Latest generation (8B and 70B variants)

### Customizing Parameters

Edit `config.js` to adjust model parameters:

```javascript
parameters: {
    temperature: 0.7,    // Controls randomness (0.0-1.0)
    top_p: 0.9,         // Nucleus sampling
    top_k: 40,          // Top-k sampling
    repeat_penalty: 1.1, // Prevents repetition
    max_tokens: 2048    // Maximum response length
}
```

## Troubleshooting

### "Cannot connect to Ollama"
- Make sure Ollama is running: `ollama serve`
- Check that Ollama is accessible at `http://localhost:11434`

### "Model not found"
- Install the model: `ollama pull <model-name>`
- Check available models: `ollama list`

### Slow responses
- Try a smaller model (e.g., `gemma` instead of `llama3:70b`)
- Adjust parameters in `config.js`
- Ensure you have enough RAM available

### Poor quality responses
- Try a larger model
- Adjust temperature (lower = more focused, higher = more creative)
- Check if the model is fully downloaded

## Advanced Usage

### Adding Custom Models

1. Create a custom model in Ollama
2. Add it to the `models` object in `config.js`
3. Update the dropdown options in `index.html`

### Streaming Responses

For real-time streaming, modify the API call in `script.js`:

```javascript
body: JSON.stringify({
    model: modelName,
    prompt: userMessage,
    stream: true,  // Enable streaming
    options: { ... }
})
```

### Backend Integration

For production use, consider:
- Adding a backend server (Node.js, Python, etc.)
- Implementing user authentication
- Adding conversation history storage
- Setting up proper CORS handling

## File Structure

```
chatbot/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # CSS styling
├── config.js           # Configuration and model settings
└── README.md           # This file
```

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!
