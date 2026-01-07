# 📢 V.I.S.I.O.N. - Content & Communication

> **Virtual Intelligence System for Integrated Output Network**  
> Niveau : 3 | Status : ONLINE | Priorité : MOYENNE

## 📋 Mission

VISION est le **créateur de contenu automatisé** de GL Digital Lab. Il génère des posts Discord, newsletters, documentation technique et maintient la voix de la marque.

### Responsabilités

- 📝 **Posts Discord** : Annonces, tips techniques, updates
- 📧 **Newsletters** : Digest hebdomadaire automatisé
- 📚 **Documentation** : Génération de docs techniques
- 🎨 **Templates** : Messages formatés cohérents
- 📊 **Analytics** : Suivi des performances contenu

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| LLM | **Ollama + Mistral** | Génération de texte |
| Templates | **Handlebars** | Formatage des messages |
| Scheduler | **n8n** | Planification des posts |
| Storage | **PostgreSQL** | Historique contenu |
| Discord | **Webhooks** | Publication |

---

## 📦 Installation

### 1. Structure des dossiers

```bash
mkdir -p ~/gl-tower/vision/{templates,content,generated}
cd ~/gl-tower/vision
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  vision-api:
    build: .
    container_name: vision-api
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - OLLAMA_HOST=http://host.docker.internal:11434
      - DATABASE_URL=postgresql://vision:password@vision-db:5432/vision
    volumes:
      - ./templates:/app/templates
      - ./generated:/app/generated
    networks:
      - gl-tower
    depends_on:
      - vision-db

  vision-db:
    image: postgres:16-alpine
    container_name: vision-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: vision
      POSTGRES_USER: vision
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - gl-tower

networks:
  gl-tower:
    external: true
```

### 3. API de génération

```javascript
// src/index.js
import express from 'express';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const TEMPLATES_DIR = './templates';

// ============================================
// HELPERS
// ============================================
async function generateWithOllama(prompt, model = 'mistral') {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    })
  });
  
  const data = await response.json();
  return data.response;
}

async function loadTemplate(name) {
  const templatePath = path.join(TEMPLATES_DIR, `${name}.hbs`);
  const content = await fs.readFile(templatePath, 'utf-8');
  return Handlebars.compile(content);
}

// ============================================
// ENDPOINTS
// ============================================

// POST /generate/discord-post
app.post('/generate/discord-post', async (req, res) => {
  try {
    const { topic, type, tone = 'professional' } = req.body;
    
    const prompt = `Tu es VISION, le content manager de GL Digital Lab, une agence de développement web spécialisée Symfony et Vue.js.

Génère un post Discord de type "${type}" sur le sujet "${topic}".

Règles:
- Ton: ${tone}
- Utilise des emojis pertinents
- Max 280 caractères pour les tips, 500 pour les annonces
- Termine par un call-to-action si pertinent
- Style: technique mais accessible

Post:`;

    const content = await generateWithOllama(prompt);
    
    // Appliquer le template Discord
    const template = await loadTemplate('discord-post');
    const formatted = template({ content, type, timestamp: new Date().toISOString() });
    
    res.json({ 
      success: true, 
      content: formatted,
      raw: content 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /generate/newsletter
app.post('/generate/newsletter', async (req, res) => {
  try {
    const { highlights, tips, events } = req.body;
    
    const prompt = `Tu es VISION. Génère une newsletter hebdomadaire pour GL Digital Lab.

Données:
- Highlights: ${JSON.stringify(highlights)}
- Tips: ${JSON.stringify(tips)}
- Events: ${JSON.stringify(events)}

Format Markdown. Sections: Intro accrocheuse, Highlights, Tip de la semaine, Événements à venir, CTA final.
Ton: professionnel mais chaleureux.`;

    const content = await generateWithOllama(prompt);
    
    res.json({ 
      success: true, 
      content,
      format: 'markdown'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /generate/documentation
app.post('/generate/documentation', async (req, res) => {
  try {
    const { code, language, context } = req.body;
    
    const prompt = `Tu es VISION. Génère une documentation technique pour ce code ${language}:

\`\`\`${language}
${code}
\`\`\`

Contexte: ${context}

Génère:
1. Description courte
2. Paramètres (si fonction)
3. Valeur de retour (si applicable)
4. Exemple d'utilisation
5. Notes importantes

Format: Markdown avec docblocks appropriés.`;

    const content = await generateWithOllama(prompt);
    
    res.json({ 
      success: true, 
      documentation: content 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /generate/social-batch
app.post('/generate/social-batch', async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;
    
    const prompt = `Tu es VISION. Génère ${count} posts Discord/Twitter variés sur "${topic}".

Chaque post doit être unique:
- Mix de formats: tips, questions, stats, annonces
- Emojis variés
- Longueurs différentes (50-200 caractères)

Réponds en JSON: [{ "content": "...", "type": "..." }, ...]`;

    const content = await generateWithOllama(prompt);
    
    // Parser le JSON
    const posts = JSON.parse(content);
    
    res.json({ 
      success: true, 
      posts,
      count: posts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('📢 VISION API running on port 3001');
});
```

### 4. Templates Handlebars

```handlebars
{{! templates/discord-post.hbs }}
{{#if (eq type "tip")}}
💡 **Tech Tip du jour**

{{content}}

---
_Partagé par VISION • GL Digital Lab_
{{/if}}

{{#if (eq type "announcement")}}
📢 **Annonce**

{{content}}

👉 Plus d'infos : https://gldigitallab.fr
{{/if}}

{{#if (eq type "update")}}
🔄 **Update**

{{content}}

_{{timestamp}}_
{{/if}}
```

```handlebars
{{! templates/newsletter.hbs }}
# 📬 Newsletter GL Digital Lab

Bonjour à tous !

{{intro}}

---

## 🌟 Highlights de la semaine

{{#each highlights}}
- {{this}}
{{/each}}

---

## 💡 Tip technique

{{tip}}

---

## 📅 Événements à venir

{{#each events}}
**{{this.title}}** - {{this.date}}
{{this.description}}

{{/each}}

---

À la semaine prochaine !

*L'équipe GL Digital Lab*
```

---

## 🔄 Workflows n8n

### Workflow 1 : Daily Tech Tip

```json
{
  "name": "VISION - Daily Tech Tip",
  "nodes": [
    {
      "name": "Cron - 10h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 10 * * 1-5"
      }
    },
    {
      "name": "Get Random Topic",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const topics = ['Symfony', 'Vue.js', 'Docker', 'PostgreSQL', 'n8n', 'TypeScript', 'Git', 'Linux', 'Performance', 'Sécurité'];\nconst topic = topics[Math.floor(Math.random() * topics.length)];\nreturn [{ json: { topic } }];"
      }
    },
    {
      "name": "Generate Tip",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://vision-api:3001/generate/discord-post",
        "method": "POST",
        "body": {
          "topic": "={{ $json.topic }}",
          "type": "tip",
          "tone": "friendly-technical"
        }
      }
    },
    {
      "name": "Post to Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.VISION_WEBHOOK }}",
        "content": "={{ $json.content }}"
      }
    },
    {
      "name": "Log to DB",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "INSERT INTO posts (type, content, posted_at) VALUES ('tip', $1, NOW())",
        "values": ["={{ $json.content }}"]
      }
    }
  ]
}
```

### Workflow 2 : Weekly Newsletter

```json
{
  "name": "VISION - Weekly Newsletter",
  "nodes": [
    {
      "name": "Cron - Vendredi 16h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 16 * * 5"
      }
    },
    {
      "name": "Get Week Highlights",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT title, description FROM highlights WHERE created_at > NOW() - INTERVAL '7 days'"
      }
    },
    {
      "name": "Get Week Events",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT title, date, description FROM events WHERE date BETWEEN NOW() AND NOW() + INTERVAL '14 days'"
      }
    },
    {
      "name": "Generate Newsletter",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://vision-api:3001/generate/newsletter",
        "method": "POST",
        "body": {
          "highlights": "={{ $node['Get Week Highlights'].json }}",
          "events": "={{ $node['Get Week Events'].json }}",
          "tips": ["Performance tip de la semaine"]
        }
      }
    },
    {
      "name": "Post to Announcements",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.NEWSLETTER_WEBHOOK }}",
        "content": "={{ $json.content }}"
      }
    }
  ]
}
```

### Workflow 3 : Documentation Generator

```json
{
  "name": "VISION - Doc Generator",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "vision/document",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Generate Docs",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://vision-api:3001/generate/documentation",
        "method": "POST",
        "body": {
          "code": "={{ $json.code }}",
          "language": "={{ $json.language }}",
          "context": "={{ $json.context }}"
        }
      }
    },
    {
      "name": "Save to File",
      "type": "n8n-nodes-base.writeFile",
      "parameters": {
        "fileName": "/generated/{{ $json.filename }}.md",
        "data": "={{ $json.documentation }}"
      }
    },
    {
      "name": "Notify",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.VISION_WEBHOOK }}",
        "content": "📚 Documentation générée : `{{ $json.filename }}.md`"
      }
    }
  ]
}
```

---

## 📋 Content Calendar

VISION suit ce calendrier de publication :

| Jour | Heure | Type | Channel |
|------|-------|------|---------|
| Lundi | 10h | Tech Tip | #dev-tips |
| Mardi | 14h | Project Update | #announcements |
| Mercredi | 10h | Tech Tip | #dev-tips |
| Jeudi | 14h | Community Spotlight | #general |
| Vendredi | 10h | Tech Tip | #dev-tips |
| Vendredi | 16h | Newsletter | #newsletter |

---

## 📊 Métriques

| Métrique | Description | Objectif |
|----------|-------------|----------|
| `vision_posts_total` | Posts générés | +20/semaine |
| `vision_engagement_rate` | Taux d'engagement | > 5% |
| `vision_generation_time_avg` | Temps de génération | < 10s |
| `vision_quality_score` | Score qualité (feedback) | > 4/5 |

---

## 🎨 Brand Voice Guidelines

VISION respecte ces guidelines :

```yaml
# brand-voice.yml
tone:
  primary: professional
  secondary: friendly
  avoid: [corporate-speak, jargon-heavy, condescending]

style:
  sentences: short-to-medium
  paragraphs: max-3-sentences
  emojis: 1-3-per-post
  
vocabulary:
  prefer: [souverain, local, sur-mesure, architecture]
  avoid: [cloud, SaaS, solution, synergy]
  
formatting:
  headers: sentence-case
  lists: bullet-preferred
  code: backticks-for-inline
```

---

*Dernière mise à jour : Janvier 2026*  
*Agent : VISION v1.0 | GL Tower - Niveau 3*
