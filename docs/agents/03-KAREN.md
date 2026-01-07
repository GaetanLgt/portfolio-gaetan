# 👥 K.A.R.E.N. - Community Management

> **Knowledge And Response Engine for Networks**  
> Niveau : 2 | Status : ONLINE | Priorité : HAUTE

## 📋 Mission

KAREN gère la **communauté Discord** de GL Digital Lab et ARKADIA FRANCE. Elle modère, accueille les nouveaux membres, gère les tickets et maintient une ambiance positive.

### Responsabilités

- 👋 **Onboarding** : Accueil automatique des nouveaux membres
- 🛡️ **Modération** : Détection de spam, contenu inapproprié
- 🎫 **Tickets** : Création et suivi des demandes
- 📊 **Analytics** : Statistiques d'engagement
- 🎮 **Events** : Annonces et rappels automatiques

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Bot | **Discord.js v14** | Interactions Discord |
| Runtime | **Node.js 20** | Exécution du bot |
| Queue | **BullMQ** | File de modération |
| Database | **PostgreSQL** | Données membres/tickets |
| Orchestration | **n8n** | Workflows complexes |

---

## 📦 Installation

### Prérequis

```bash
# Node.js 20+
node --version  # >= 20.0.0
npm --version

# Créer une application Discord
# https://discord.com/developers/applications
```

### 1. Créer l'application Discord

1. Aller sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créer une nouvelle application "KAREN"
3. Dans "Bot", créer un bot et copier le token
4. Activer les intents :
   - PRESENCE INTENT
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
5. Générer l'URL d'invitation avec les permissions :
   - Manage Channels
   - Manage Roles
   - Kick/Ban Members
   - Send Messages
   - Manage Messages
   - Read Message History
   - Add Reactions

### 2. Structure du projet

```bash
mkdir -p ~/gl-tower/karen/{src,config}
cd ~/gl-tower/karen
npm init -y
```

### 3. Dépendances

```bash
npm install discord.js@14 bullmq ioredis pg dotenv
npm install -D typescript @types/node tsx
```

### 4. Configuration

```bash
# .env
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-client-id
DISCORD_GUILD_ID=your-server-id

# Channels IDs
WELCOME_CHANNEL_ID=123456789
TICKETS_CHANNEL_ID=123456789
LOGS_CHANNEL_ID=123456789
ANNOUNCEMENTS_CHANNEL_ID=123456789

# Roles IDs
MEMBER_ROLE_ID=123456789
MODERATOR_ROLE_ID=123456789

# Database
DATABASE_URL=postgresql://karen:password@localhost:5432/karen

# Redis
REDIS_URL=redis://localhost:6379

# n8n Webhook
N8N_WEBHOOK_URL=http://localhost:5678/webhook/karen
```

### 5. Code du Bot

```typescript
// src/index.ts
import { Client, GatewayIntentBits, Events, EmbedBuilder } from 'discord.js';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import 'dotenv/config';

// Initialisation
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const redis = new IORedis(process.env.REDIS_URL!);
const moderationQueue = new Queue('moderation', { connection: redis });

// ============================================
// EVENT: Bot Ready
// ============================================
client.once(Events.ClientReady, (c) => {
  console.log(`🤖 KAREN is online as ${c.user.tag}`);
  
  // Status
  client.user?.setPresence({
    activities: [{ name: '👥 Community Manager', type: 3 }],
    status: 'online',
  });
});

// ============================================
// EVENT: New Member (Onboarding)
// ============================================
client.on(Events.GuildMemberAdd, async (member) => {
  const welcomeChannel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID!);
  
  if (welcomeChannel?.isTextBased()) {
    const embed = new EmbedBuilder()
      .setColor(0x10B981)
      .setTitle('👋 Bienvenue sur GL Digital Lab !')
      .setDescription(`Hey ${member.user.username} ! Je suis **KAREN**, ton assistante communauté.\n\n` +
        `📖 Lis les règles dans <#rules>\n` +
        `💬 Présente-toi dans <#presentations>\n` +
        `❓ Besoin d'aide ? Tape \`/ticket\``)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: 'KAREN • Community Manager' });
    
    await welcomeChannel.send({ embeds: [embed] });
  }
  
  // Ajouter le rôle membre
  const memberRole = member.guild.roles.cache.get(process.env.MEMBER_ROLE_ID!);
  if (memberRole) {
    await member.roles.add(memberRole);
  }
  
  // Log
  await logAction('MEMBER_JOIN', {
    userId: member.id,
    username: member.user.username,
    joinedAt: new Date().toISOString(),
  });
});

// ============================================
// EVENT: Message (Moderation)
// ============================================
const SPAM_PATTERNS = [
  /discord\.gg\/\w+/i,  // Invites
  /free\s*nitro/i,       // Scam nitro
  /@everyone|@here/i,    // Mass mentions
];

const WARN_WORDS = ['spam', 'pub', 'promo'];

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  
  const content = message.content.toLowerCase();
  
  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message.content)) {
      await moderationQueue.add('spam-detected', {
        messageId: message.id,
        userId: message.author.id,
        content: message.content,
        channelId: message.channelId,
      });
      
      await message.delete();
      await message.author.send(
        '⚠️ **KAREN** : Ton message a été supprimé car il contient du contenu non autorisé.'
      ).catch(() => {});
      
      await logAction('SPAM_DELETED', {
        userId: message.author.id,
        content: message.content,
      });
      
      return;
    }
  }
  
  // Check warn words
  if (WARN_WORDS.some(word => content.includes(word))) {
    await message.react('👀');
  }
});

// ============================================
// SLASH COMMANDS
// ============================================
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  // /ticket - Créer un ticket
  if (interaction.commandName === 'ticket') {
    const ticketChannel = await interaction.guild?.channels.create({
      name: `ticket-${interaction.user.username}`,
      parent: process.env.TICKETS_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['ViewChannel'],
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages'],
        },
        {
          id: process.env.MODERATOR_ROLE_ID!,
          allow: ['ViewChannel', 'SendMessages', 'ManageMessages'],
        },
      ],
    });
    
    const embed = new EmbedBuilder()
      .setColor(0x06B6D4)
      .setTitle('🎫 Nouveau Ticket')
      .setDescription(`Bonjour ${interaction.user.username} !\n\n` +
        `Décris ton problème ici, un membre de l'équipe te répondra rapidement.\n\n` +
        `Pour fermer ce ticket : \`/close\``)
      .setTimestamp();
    
    await ticketChannel?.send({ embeds: [embed] });
    await interaction.reply({ 
      content: `✅ Ticket créé : ${ticketChannel}`, 
      ephemeral: true 
    });
    
    // Notifier n8n
    await fetch(process.env.N8N_WEBHOOK_URL + '/ticket-created', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: ticketChannel?.id,
        userId: interaction.user.id,
        username: interaction.user.username,
      }),
    });
  }
  
  // /stats - Statistiques communauté
  if (interaction.commandName === 'stats') {
    const guild = interaction.guild!;
    const memberCount = guild.memberCount;
    const onlineCount = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;
    
    const embed = new EmbedBuilder()
      .setColor(0x10B981)
      .setTitle('📊 Statistiques Communauté')
      .addFields(
        { name: '👥 Membres', value: memberCount.toString(), inline: true },
        { name: '🟢 En ligne', value: onlineCount.toString(), inline: true },
        { name: '📅 Créé le', value: guild.createdAt.toLocaleDateString('fr-FR'), inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'KAREN • Community Analytics' });
    
    await interaction.reply({ embeds: [embed] });
  }
});

// ============================================
// HELPERS
// ============================================
async function logAction(action: string, data: Record<string, any>) {
  const logsChannel = client.channels.cache.get(process.env.LOGS_CHANNEL_ID!);
  
  if (logsChannel?.isTextBased()) {
    const embed = new EmbedBuilder()
      .setColor(action.includes('DELETE') ? 0xEF4444 : 0x10B981)
      .setTitle(`🔔 ${action}`)
      .setDescription('```json\n' + JSON.stringify(data, null, 2) + '\n```')
      .setTimestamp();
    
    await logsChannel.send({ embeds: [embed] });
  }
}

// ============================================
// MODERATION WORKER
// ============================================
const moderationWorker = new Worker('moderation', async (job) => {
  const { messageId, userId, content, channelId } = job.data;
  
  // Incrémenter le compteur de warnings
  const warnings = await redis.incr(`warnings:${userId}`);
  
  if (warnings >= 3) {
    // Mute ou kick après 3 warnings
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID!);
    const member = await guild?.members.fetch(userId);
    
    if (member) {
      await member.timeout(60 * 60 * 1000, 'Spam répété - KAREN Auto-Mod');
      await logAction('MEMBER_TIMEOUT', { userId, warnings });
    }
  }
}, { connection: redis });

// Start
client.login(process.env.DISCORD_TOKEN);
```

### 6. Enregistrer les Slash Commands

```typescript
// src/deploy-commands.ts
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const commands = [
  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Créer un ticket de support'),
  
  new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Afficher les statistiques de la communauté'),
  
  new SlashCommandBuilder()
    .setName('close')
    .setDescription('Fermer le ticket actuel'),
  
  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Raison').setRequired(true)),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  console.log('📝 Deploying slash commands...');
  
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID!,
      process.env.DISCORD_GUILD_ID!
    ),
    { body: commands.map(c => c.toJSON()) }
  );
  
  console.log('✅ Commands deployed!');
})();
```

### 7. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  karen-bot:
    build: .
    container_name: karen-bot
    restart: unless-stopped
    env_file: .env
    depends_on:
      - karen-db
      - karen-redis
    networks:
      - gl-tower

  karen-db:
    image: postgres:16-alpine
    container_name: karen-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: karen
      POSTGRES_USER: karen
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - gl-tower

  karen-redis:
    image: redis:7-alpine
    container_name: karen-redis
    restart: unless-stopped
    volumes:
      - ./data/redis:/data
    networks:
      - gl-tower

networks:
  gl-tower:
    external: true
```

### 8. Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["npx", "tsx", "src/index.ts"]
```

### 9. Lancement

```bash
# Déployer les commandes
npx tsx src/deploy-commands.ts

# Lancer le bot
docker compose up -d

# Ou en dev
npx tsx watch src/index.ts
```

---

## 🔄 Workflows n8n

### Workflow 1 : Weekly Community Report

```json
{
  "name": "KAREN - Weekly Report",
  "nodes": [
    {
      "name": "Cron - Lundi 9h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 9 * * 1"
      }
    },
    {
      "name": "Get Stats from DB",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT COUNT(*) as new_members FROM members WHERE joined_at > NOW() - INTERVAL '7 days'; SELECT COUNT(*) as tickets_closed FROM tickets WHERE closed_at > NOW() - INTERVAL '7 days';"
      }
    },
    {
      "name": "Format Report",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const stats = $input.first().json;\nreturn [{ json: { report: `📊 **Rapport Hebdo KAREN**\\n\\n👥 Nouveaux membres: ${stats.new_members}\\n🎫 Tickets fermés: ${stats.tickets_closed}` } }];"
      }
    },
    {
      "name": "Send to Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.KAREN_WEBHOOK }}",
        "content": "={{ $json.report }}"
      }
    }
  ]
}
```

### Workflow 2 : Event Reminder

```json
{
  "name": "KAREN - Event Reminder",
  "nodes": [
    {
      "name": "Cron - Every Hour",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 * * * *"
      }
    },
    {
      "name": "Get Upcoming Events",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT * FROM events WHERE starts_at BETWEEN NOW() AND NOW() + INTERVAL '1 hour' AND reminder_sent = false"
      }
    },
    {
      "name": "Send Reminders",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.ANNOUNCEMENTS_WEBHOOK }}",
        "content": "🔔 **Rappel Event** : {{ $json.title }} commence dans 1 heure !\n\n{{ $json.description }}"
      }
    },
    {
      "name": "Mark as Sent",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "UPDATE events SET reminder_sent = true WHERE id = {{ $json.id }}"
      }
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Description | Objectif |
|----------|-------------|----------|
| `karen_members_total` | Membres totaux | Croissance |
| `karen_messages_moderated` | Messages modérés | < 1% |
| `karen_tickets_created` | Tickets créés | Suivi |
| `karen_tickets_resolved_avg` | Temps résolution moyen | < 24h |
| `karen_engagement_rate` | Taux d'engagement | > 30% |

---

## 🚨 Troubleshooting

### Bot ne répond pas

```bash
# Vérifier le token
echo $DISCORD_TOKEN | head -c 20

# Vérifier les intents dans le Developer Portal
# PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGE CONTENT INTENT

# Logs
docker logs karen-bot --tail 100
```

### Commandes non visibles

```bash
# Re-déployer les commandes
npx tsx src/deploy-commands.ts

# Vérifier les permissions du bot
# L'URL d'invitation doit inclure applications.commands
```

---

*Dernière mise à jour : Janvier 2026*  
*Agent : KAREN v1.0 | GL Tower - Niveau 2*
