<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="teacher-assistant">
      <!-- HEADER -->
      <header class="app-header">
        <div class="header-left">
          <router-link to="/apps" class="back-btn">
            <n-button quaternary size="small">← Apps</n-button>
          </router-link>
          <div class="app-title">
            <span class="app-icon">🎓</span>
            <div>
              <h1>Prof Assistant IA</h1>
              <span class="app-subtitle">Chatbot pédagogique & gestion de classe</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <n-badge :value="pendingCorrections" :max="99">
            <n-button quaternary @click="activeTab = 'corrections'">📝 Corrections</n-button>
          </n-badge>
          <n-badge :value="unreadMessages" :max="99" type="info">
            <n-button quaternary @click="activeTab = 'messages'">💬 Messages</n-button>
          </n-badge>
          <n-button type="primary" @click="openChatbot">
            🤖 Assistant IA
          </n-button>
        </div>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="main-layout" :class="{ 'chatbot-open': showChatbot }">
        <!-- LEFT: TABS CONTENT -->
        <div class="content-area">
          <!-- DASHBOARD STATS -->
          <section class="dashboard-stats" v-if="activeTab === 'dashboard'">
            <n-grid :cols="5" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
              <n-gi span="5 s:5 m:1">
                <n-card class="stat-card">
                  <n-statistic label="Élèves" :value="totalStudents">
                    <template #prefix><span>👥</span></template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi span="5 s:5 m:1">
                <n-card class="stat-card">
                  <n-statistic label="Cours cette semaine" :value="weekCourses">
                    <template #prefix><span>📚</span></template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi span="5 s:5 m:1">
                <n-card class="stat-card">
                  <n-statistic label="Copies à corriger" :value="pendingCorrections">
                    <template #prefix><span>📝</span></template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi span="5 s:5 m:1">
                <n-card class="stat-card">
                  <n-statistic label="Moyenne générale" :value="classAverage" suffix="/20">
                    <template #prefix><span>📊</span></template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi span="5 s:5 m:1">
                <n-card class="stat-card">
                  <n-statistic label="Quiz générés" :value="quizGenerated">
                    <template #prefix><span>🎯</span></template>
                  </n-statistic>
                </n-card>
              </n-gi>
            </n-grid>
          </section>

          <!-- TABS -->
          <n-tabs v-model:value="activeTab" type="line" animated class="main-tabs">
            <!-- DASHBOARD -->
            <n-tab-pane name="dashboard" tab="📊 Dashboard">
              <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
                <!-- Today's Schedule -->
                <n-gi span="2 l:1">
                  <n-card title="📅 Emploi du temps du jour">
                    <n-timeline>
                      <n-timeline-item v-for="course in todaySchedule" :key="course.id" :type="course.status" :time="course.time">
                        <template #header>
                          <n-space align="center" :size="8">
                            <n-text strong>{{ course.subject }}</n-text>
                            <n-tag size="small">{{ course.class }}</n-tag>
                          </n-space>
                        </template>
                        {{ course.room }} • {{ course.topic }}
                      </n-timeline-item>
                    </n-timeline>
                  </n-card>
                </n-gi>

                <!-- Recent Activity -->
                <n-gi span="2 l:1">
                  <n-card title="🔔 Activité récente">
                    <n-list>
                      <n-list-item v-for="activity in recentActivity" :key="activity.id">
                        <template #prefix>
                          <n-avatar round size="small" :style="{ background: activity.color }">
                            {{ activity.icon }}
                          </n-avatar>
                        </template>
                        <n-thing :title="activity.title" :description="activity.time">
                          {{ activity.description }}
                        </n-thing>
                      </n-list-item>
                    </n-list>
                  </n-card>
                </n-gi>

                <!-- Quick Actions -->
                <n-gi span="2 l:1">
                  <n-card title="⚡ Actions rapides">
                    <n-grid :cols="2" :x-gap="12" :y-gap="12">
                      <n-gi>
                        <n-button block secondary @click="showQuizGenerator = true">
                          🎯 Générer un Quiz
                        </n-button>
                      </n-gi>
                      <n-gi>
                        <n-button block secondary @click="showExerciseGenerator = true">
                          📝 Créer des Exercices
                        </n-button>
                      </n-gi>
                      <n-gi>
                        <n-button block secondary @click="showCourseGenerator = true">
                          📚 Plan de Cours IA
                        </n-button>
                      </n-gi>
                      <n-gi>
                        <n-button block secondary @click="activeTab = 'corrections'">
                          ✅ Corriger des Copies
                        </n-button>
                      </n-gi>
                    </n-grid>
                  </n-card>
                </n-gi>

                <!-- Class Performance -->
                <n-gi span="2 l:1">
                  <n-card title="📈 Performance par classe">
                    <n-space vertical :size="12">
                      <div v-for="cls in classPerformance" :key="cls.name" class="class-perf">
                        <n-space justify="space-between" align="center">
                          <n-text>{{ cls.name }}</n-text>
                          <n-text :type="cls.average >= 12 ? 'success' : cls.average >= 10 ? 'warning' : 'error'">
                            {{ cls.average }}/20
                          </n-text>
                        </n-space>
                        <n-progress 
                          :percentage="(cls.average / 20) * 100" 
                          :status="cls.average >= 12 ? 'success' : cls.average >= 10 ? 'warning' : 'error'"
                          :show-indicator="false"
                        />
                      </div>
                    </n-space>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-tab-pane>

            <!-- STUDENTS -->
            <n-tab-pane name="students" tab="👥 Élèves">
              <n-card>
                <template #header>
                  <n-space justify="space-between" align="center">
                    <n-h3 style="margin: 0">Gestion des élèves</n-h3>
                    <n-space :size="12">
                      <n-select v-model:value="selectedClass" :options="classOptions" placeholder="Classe" style="width: 150px" />
                      <n-input v-model:value="studentSearch" placeholder="Rechercher..." style="width: 200px">
                        <template #prefix>🔍</template>
                      </n-input>
                      <n-button type="primary" @click="showAddStudent = true">+ Ajouter</n-button>
                    </n-space>
                  </n-space>
                </template>

                <n-data-table 
                  :columns="studentColumns" 
                  :data="filteredStudents" 
                  :pagination="{ pageSize: 10 }"
                  :row-key="row => row.id"
                />
              </n-card>
            </n-tab-pane>

            <!-- COURSES -->
            <n-tab-pane name="courses" tab="📚 Cours">
              <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
                <n-gi v-for="course in courses" :key="course.id" span="3 m:3 l:1">
                  <n-card hoverable class="course-card">
                    <template #header>
                      <n-space align="center" :size="12">
                        <span style="font-size: 2rem">{{ course.icon }}</span>
                        <div>
                          <n-h3 style="margin: 0">{{ course.title }}</n-h3>
                          <n-text depth="3">{{ course.class }}</n-text>
                        </div>
                      </n-space>
                    </template>

                    <n-space vertical :size="12">
                      <n-text depth="3">{{ course.description }}</n-text>
                      
                      <n-space :size="8">
                        <n-tag size="small">📅 {{ course.schedule }}</n-tag>
                        <n-tag size="small">👥 {{ course.students }} élèves</n-tag>
                      </n-space>

                      <n-progress :percentage="course.progress" :show-indicator="true">
                        <template #default>{{ course.progress }}% complété</template>
                      </n-progress>
                    </n-space>

                    <template #action>
                      <n-space :size="8">
                        <n-button size="small" @click="viewCourse(course)">📖 Voir</n-button>
                        <n-button size="small" secondary @click="generateContent(course)">🤖 Générer contenu</n-button>
                      </n-space>
                    </template>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-tab-pane>

            <!-- CORRECTIONS -->
            <n-tab-pane name="corrections" tab="📝 Corrections">
              <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
                <n-gi span="2 l:1">
                  <n-card title="📋 Copies à corriger">
                    <template #header-extra>
                      <n-tag type="warning">{{ pendingCorrections }} en attente</n-tag>
                    </template>
                    <n-list hoverable clickable>
                      <n-list-item v-for="copy in pendingCopies" :key="copy.id" @click="openCorrection(copy)">
                        <template #prefix>
                          <n-avatar round>{{ copy.studentInitials }}</n-avatar>
                        </template>
                        <n-thing :title="copy.studentName" :description="copy.subject">
                          <template #header-extra>
                            <n-tag :type="copy.priority === 'urgent' ? 'error' : 'default'" size="small">
                              {{ copy.priority === 'urgent' ? '🔴 Urgent' : '📅 ' + copy.dueDate }}
                            </n-tag>
                          </template>
                        </n-thing>
                      </n-list-item>
                    </n-list>
                  </n-card>
                </n-gi>

                <n-gi span="2 l:1">
                  <n-card title="🤖 Aide à la correction IA">
                    <n-space vertical :size="16">
                      <n-alert type="info" title="Assistant de correction">
                        L'IA peut vous aider à : analyser les réponses, suggérer des notes, détecter le plagiat, et générer des commentaires personnalisés.
                      </n-alert>

                      <n-upload
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        :max="5"
                        multiple
                        @change="handleCopyUpload"
                      >
                        <n-upload-dragger>
                          <div style="padding: 2rem">
                            <n-icon size="48" :depth="3">📄</n-icon>
                            <n-text style="display: block; margin-top: 12px">
                              Déposez les copies ici ou cliquez pour sélectionner
                            </n-text>
                            <n-text depth="3" style="font-size: 0.85rem">
                              PDF, Word, Images (max 5 fichiers)
                            </n-text>
                          </div>
                        </n-upload-dragger>
                      </n-upload>

                      <n-space :size="12">
                        <n-button type="primary" @click="analyzeWithAI">
                          🤖 Analyser avec l'IA
                        </n-button>
                        <n-button secondary @click="detectPlagiarism">
                          🔍 Détecter plagiat
                        </n-button>
                      </n-space>
                    </n-space>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-tab-pane>

            <!-- QUIZ GENERATOR -->
            <n-tab-pane name="quiz" tab="🎯 Quiz">
              <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
                <n-gi span="2 l:1">
                  <n-card title="🎯 Générateur de Quiz IA">
                    <n-form :model="quizForm" label-placement="left" label-width="140px">
                      <n-form-item label="Matière">
                        <n-select v-model:value="quizForm.subject" :options="subjectOptions" />
                      </n-form-item>
                      <n-form-item label="Thème / Chapitre">
                        <n-input v-model:value="quizForm.topic" placeholder="Ex: La Révolution française" />
                      </n-form-item>
                      <n-form-item label="Niveau">
                        <n-select v-model:value="quizForm.level" :options="levelOptions" />
                      </n-form-item>
                      <n-form-item label="Nombre de questions">
                        <n-slider v-model:value="quizForm.questionCount" :min="5" :max="30" :step="5" :marks="{ 5: '5', 15: '15', 30: '30' }" />
                      </n-form-item>
                      <n-form-item label="Types de questions">
                        <n-checkbox-group v-model:value="quizForm.questionTypes">
                          <n-space>
                            <n-checkbox value="qcm">QCM</n-checkbox>
                            <n-checkbox value="vf">Vrai/Faux</n-checkbox>
                            <n-checkbox value="open">Questions ouvertes</n-checkbox>
                            <n-checkbox value="fill">Texte à trous</n-checkbox>
                          </n-space>
                        </n-checkbox-group>
                      </n-form-item>
                      <n-form-item label="Difficulté">
                        <n-rate v-model:value="quizForm.difficulty" :count="5" />
                      </n-form-item>
                      <n-form-item>
                        <n-button type="primary" @click="generateQuiz" :loading="generatingQuiz">
                          🤖 Générer le Quiz
                        </n-button>
                      </n-form-item>
                    </n-form>
                  </n-card>
                </n-gi>

                <n-gi span="2 l:1">
                  <n-card title="📋 Quiz générés récemment">
                    <n-list hoverable clickable>
                      <n-list-item v-for="quiz in recentQuizzes" :key="quiz.id" @click="viewQuiz(quiz)">
                        <n-thing :title="quiz.title" :description="quiz.subject + ' • ' + quiz.level">
                          <template #header-extra>
                            <n-space :size="8">
                              <n-tag size="small">{{ quiz.questionCount }} Q</n-tag>
                              <n-tag size="small" type="success">{{ quiz.usedCount }}x utilisé</n-tag>
                            </n-space>
                          </template>
                        </n-thing>
                      </n-list-item>
                    </n-list>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-tab-pane>

            <!-- RESOURCES -->
            <n-tab-pane name="resources" tab="📂 Ressources">
              <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
                <n-gi span="3 l:1">
                  <n-card title="📚 Cours & Supports">
                    <n-list>
                      <n-list-item v-for="res in courseResources" :key="res.id">
                        <template #prefix>
                          <n-icon size="24">{{ res.icon }}</n-icon>
                        </template>
                        <n-thing :title="res.name" :description="res.type + ' • ' + res.size" />
                        <template #suffix>
                          <n-button size="tiny" quaternary>📥</n-button>
                        </template>
                      </n-list-item>
                    </n-list>
                    <template #action>
                      <n-button block secondary>+ Ajouter une ressource</n-button>
                    </template>
                  </n-card>
                </n-gi>

                <n-gi span="3 l:1">
                  <n-card title="🎯 Exercices">
                    <n-list>
                      <n-list-item v-for="ex in exercises" :key="ex.id">
                        <n-thing :title="ex.title" :description="ex.subject + ' • ' + ex.difficulty" />
                        <template #suffix>
                          <n-space :size="4">
                            <n-button size="tiny" quaternary>👁️</n-button>
                            <n-button size="tiny" quaternary>📤</n-button>
                          </n-space>
                        </template>
                      </n-list-item>
                    </n-list>
                    <template #action>
                      <n-button block type="primary" @click="showExerciseGenerator = true">
                        🤖 Générer avec l'IA
                      </n-button>
                    </template>
                  </n-card>
                </n-gi>

                <n-gi span="3 l:1">
                  <n-card title="📊 Évaluations">
                    <n-list>
                      <n-list-item v-for="evaluation in evaluations" :key="evaluation.id">
                        <n-thing :title="evaluation.title" :description="evaluation.date + ' • ' + evaluation.class" />
                        <template #suffix>
                          <n-tag :type="evaluation.status === 'done' ? 'success' : 'warning'" size="small">
                            {{ evaluation.status === 'done' ? '✅ Corrigé' : '⏳ En cours' }}
                          </n-tag>
                        </template>
                      </n-list-item>
                    </n-list>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-tab-pane>

            <!-- MESSAGES -->
            <n-tab-pane name="messages" tab="💬 Messages">
              <n-card>
                <template #header>
                  <n-space justify="space-between" align="center">
                    <n-h3 style="margin: 0">Messagerie</n-h3>
                    <n-button type="primary" @click="showNewMessage = true">+ Nouveau message</n-button>
                  </n-space>
                </template>

                <n-list hoverable clickable>
                  <n-list-item v-for="msg in messages" :key="msg.id" @click="openMessage(msg)">
                    <template #prefix>
                      <n-badge :dot="!msg.read" type="info">
                        <n-avatar round>{{ msg.senderInitials }}</n-avatar>
                      </n-badge>
                    </template>
                    <n-thing :title="msg.sender" :description="msg.preview">
                      <template #header-extra>
                        <n-text depth="3" style="font-size: 0.8rem">{{ msg.time }}</n-text>
                      </template>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-card>
            </n-tab-pane>
          </n-tabs>
        </div>

        <!-- RIGHT: CHATBOT PANEL -->
        <div class="chatbot-panel" v-if="showChatbot">
          <div class="chatbot-header">
            <n-space align="center" :size="12">
              <n-avatar round :style="{ background: '#8B5CF6' }">🤖</n-avatar>
              <div>
                <n-text strong>Prof Assistant IA</n-text>
                <n-text depth="3" style="display: block; font-size: 0.8rem">En ligne • Prêt à aider</n-text>
              </div>
            </n-space>
            <n-button quaternary circle @click="showChatbot = false">✕</n-button>
          </div>

          <div class="chatbot-messages" ref="chatMessagesRef">
            <div v-for="(msg, i) in chatMessages" :key="i" class="chat-message" :class="msg.role">
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(msg.content)"></div>
                <div class="message-time">{{ msg.time }}</div>
              </div>
            </div>
            <div v-if="isTyping" class="chat-message assistant">
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="chatbot-suggestions" v-if="chatMessages.length <= 1">
            <n-text depth="3" style="font-size: 0.8rem; margin-bottom: 8px; display: block">Suggestions :</n-text>
            <n-space :size="8" wrap>
              <n-tag v-for="sug in chatSuggestions" :key="sug" size="small" round clickable @click="sendSuggestion(sug)">
                {{ sug }}
              </n-tag>
            </n-space>
          </div>

          <div class="chatbot-input">
            <n-input
              v-model:value="chatInput"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
              placeholder="Posez votre question..."
              @keydown.enter.exact.prevent="sendMessage"
            />
            <n-button type="primary" circle @click="sendMessage" :disabled="!chatInput.trim()">
              ➤
            </n-button>
          </div>
        </div>
      </div>

      <!-- FLOATING CHATBOT BUTTON -->
      <n-button 
        v-if="!showChatbot"
        class="chatbot-fab"
        type="primary"
        circle
        size="large"
        @click="showChatbot = true"
      >
        🤖
      </n-button>

      <!-- QUIZ GENERATOR MODAL -->
      <n-modal v-model:show="showQuizGenerator" preset="card" title="🎯 Générateur de Quiz IA" style="width: 600px; max-width: 95vw">
        <n-form :model="quizForm" label-placement="top">
          <n-grid :cols="2" :x-gap="16">
            <n-gi>
              <n-form-item label="Matière">
                <n-select v-model:value="quizForm.subject" :options="subjectOptions" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Niveau">
                <n-select v-model:value="quizForm.level" :options="levelOptions" />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-form-item label="Thème / Chapitre">
            <n-input v-model:value="quizForm.topic" placeholder="Ex: Les fractions, La Révolution française..." />
          </n-form-item>
          <n-form-item label="Nombre de questions">
            <n-slider v-model:value="quizForm.questionCount" :min="5" :max="30" :step="5" />
          </n-form-item>
          <n-form-item label="Types de questions">
            <n-checkbox-group v-model:value="quizForm.questionTypes">
              <n-space>
                <n-checkbox value="qcm">QCM</n-checkbox>
                <n-checkbox value="vf">Vrai/Faux</n-checkbox>
                <n-checkbox value="open">Ouvertes</n-checkbox>
              </n-space>
            </n-checkbox-group>
          </n-form-item>
        </n-form>
        <template #action>
          <n-space justify="end">
            <n-button @click="showQuizGenerator = false">Annuler</n-button>
            <n-button type="primary" @click="generateQuiz" :loading="generatingQuiz">🤖 Générer</n-button>
          </n-space>
        </template>
      </n-modal>

      <!-- EXERCISE GENERATOR MODAL -->
      <n-modal v-model:show="showExerciseGenerator" preset="card" title="📝 Générateur d'Exercices IA" style="width: 600px; max-width: 95vw">
        <n-form label-placement="top">
          <n-form-item label="Matière">
            <n-select v-model:value="exerciseForm.subject" :options="subjectOptions" />
          </n-form-item>
          <n-form-item label="Compétence visée">
            <n-input v-model:value="exerciseForm.skill" placeholder="Ex: Résoudre des équations du premier degré" />
          </n-form-item>
          <n-form-item label="Contexte / Consigne">
            <n-input v-model:value="exerciseForm.context" type="textarea" :rows="3" placeholder="Décrivez le type d'exercice souhaité..." />
          </n-form-item>
          <n-form-item label="Difficulté">
            <n-rate v-model:value="exerciseForm.difficulty" :count="5" />
          </n-form-item>
          <n-form-item label="Inclure">
            <n-checkbox-group v-model:value="exerciseForm.includes">
              <n-space>
                <n-checkbox value="solution">Corrigé</n-checkbox>
                <n-checkbox value="hints">Indices</n-checkbox>
                <n-checkbox value="variations">Variations</n-checkbox>
              </n-space>
            </n-checkbox-group>
          </n-form-item>
        </n-form>
        <template #action>
          <n-space justify="end">
            <n-button @click="showExerciseGenerator = false">Annuler</n-button>
            <n-button type="primary" @click="generateExercise">🤖 Générer</n-button>
          </n-space>
        </template>
      </n-modal>

      <!-- COURSE PLAN GENERATOR MODAL -->
      <n-modal v-model:show="showCourseGenerator" preset="card" title="📚 Générateur de Plan de Cours IA" style="width: 600px; max-width: 95vw">
        <n-form label-placement="top">
          <n-grid :cols="2" :x-gap="16">
            <n-gi>
              <n-form-item label="Matière">
                <n-select v-model:value="courseForm.subject" :options="subjectOptions" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Durée du cours">
                <n-select v-model:value="courseForm.duration" :options="durationOptions" />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-form-item label="Thème principal">
            <n-input v-model:value="courseForm.topic" placeholder="Ex: Introduction aux probabilités" />
          </n-form-item>
          <n-form-item label="Objectifs pédagogiques">
            <n-input v-model:value="courseForm.objectives" type="textarea" :rows="2" placeholder="Qu'est-ce que les élèves doivent apprendre ?" />
          </n-form-item>
          <n-form-item label="Niveau de la classe">
            <n-select v-model:value="courseForm.level" :options="levelOptions" />
          </n-form-item>
          <n-form-item label="Inclure">
            <n-checkbox-group v-model:value="courseForm.includes">
              <n-space>
                <n-checkbox value="intro">Introduction engageante</n-checkbox>
                <n-checkbox value="activities">Activités pratiques</n-checkbox>
                <n-checkbox value="assessment">Évaluation</n-checkbox>
                <n-checkbox value="homework">Devoirs</n-checkbox>
              </n-space>
            </n-checkbox-group>
          </n-form-item>
        </n-form>
        <template #action>
          <n-space justify="end">
            <n-button @click="showCourseGenerator = false">Annuler</n-button>
            <n-button type="primary" @click="generateCoursePlan">🤖 Générer le plan</n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, nextTick, h } from 'vue';
import { darkTheme, NButton, NTag, NProgress } from 'naive-ui';
import { glThemeOverrides } from '@/config/naiveTheme.js';

const themeOverrides = glThemeOverrides;
const activeTab = ref('dashboard');
const chatMessagesRef = ref(null);

// Modals
const showChatbot = ref(false);
const showQuizGenerator = ref(false);
const showExerciseGenerator = ref(false);
const showCourseGenerator = ref(false);
const showAddStudent = ref(false);
const showNewMessage = ref(false);

// Search & Filters
const selectedClass = ref(null);
const studentSearch = ref('');

// Stats
const totalStudents = ref(127);
const weekCourses = ref(18);
const pendingCorrections = ref(23);
const classAverage = ref(13.4);
const quizGenerated = ref(45);
const unreadMessages = ref(5);

// Chat
const chatInput = ref('');
const isTyping = ref(false);
const generatingQuiz = ref(false);

const chatMessages = ref([
  { role: 'assistant', content: 'Bonjour ! 👋 Je suis votre assistant pédagogique IA. Je peux vous aider à :\n\n• 🎯 Générer des quiz et exercices\n• 📝 Corriger des copies\n• 📚 Préparer des plans de cours\n• 💡 Expliquer des concepts aux élèves\n• 📊 Analyser les performances\n\nComment puis-je vous aider ?', time: '10:00' }
]);

const chatSuggestions = [
  '🎯 Générer un quiz',
  '📝 Aide correction',
  '📚 Plan de cours',
  '💡 Expliquer un concept',
  '📊 Analyser résultats'
];

// Forms
const quizForm = ref({
  subject: 'math',
  topic: '',
  level: '3eme',
  questionCount: 10,
  questionTypes: ['qcm', 'vf'],
  difficulty: 3
});

const exerciseForm = ref({
  subject: 'math',
  skill: '',
  context: '',
  difficulty: 3,
  includes: ['solution']
});

const courseForm = ref({
  subject: 'math',
  topic: '',
  duration: '1h',
  objectives: '',
  level: '3eme',
  includes: ['intro', 'activities']
});

// Options
const subjectOptions = [
  { label: '📐 Mathématiques', value: 'math' },
  { label: '🇫🇷 Français', value: 'french' },
  { label: '🔬 Sciences', value: 'science' },
  { label: '🌍 Histoire-Géo', value: 'history' },
  { label: '🇬🇧 Anglais', value: 'english' },
  { label: '💻 Informatique', value: 'computer' },
];

const levelOptions = [
  { label: '6ème', value: '6eme' },
  { label: '5ème', value: '5eme' },
  { label: '4ème', value: '4eme' },
  { label: '3ème', value: '3eme' },
  { label: '2nde', value: '2nde' },
  { label: '1ère', value: '1ere' },
  { label: 'Terminale', value: 'term' },
];

const durationOptions = [
  { label: '30 min', value: '30min' },
  { label: '1 heure', value: '1h' },
  { label: '1h30', value: '1h30' },
  { label: '2 heures', value: '2h' },
];

const classOptions = [
  { label: 'Toutes', value: null },
  { label: '3ème A', value: '3A' },
  { label: '3ème B', value: '3B' },
  { label: '4ème A', value: '4A' },
  { label: '4ème B', value: '4B' },
];

// Data
const todaySchedule = ref([
  { id: 1, time: '08:00 - 09:00', subject: 'Mathématiques', class: '3ème A', room: 'Salle 201', topic: 'Équations du 2nd degré', status: 'success' },
  { id: 2, time: '09:00 - 10:00', subject: 'Mathématiques', class: '4ème B', room: 'Salle 201', topic: 'Fractions', status: 'success' },
  { id: 3, time: '10:15 - 11:15', subject: 'Mathématiques', class: '3ème B', room: 'Salle 105', topic: 'Fonctions affines', status: 'info' },
  { id: 4, time: '14:00 - 15:00', subject: 'Mathématiques', class: '4ème A', room: 'Salle 201', topic: 'Géométrie', status: 'default' },
]);

const recentActivity = ref([
  { id: 1, icon: '📝', title: 'Nouvelle copie soumise', description: 'Marie D. - Devoir Maths', time: 'Il y a 10 min', color: '#3B82F6' },
  { id: 2, icon: '🎯', title: 'Quiz complété', description: '3ème A - 24/28 élèves', time: 'Il y a 1h', color: '#10B981' },
  { id: 3, icon: '💬', title: 'Message parent', description: 'M. Martin - RDV demandé', time: 'Il y a 2h', color: '#F59E0B' },
  { id: 4, icon: '📊', title: 'Notes publiées', description: 'Contrôle 4ème B', time: 'Hier', color: '#8B5CF6' },
]);

const classPerformance = ref([
  { name: '3ème A', average: 14.2 },
  { name: '3ème B', average: 12.8 },
  { name: '4ème A', average: 11.5 },
  { name: '4ème B', average: 13.1 },
]);

const students = ref([
  { id: 1, name: 'Martin Alice', class: '3A', average: 15.5, attendance: 98, status: 'excellent' },
  { id: 2, name: 'Dubois Lucas', class: '3A', average: 12.3, attendance: 92, status: 'good' },
  { id: 3, name: 'Bernard Emma', class: '3B', average: 10.8, attendance: 85, status: 'warning' },
  { id: 4, name: 'Petit Thomas', class: '4A', average: 14.1, attendance: 95, status: 'excellent' },
  { id: 5, name: 'Moreau Clara', class: '4B', average: 8.5, attendance: 78, status: 'alert' },
]);

const courses = ref([
  { id: 1, title: 'Équations', class: '3ème A', icon: '📐', description: 'Résolution d\'équations du 1er et 2nd degré', schedule: 'Lun/Mer 8h', students: 28, progress: 65 },
  { id: 2, title: 'Fractions', class: '4ème B', icon: '🔢', description: 'Opérations sur les fractions', schedule: 'Mar/Jeu 10h', students: 26, progress: 80 },
  { id: 3, title: 'Géométrie', class: '4ème A', icon: '📏', description: 'Théorème de Pythagore et applications', schedule: 'Lun/Ven 14h', students: 25, progress: 45 },
]);

const pendingCopies = ref([
  { id: 1, studentName: 'Marie Dupont', studentInitials: 'MD', subject: 'Devoir Maths - Équations', dueDate: '12 Jan', priority: 'normal' },
  { id: 2, studentName: 'Lucas Martin', studentInitials: 'LM', subject: 'Contrôle - Fractions', dueDate: '10 Jan', priority: 'urgent' },
  { id: 3, studentName: 'Emma Bernard', studentInitials: 'EB', subject: 'DM - Géométrie', dueDate: '15 Jan', priority: 'normal' },
]);

const recentQuizzes = ref([
  { id: 1, title: 'Quiz Équations 2nd degré', subject: 'Mathématiques', level: '3ème', questionCount: 15, usedCount: 3 },
  { id: 2, title: 'Révisions Fractions', subject: 'Mathématiques', level: '4ème', questionCount: 10, usedCount: 5 },
  { id: 3, title: 'Théorème de Pythagore', subject: 'Mathématiques', level: '4ème', questionCount: 12, usedCount: 2 },
]);

const courseResources = ref([
  { id: 1, name: 'Cours Équations.pdf', type: 'PDF', size: '2.4 MB', icon: '📄' },
  { id: 2, name: 'Exercices Fractions.docx', type: 'Word', size: '1.1 MB', icon: '📝' },
  { id: 3, name: 'Présentation Géométrie.pptx', type: 'PowerPoint', size: '5.8 MB', icon: '📊' },
]);

const exercises = ref([
  { id: 1, title: 'Équations - Série 1', subject: 'Maths', difficulty: '⭐⭐⭐' },
  { id: 2, title: 'Fractions - Entraînement', subject: 'Maths', difficulty: '⭐⭐' },
  { id: 3, title: 'Pythagore - Applications', subject: 'Maths', difficulty: '⭐⭐⭐⭐' },
]);

const evaluations = ref([
  { id: 1, title: 'Contrôle Équations', date: '08/01', class: '3ème A', status: 'pending' },
  { id: 2, title: 'Interro Fractions', date: '05/01', class: '4ème B', status: 'done' },
]);

const messages = ref([
  { id: 1, sender: 'M. Martin (Parent)', senderInitials: 'MM', preview: 'Bonjour, je souhaiterais prendre RDV...', time: '10:30', read: false },
  { id: 2, sender: 'Mme Directrice', senderInitials: 'Dir', preview: 'Réunion pédagogique vendredi 14h', time: 'Hier', read: true },
  { id: 3, sender: 'Lucas D. (Élève)', senderInitials: 'LD', preview: 'Question sur le devoir maison...', time: 'Lun', read: false },
]);

// Computed
const filteredStudents = computed(() => {
  let result = students.value;
  if (selectedClass.value) result = result.filter(s => s.class === selectedClass.value);
  if (studentSearch.value) {
    const search = studentSearch.value.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(search));
  }
  return result;
});

// Table columns
const studentColumns = [
  { title: 'Élève', key: 'name' },
  { title: 'Classe', key: 'class', width: 80 },
  { title: 'Moyenne', key: 'average', width: 100, render: row => h('span', { style: { color: row.average >= 12 ? '#10B981' : row.average >= 10 ? '#F59E0B' : '#EF4444' } }, row.average + '/20') },
  { title: 'Présence', key: 'attendance', width: 100, render: row => row.attendance + '%' },
  { title: 'Statut', key: 'status', width: 120, render: row => h(NTag, { type: row.status === 'excellent' ? 'success' : row.status === 'good' ? 'info' : row.status === 'warning' ? 'warning' : 'error', size: 'small' }, () => row.status) },
  { title: 'Actions', key: 'actions', width: 120, render: () => h(NButton, { size: 'tiny' }, () => 'Voir fiche') },
];

// Functions
function openChatbot() { showChatbot.value = true; }

function formatMessage(text) {
  return text.replace(/\n/g, '<br>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

async function sendMessage() {
  if (!chatInput.value.trim()) return;
  
  const userMsg = chatInput.value.trim();
  chatMessages.value.push({ role: 'user', content: userMsg, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
  chatInput.value = '';
  
  await nextTick();
  scrollToBottom();
  
  isTyping.value = true;
  
  // Simulate AI response
  setTimeout(() => {
    isTyping.value = false;
    const response = generateAIResponse(userMsg);
    chatMessages.value.push({ role: 'assistant', content: response, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
    nextTick(() => scrollToBottom());
  }, 1500);
}

function sendSuggestion(sug) {
  chatInput.value = sug;
  sendMessage();
}

function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }
}

function generateAIResponse(input) {
  const lower = input.toLowerCase();
  
  if (lower.includes('quiz') || lower.includes('générer')) {
    return '🎯 **Génération de Quiz**\n\nJe peux créer un quiz personnalisé pour vous ! Précisez-moi :\n\n• La **matière** (Maths, Français, etc.)\n• Le **thème** ou chapitre\n• Le **niveau** de la classe\n• Le **nombre de questions**\n\nOu utilisez le bouton "Générer un Quiz" dans le menu pour accéder au formulaire complet.';
  }
  
  if (lower.includes('correction') || lower.includes('corriger')) {
    return '📝 **Aide à la Correction**\n\nJe peux vous aider à corriger plus efficacement :\n\n• **Analyse automatique** des réponses\n• **Suggestions de notes** basées sur le barème\n• **Détection de plagiat**\n• **Commentaires personnalisés** pour chaque élève\n\nDéposez vos copies dans l\'onglet Corrections ou envoyez-les moi ici !';
  }
  
  if (lower.includes('cours') || lower.includes('plan')) {
    return '📚 **Plan de Cours**\n\nJe peux vous aider à structurer votre cours. Dites-moi :\n\n• La **matière** et le **thème**\n• La **durée** prévue\n• Le **niveau** des élèves\n• Les **objectifs** pédagogiques\n\nJe vous proposerai une structure avec introduction, activités, et évaluation.';
  }
  
  if (lower.includes('expliquer') || lower.includes('concept')) {
    return '💡 **Explication de Concepts**\n\nJe peux vous aider à expliquer des concepts difficiles aux élèves. Donnez-moi :\n\n• Le **concept** à expliquer\n• Le **niveau** des élèves\n• Les **difficultés** rencontrées\n\nJe vous proposerai des analogies, exemples et exercices adaptés.';
  }
  
  if (lower.includes('résultat') || lower.includes('performance') || lower.includes('analyser')) {
    return '📊 **Analyse des Performances**\n\nVoici ce que je peux analyser :\n\n• **Moyennes** par classe/élève\n• **Progression** sur l\'année\n• **Points faibles** à travailler\n• **Recommandations** personnalisées\n\nConsultez l\'onglet Dashboard pour les statistiques détaillées.';
  }
  
  return '🤔 Je comprends votre demande. Pour mieux vous aider, pourriez-vous préciser :\n\n• S\'agit-il de **créer du contenu** (quiz, exercices, cours) ?\n• Avez-vous besoin d\'**aide à la correction** ?\n• Voulez-vous **analyser** des résultats ?\n• Cherchez-vous à **expliquer un concept** ?\n\nJe suis là pour faciliter votre travail de professeur ! 🎓';
}

function generateQuiz() {
  generatingQuiz.value = true;
  setTimeout(() => {
    generatingQuiz.value = false;
    showQuizGenerator.value = false;
    // Add to recent quizzes
    recentQuizzes.value.unshift({
      id: Date.now(),
      title: `Quiz ${quizForm.value.topic || 'Nouveau'}`,
      subject: subjectOptions.find(s => s.value === quizForm.value.subject)?.label || 'Maths',
      level: quizForm.value.level,
      questionCount: quizForm.value.questionCount,
      usedCount: 0
    });
  }, 2000);
}

function generateExercise() { showExerciseGenerator.value = false; }
function generateCoursePlan() { showCourseGenerator.value = false; }
function viewCourse(course) { console.log('View course', course); }
function generateContent(course) { showCourseGenerator.value = true; courseForm.value.topic = course.title; }
function openCorrection(copy) { console.log('Open correction', copy); }
function handleCopyUpload(options) { console.log('Upload', options); }
function analyzeWithAI() { console.log('Analyze with AI'); }
function detectPlagiarism() { console.log('Detect plagiarism'); }
function viewQuiz(quiz) { console.log('View quiz', quiz); }
function openMessage(msg) { console.log('Open message', msg); }
</script>

<style scoped>
.teacher-assistant {
  min-height: 100vh;
  background: #0a0a0a;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0,0,0,0.5);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-icon {
  font-size: 2rem;
}

.app-title h1 {
  margin: 0;
  font-size: 1.25rem;
  color: #f5f5f5;
}

.app-subtitle {
  font-size: 0.8rem;
  color: #737373;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Main Layout */
.main-layout {
  display: flex;
  transition: all 0.3s ease;
}

.content-area {
  flex: 1;
  min-width: 0;
  padding: 1.5rem 2rem;
}

.main-layout.chatbot-open .content-area {
  margin-right: 400px;
}

/* Dashboard Stats */
.dashboard-stats {
  margin-bottom: 1.5rem;
}

.stat-card {
  text-align: center;
}

/* Main Tabs */
.main-tabs {
  margin-top: 1rem;
}

/* Course Cards */
.course-card {
  height: 100%;
  transition: all 0.3s;
}

.course-card:hover {
  border-color: #8B5CF6;
  transform: translateY(-4px);
}

/* Class Performance */
.class-perf {
  padding: 0.5rem 0;
}

/* Chatbot Panel */
.chatbot-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  background: #111;
  border-left: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(139,92,246,0.1);
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  max-width: 85%;
}

.chat-message.user {
  align-self: flex-end;
}

.chat-message.assistant {
  align-self: flex-start;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.chat-message.user .message-content {
  background: #8B5CF6;
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message.assistant .message-content {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-bottom-left-radius: 4px;
  color: #e5e5e5;
}

.message-time {
  font-size: 0.7rem;
  color: #737373;
  margin-top: 4px;
  text-align: right;
}

.chat-message.assistant .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #737373;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

.chatbot-suggestions {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.chatbot-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.3);
}

.chatbot-input :deep(.n-input) {
  flex: 1;
}

/* Floating Button */
.chatbot-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px !important;
  height: 60px !important;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(139,92,246,0.4);
  z-index: 100;
}

/* Responsive */
@media (max-width: 900px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .header-right {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .main-layout.chatbot-open .content-area {
    margin-right: 0;
  }
  
  .chatbot-panel {
    width: 100%;
    left: 0;
  }
}
</style>
