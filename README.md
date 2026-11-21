# Valorant Skin List Generator

Site estático para marcar as skins de armas do **VALORANT** que você **tem** e que **quer**, ver estatísticas da coleção e gerar uma imagem da sua lista para compartilhar.

Os dados vêm da [valorant-api.com](https://valorant-api.com) e são atualizados automaticamente todos os dias por um GitHub Action. Não precisa de servidor nem de banco de dados.

> Projeto de fãs, não endossado pela Riot Games. VALORANT e Riot Games são marcas da Riot Games, Inc.

---

## Funcionalidades

- Todas as skins de armas, organizadas por arma, com progresso da coleção
- Marcação **Tenho** e **Quero**, com o total estimado em VP de cada lista
- Busca global por skin, arma ou coleção
- Filtros por raridade, coleção e preço máximo; ordenação por preço
- Estatísticas: coleções e armas mais completas, VP que falta para a lista "Quero"
- Link de compartilhamento (a lista vai na URL, sem conta)
- Exportação em **PNG** e **PDF**, com tema claro ou escuro, tamanhos e agrupamento por arma
- Idiomas: Português, English e Español
- A seleção fica salva no navegador (`localStorage`)

---

## Estrutura

```
.
├── index.html                  # página (HTML + JavaScript)
├── style.css                   # estilos e animações
├── build.mjs                   # gera os arquivos skins.<idioma>.json
├── overrides.json              # correções manuais de preço e nome
├── skins.pt.json               # gerado
├── skins.en.json               # gerado
├── skins.es.json               # gerado
└── .github/workflows/update.yml  # atualização diária automática
```

Os arquivos `skins.*.json` **não existem até você rodar o build uma vez** (veja abaixo). Sem eles, a página mostra um aviso.

---

## Como publicar no GitHub Pages

> O GitHub Pages é gratuito para repositórios **públicos**. Em repositórios privados ele exige um plano pago.

1. **Crie um repositório público** no GitHub e envie todos os arquivos desta pasta, incluindo `.github/workflows/update.yml`.
2. Vá em **Settings → Actions → General → Workflow permissions** e selecione **Read and write permissions**. O workflow precisa disso para salvar os arquivos gerados.
3. Vá na aba **Actions**, abra **Atualizar skins** e clique em **Run workflow**. Ao terminar, os arquivos `skins.pt.json`, `skins.en.json` e `skins.es.json` aparecem no repositório.
4. Vá em **Settings → Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)` e salve.
5. Aguarde alguns minutos. O site fica em:

   ```
   https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
   ```

Se este projeto estiver dentro de uma pasta de um repositório maior (por exemplo, junto com outro site), o endereço inclui o nome da pasta: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/valorant-skins/`.

### Atualização automática

O workflow roda todo dia às 06:00 UTC, baixa os dados mais recentes e salva os `skins.*.json` com um commit. Você também pode rodá-lo na hora, pela aba **Actions**.

Se o site não refletir um commit feito pelo workflow, abra a aba **Actions** e confira se a publicação do Pages rodou. Caso não tenha rodado, dispare-a manualmente ou rode o workflow de novo.

---

## Como rodar localmente

Requer **Node.js 18 ou superior**.

```bash
# 1. gerar os dados
node build.mjs

# 2. servir a pasta (o navegador não carrega os JSON abrindo o arquivo direto)
npx serve .
# ou: python3 -m http.server 8000
```

Abra o endereço mostrado no terminal. Se o `build.mjs` terminar com mensagens como `OK pt: 19 armas, ... skins`, deu certo.

---

## Corrigindo preços e nomes (`overrides.json`)

A API **não informa o preço de cada skin**. O `build.mjs` usa o preço padrão da raridade, e o site marca esses valores com `~` por serem estimativas:

| Raridade | VP (estimado) |
|---|---|
| Select | 875 |
| Deluxe | 1.275 |
| Premium | 1.775 |
| Exclusive | 2.175 |
| Ultra | 2.475 |

Esses valores podem variar em pacotes e na loja. **Facas (Melee) ficam sem preço**, porque variam muito.

Para corrigir uma skin, adicione uma entrada em `overrides.json`, usando o `uuid` dela (ou o id numérico) como chave:

```json
{
  "uuid-da-skin-aqui": { "cost": 3550, "name": "Nome opcional" }
}
```

O uuid de cada skin está nos dados da [valorant-api.com](https://valorant-api.com/v1/weapons). Depois de editar, rode o workflow de novo (ou `node build.mjs`).

---

## Adicionando um idioma

1. Em `build.mjs`, acrescente uma linha em `LANGS`, usando um código que a API aceite:
   ```js
   const LANGS = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR' };
   ```
2. Em `index.html`, adicione a opção no seletor `#lg`:
   ```html
   <option value="fr">Français</option>
   ```
3. No objeto `M` do `index.html`, crie o bloco `fr` com as traduções da interface. Copie o bloco `en` e traduza.
4. Rode o build. Os nomes de armas, skins e coleções já vêm traduzidos pela API.

---

## Limitações

- Só skins de armas. Cartões de jogador, sprays e títulos não estão incluídos.
- Não há data de lançamento nos dados, então não existe filtro "mais recentes".
- A exportação de imagem depende de o navegador poder usar as imagens da API (CORS). Se for bloqueada, a página avisa.
- Os preços são estimativas pela raridade (veja acima).

---

## Créditos

- Dados e imagens: [valorant-api.com](https://valorant-api.com), projeto da comunidade
- Fontes: [Barlow e Barlow Condensed](https://fonts.google.com/), via Google Fonts
