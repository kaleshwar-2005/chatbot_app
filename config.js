// Ollama Configuration
const OLLAMA_CONFIG = {
    // Ollama API endpoint
    baseUrl: 'http://localhost:11434',
    
    // Available models - add your installed models here
    models: {
        llama2: 'llama2',
        mistral: 'mistral',
        codellama: 'codellama',
        gemma: 'gemma',
        phi: 'phi',
        neural: 'neural-chat',
        llama3: 'llama3',
        llama3_8b: 'llama3:8b',
        llama3_70b: 'llama3:70b'
    },
    
    // Default model to use
    defaultModel: 'mistral',
    
    // Model parameters
    parameters: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        repeat_penalty: 1.1,
        max_tokens: 2048
    }
};

// Function to get current model
function getCurrentModel() {
    return localStorage.getItem('selectedModel') || OLLAMA_CONFIG.defaultModel;
}

// Function to set current model
function setCurrentModel(modelName) {
    if (OLLAMA_CONFIG.models[modelName]) {
        localStorage.setItem('selectedModel', modelName);
        return true;
    }
    return false;
}

// Function to get all available models
function getAvailableModels() {
    return Object.keys(OLLAMA_CONFIG.models);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OLLAMA_CONFIG, getCurrentModel, setCurrentModel, getAvailableModels };
} 