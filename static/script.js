// Variáveis Globais
let chatHistory = [];
let userName = '';
let voiceEnabled = false;
let synthesis = window.speechSynthesis;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    checkLogin();
    autoResizeTextarea();
});

// Gerenciamento de Cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            try {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            } catch {
                return c.substring(nameEQ.length, c.length);
            }
        }
    }
    return null;
}

// Carregar dados do usuário
function loadUserData() {
    const savedUser = getCookie('techbuddy_user');
    const savedHistory = getCookie('techbuddy_history');
    
    if (savedUser) {
        userName = savedUser;
    }
    
    if (savedHistory) {
        chatHistory = savedHistory;
        restoreChat();
    }
}

// Verificar login
function checkLogin() {
    if (!userName) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'none';
        updateGreeting();
    }
}

// Salvar nome do usuário
function saveUserName() {
    const input = document.getElementById('userName');
    const name = input.value.trim();
    
    if (name) {
        userName = name;
        setCookie('techbuddy_user', userName, 365);
        document.getElementById('loginModal').style.display = 'none';
        updateGreeting();
        addSystemMessage(`Olá, ${userName}! 👋 Como posso ajudar você hoje?`);
    } else {
        input.style.borderColor = '#f5576c';
        setTimeout(() => {
            input.style.borderColor = '#667eea';
        }, 1000);
    }
}

// Atualizar saudação
function updateGreeting() {
    document.getElementById('userGreeting').textContent = `👤 ${userName}`;
}

// Restaurar chat anterior
function restoreChat() {
    const messagesContainer = document.getElementById('chatMessages');
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) welcomeMsg.remove();
    
    chatHistory.forEach(msg => {
        addMessageToUI(msg.role === 'user' ? 'user' : 'assistant', msg.content, false);
    });
    
    scrollToBottom();
}

// Salvar histórico
function saveHistory() {
    setCookie('techbuddy_history', chatHistory, 30);
}

// Adicionar mensagem na UI
function addMessageToUI(type, text, animate = true) {
    const messagesContainer = document.getElementById('chatMessages');
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) welcomeMsg.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    if (!animate) messageDiv.style.animation = 'none';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    
    scrollToBottom();
}

// Adicionar mensagem do sistema
function addSystemMessage(text) {
    addMessageToUI('assistant', text);
}

// Enviar mensagem
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Adicionar mensagem do usuário
    addMessageToUI('user', message);
    chatHistory.push({ role: 'user', content: message });
    
    input.value = '';
    input.style.height = 'auto';
    
    // Atualizar status
    updateStatus('Pensando...');
    
    try {
        // Fazer requisição para a API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Adicionar resposta do assistente
            addMessageToUI('assistant', data.message);
            chatHistory.push({ role: 'assistant', content: data.message });
            
            // Salvar histórico
            saveHistory();
            
            // Falar resposta se voz estiver ativada
            if (voiceEnabled) {
                speak(data.message);
            }
            
            updateStatus('Pronto');
        } else {
            addSystemMessage('❌ Desculpe, ocorreu um erro. Tente novamente.');
            updateStatus('Erro');
        }
    } catch (error) {
        console.error('Erro:', error);
        addSystemMessage('❌ Erro de conexão. Verifique sua internet.');
        updateStatus('Erro');
    }
}

// Atualizar status
function updateStatus(text) {
    document.getElementById('statusText').textContent = text;
}

// Função de voz (Text-to-Speech)
function speak(text) {
    if ('speechSynthesis' in window) {
        // Cancelar qualquer fala anterior
        synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        synthesis.speak(utterance);
    }
}

// Toggle de voz
function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const voiceBtn = document.querySelector('.voice-btn');
    
    if (voiceEnabled) {
        voiceBtn.classList.add('active');
        addSystemMessage('🔊 Voz ativada! Agora vou ler minhas respostas.');
    } else {
        voiceBtn.classList.remove('active');
        synthesis.cancel();
        addSystemMessage('🔇 Voz desativada.');
    }
}

// Auto-resize do textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('messageInput');
    
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Tecla Enter para enviar
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Novo chat
function newChat() {
    if (confirm('Deseja iniciar uma nova conversa? O histórico atual será mantido.')) {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h1>👋 Olá, ${userName}!</h1>
                <p>Começando uma nova conversa. Como posso ajudar você hoje?</p>
            </div>
        `;
        
        // Salvar histórico antigo e iniciar novo
        chatHistory = [];
        saveHistory();
        
        updateStatus('Pronto para nova conversa');
    }
}

// Abrir modal Sobre
function openAbout() {
    document.getElementById('aboutModal').classList.remove('hidden');
}

// Fechar modal Sobre
function closeAbout() {
    document.getElementById('aboutModal').classList.add('hidden');
}

// Scroll automático
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Fechar modal clicando fora
window.onclick = function(event) {
    const aboutModal = document.getElementById('aboutModal');
    if (event.target === aboutModal) {
        closeAbout();
    }
}