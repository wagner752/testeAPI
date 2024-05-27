document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmButton').addEventListener('click', function() {
        abrirChamadoNoGLPI();
    });
});

async function abrirChamadoNoGLPI() {
    const usuario = 'ApiAberturaAutoSolucao';
    const senha = 'Gentil@2024';
    const appToken = 'lwOP7WFP5l5uDYQNSDlFV3NOxi0VFSQTwm8SegJa'; // Se você estiver usando um App Token
    const urlInitSession = 'https://gentil.verdanadesk.com/apirest.php/initSession';
    const urlCreateTicket = 'https://gentil.verdanadesk.com/apirest.php/Ticket';

    try {
        // Inicia a sessão e obtém o token de sessão
        const sessionResponse = await fetch(urlInitSession, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(usuario + ':' + senha)
            }
        });

        if (!sessionResponse.ok) {
            throw new Error('Falha ao iniciar sessão: ' + sessionResponse.statusText);
        }

        const sessionData = await sessionResponse.json();
        const sessionToken = sessionData.session_token;

        // Dados do chamado (sem a categoria)
        const ticketData = {
            input: {
                name: 'Título do Chamado',
                content: 'Descrição do problema',
                status: 1 // Define o status do chamado (1 = Novo)
            }
        };

        console.log('Token de Sessão:', sessionToken);
        console.log('Dados do Chamado:', JSON.stringify(ticketData));

        // Cria o chamado no GLPI
        const ticketResponse = await fetch(urlCreateTicket, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': sessionToken,
                'App-Token': appToken // Se você estiver usando um App Token
            },
            body: JSON.stringify(ticketData)
        });

        if (!ticketResponse.ok) {
            const errorResponse = await ticketResponse.json();
            console.error('Erro ao criar chamado:', errorResponse);
            throw new Error('Erro ao criar chamado: ' + ticketResponse.statusText);
        }

        const ticketResponseData = await ticketResponse.json();
        alert('Chamado criado com sucesso! ID do Chamado: ' + ticketResponseData.id);

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro: ' + error.message);
    }
}
