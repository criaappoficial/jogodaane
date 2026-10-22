# Meu Look Fashion - PWA

O jogo continua sendo um único `index.html`. Para o modo PWA, esta pasta inclui também:

- `manifest.webmanifest`
- `sw.js`
- `icons/` com ícones 192, 512, maskable e Apple Touch

## Rodar localmente

O service worker e a instalação PWA não funcionam abrindo `index.html` como `file://`.
Sirva a pasta por HTTP:

```bash
cd /Users/anselmo/Documents/deepseek-harness/default-workspace
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

No Chrome/Edge, use o botão de instalar na barra de endereço ou o botão **Instalar** no jogo.
No iPhone/iPad, use **Compartilhar > Adicionar à Tela de Início** no Safari.

## Publicar

Envie a pasta inteira para qualquer hospedagem estática com HTTPS, por exemplo GitHub Pages,
Netlify, Vercel ou Cloudflare Pages. O `start_url` e o `scope` são relativos, então funciona
tanto na raiz quanto em uma subpasta.

## Atualizar o jogo

Depois de alterar `index.html`, os ícones ou o manifest, incremente `CACHE_VERSION` em `sw.js`
para que os usuários recebam a nova versão em cache.
