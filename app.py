from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import os
import random
import app

app = Flask(__name__)
CORS(app)

# Configuração da API (você precisa adicionar sua chave)
COMET_API_KEY = os.environ.get('COMET_API_KEY', 'sk-ZhOeRTaTTg7BgPl1gn6zXEKY3vycezx0EzDnxaM9nQqE4OsS')
COMET_API_URL = 'https://api.cometapi.com/v1/chat/completions'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        chat_history = data.get('history', [])
        
        # MODO DE TESTE: Respostas simuladas (remova quando tiver a API key)
        # Se você não tiver a chave da API, use respostas simuladas
        if COMET_API_KEY == 'sua-chave-aqui':
            # Respostas de exemplo
            respostas = [
                f"Entendi sua pergunta sobre '{user_message[:50]}...'. Como assistente TechBuddy Nano, posso ajudar com informações técnicas, programação, e muito mais!",
                f"Interessante! Sobre '{user_message[:50]}...', posso te explicar de forma detalhada. O que exatamente você gostaria de saber?",
                f"Ótima pergunta! Vou te ajudar com isso. {user_message[:50]}... é um tópico fascinante. Deixe-me explicar:",
                f"Claro! Posso te ajudar com '{user_message[:50]}...'. Aqui está uma explicação: isso envolve vários conceitos importantes.",
                "Como seu assistente IA, estou aqui para ajudar! Pode me fazer qualquer pergunta sobre tecnologia, programação, ciência ou outros assuntos."
            ]
            
            assistant_message = random.choice(respostas)
            
            return jsonify({
                'success': True,
                'message': assistant_message
            })
        
        # MODO REAL: Usar a API do Comet
        # Preparar mensagens para a API
        messages = [
            {"role": "system", "content": "Você é o TechBuddy Nano, um assistente virtual amigável e técnico. Responda de forma clara, concisa e útil em português."}
        ]
        
        # Adicionar histórico (últimas 10 mensagens)
        for msg in chat_history[-10:]:
            messages.append({"role": msg['role'], "content": msg['content']})
        
        messages.append({"role": "user", "content": user_message})
        
        # Fazer requisição para a API do Comet
        headers = {
            'Authorization': f'Bearer {COMET_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-5',
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 1000
        }
        
        response = requests.post(COMET_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            assistant_message = result['choices'][0]['message']['content']
            return jsonify({
                'success': True,
                'message': assistant_message
            })
        else:
            error_msg = f'Erro na API: {response.status_code}'
            print(f"Erro na API: {response.text}")
            return jsonify({
                'success': False,
                'error': error_msg
            }), 500
            
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Erro de conexão: {str(e)}'
        }), 500
    except Exception as e:
        print(f"Erro geral: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Erro: {str(e)}'
        }), 500

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text', '')
        
        # Aqui você pode integrar com uma API de TTS
        # Por enquanto, retorna sucesso para usar a Web Speech API no frontend
        return jsonify({
            'success': True,
            'message': 'Use Web Speech API no frontend'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'TechBuddy Nano está funcionando!'
    })

if __name__ == '__main__':
    print("🤖 TechBuddy Nano iniciando...")
    print("📍 Acesse: http://localhost:5000")
    print("⚠️  MODO DE TESTE: Configure COMET_API_KEY para usar GPT-5 real")
    app.run(debug=True, host='0.0.0.0', port=5000)