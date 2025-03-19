document.getElementById('cep').addEventListener('blur', async function () {
    const cep = this.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos do CEP
   
    // Verifica se o CEP tem exatamente 8 dígitos
    if (cep.length !== 8) {
        alert("CEP inválido, deve ter 8 dígitos");
        return; // Para o código
    }

    try {
        // Faz uma requisição para o Backend para buscar o cep, conforme o cep digitado
        const response = await fetch(`http://localhost:3000/api/cep/${cep}`);
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar o CEP!');
        }

        // Converte a resposta da requisição para JSON
        const data = await response.json();
        console.log(data);  // Loga a resposta no console para verificar os dados recebidos

        // Verifica se o CEP retornado pela API é inválido
        if (data.erro) {
            alert("CEP não encontrado!");
            return; // Para o código
        }

        // Preenche os campos do formulário com os dados retornados
        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;

        // Adiciona um feedback visual, alterando a cor da borda dos campos
        document.querySelectorAll('#logradouro, #bairro, #cidade, #estado').forEach((input) => {
            input.style.borderColor = '#6a11cb';
        });
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error); // Exibe o erro no console
        alert('Erro ao buscar o CEP. Verifique o console!');
    }
});

// Adiciona o envio da informação ao DB
document.getElementById('addressForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Impede o carregamento da página ao enviar o formulário
    
    // Obtém os valores dos campos do formulário
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    try {
        // Faz uma requisição POST para o backend para salvar o endereço
        const response = await fetch('http://localhost:3000/api/address', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json' // Define o envio do conteúdo como JSON
            },
            body: JSON.stringify({ cep, logradouro, bairro, cidade, estado }) // Envia as informações
        });

        if (!response.ok) { // Verifica se a resposta foi Ok
            throw new Error('Erro ao salvar o endereço');
        }

        // Converte a resposta da requisição para JSON
        const result = await response.json();
        alert(result.message); // Exibe a mensagem de sucesso retornada do backend

        // Limpa os campos do formulário após o envio ao banco de dados
        document.getElementById('addressForm').reset();
        
        // Remove o Feedback visual (Borda Colorida)
        document.querySelectorAll('.form-group input').forEach(input => {
            input.style.borderColor = '#ddd'; // Define a borda de volta para o padrão
        });
    } catch (error) {
        console.error('Erro ao salvar o endereço:', error); // Exibe erro no console
        alert('Erro ao salvar o endereço. Verifique o console para mais detalhes.');
    }
});
