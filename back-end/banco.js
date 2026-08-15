export async function bancoDeDados(termo) {
    try {
        const termoFormatado = encodeURIComponent(termo);
        const url = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${termoFormatado}&srlimit=10&format=json&origin=*`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dados = await response.json()
        console.log(dados)
        
        const resultadosWikipedia = dados.query?.search || [];
        // Mapeia o formato da Wikipedia para a estrutura que o front-end espera
        return resultadosWikipedia.map(doc => ({
            id: doc.pageid,
            titulo: doc.title,
            // Remove as tags HTML <span class="searchmatch"> que a Wikipedia coloca no snippet
            conteudo: doc.snippet.replace(/<[^>]*>?/gm, '') + '...',
            url: `https://pt.wikipedia.org/?curid=${doc.pageid}`
        }));

    } catch (erro) {
        console.error('Deu erro na requisição do banco:', erro);
        return [];
    }
}