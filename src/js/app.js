// Nanhi Kaliyan (Little Buds) — Core Reactive Engine & Application Logic v4
// Integrated with Centralized Progress Store, Universal Voice-on-Tap, Cartoon Guides, and Live Dashboard

(function () {
  'use strict';

  // Application State
  const State = {
    lang: localStorage.getItem('nanhi_kaliyan_lang') || 'both',
    currentTab: 'home',
    currentSub: 'islamic',
    voiceEnabled: true,
    audioSpeed: parseFloat(localStorage.getItem('nanhi_kaliyan_audio_speed') || '1.0'),
    timerSeconds: 1200,
    timerTotalSeconds: 1200,
    timerInterval: null,
    timerRunning: false,
    currentStoryId: 'story-1',
    currentStoryPage: 1,
    currentTracingType: 'en-letter',
    currentTracingIndex: 0,
    isTracingMode: true,
    selectedWordCategory: 'wildAnimals',
    stepByStepActive: false
  };

  // Web Audio Context for synthesized chimes
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    return audioCtx;
  }

  function playChime(freq = 523.25, type = 'sine', duration = 0.35) {
    if (!State.voiceEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Web Speech API Voice Prompt Engine (Bilingual with Speed Control)
  function speakText(enText, urText) {
    if (!State.voiceEnabled) return;
    playChime(659.25, 'triangle', 0.2);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance();
      utterance.rate = State.audioSpeed === 0.75 ? 0.75 : 0.95;

      if (State.lang === 'ur' && urText) {
        utterance.text = urText;
        utterance.lang = 'ur-PK';
      } else if (State.lang === 'both' && enText && urText) {
        utterance.text = enText + ' ... ' + urText;
        utterance.lang = 'en-US';
      } else {
        utterance.text = enText || urText;
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  function speakArabic(arabic, translit, en, ur) {
    playChime(587.33);
    speakText(translit + '. ' + en, ur);
  }

  // Audio Speed Control
  function setAudioSpeed(speed) {
    State.audioSpeed = speed;
    localStorage.setItem('nanhi_kaliyan_audio_speed', speed.toString());
    const btnNormal = document.getElementById('speed-btn-normal');
    const btnSlow = document.getElementById('speed-btn-slow');
    if (btnNormal && btnSlow) {
      if (speed === 1.0) {
        btnNormal.className = 'speed-btn-active px-3 py-1.5 rounded-xl text-xs font-bold transition-all';
        btnSlow.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-dark border border-gray-200 transition-all';
      } else {
        btnSlow.className = 'speed-btn-active px-3 py-1.5 rounded-xl text-xs font-bold transition-all';
        btnNormal.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-dark border border-gray-200 transition-all';
      }
    }
    playChime(620);
  }

  // i18n Translation Resolver
  function t(path) {
    const keys = path.split('.');
    let enVal = window.NK_LOCALES?.en;
    let urVal = window.NK_LOCALES?.ur;

    for (const k of keys) {
      if (enVal) enVal = enVal[k];
      if (urVal) urVal = urVal[k];
    }

    if (State.lang === 'ur') return urVal || enVal || path;
    if (State.lang === 'en') return enVal || urVal || path;

    if (typeof enVal === 'string' && typeof urVal === 'string') {
      return { en: enVal, ur: urVal };
    }
    return enVal || urVal || path;
  }

  // Apply Language & Update DOM
  function applyLanguage(lang) {
    State.lang = lang;
    localStorage.setItem('nanhi_kaliyan_lang', lang);

    const htmlEl = document.documentElement;
    if (lang === 'ur') {
      htmlEl.lang = 'ur';
      htmlEl.dir = 'rtl';
    } else {
      htmlEl.lang = 'en';
      htmlEl.dir = 'ltr';
    }

    // Update Header Language Toggle Buttons
    ['both', 'ur', 'en'].forEach((l) => {
      const btn = document.getElementById('lang-btn-' + l);
      if (btn) {
        if (l === lang) {
          btn.style.background = 'var(--green)';
          btn.style.color = '#FFFFFF';
        } else {
          btn.style.background = 'transparent';
          btn.style.color = 'var(--text)';
        }
      }
    });

    // Translate [data-i18n] nodes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);

      if (typeof val === 'object' && val.en && val.ur) {
        if (el.hasAttribute('data-i18n-target')) {
          const target = el.getAttribute('data-i18n-target');
          el.setAttribute(target, val.en + ' / ' + val.ur);
        } else {
          el.innerHTML = `
            <span class="block font-heading font-bold">${val.en}</span>
            <span class="block font-urdu leading-relaxed" dir="rtl">${val.ur}</span>
          `;
        }
      } else if (typeof val === 'string') {
        if (el.hasAttribute('data-i18n-target')) {
          const target = el.getAttribute('data-i18n-target');
          el.setAttribute(target, val);
        } else {
          el.innerText = val;
        }
      }
    });

    playChime(587.33);
  }

  // Universal Glossy & Voice-on-Tap Listener
  function attachUniversalListeners() {
    document.addEventListener('click', (e) => {
      // Glossy click shine
      const target = e.target.closest('button, a, .glossy-click, [onclick]');
      if (target) {
        target.classList.remove('shine-trigger');
        void target.offsetWidth;
        target.classList.add('shine-trigger');
      }

      // Voice on click everywhere: elements with data-voice-en / data-voice-ur
      const voiceTarget = e.target.closest('[data-voice-en], [data-voice-ur]');
      if (voiceTarget) {
        const en = voiceTarget.getAttribute('data-voice-en');
        const ur = voiceTarget.getAttribute('data-voice-ur');
        speakText(en, ur);
      }
    });
  }

  // Welcome Screen with cartoon_4.jpg (Boy and girl drawing)
  function initWelcomeScreen() {
    const welcomeModal = document.getElementById('welcome-modal');
    if (!welcomeModal) return;

    const hasSeenWelcome = sessionStorage.getItem('nk_seen_welcome_v4');
    if (!hasSeenWelcome) {
      welcomeModal.classList.remove('hidden');
      setTimeout(() => {
        speakText(
          "Welcome to Nanhi Kaliyan! Little buds blooming at home. Let's learn and play together!",
          "ننھی کلیاں میں خوش آمدید! گھر کی مٹی میں کھلتے ننھے پھول۔ آؤ مل کر پڑھیں اور کھیلیں!"
        );
      }, 600);
    }

    window.closeWelcomeModal = function () {
      welcomeModal.classList.add('hidden');
      sessionStorage.setItem('nk_seen_welcome_v4', 'true');
      playChime(784);
    };
  }

  // CENTRAL STORE INTEGRATION & LIVE DASHBOARD
  function setupStoreIntegration() {
    if (!window.NK_STORE) return;

    // Subscribe dashboard to live store events
    window.NK_STORE.subscribe((child) => {
      updateDashboardLive(child);
      updateHeaderAndHero(child);
    });
  }

  function updateHeaderAndHero(child) {
    if (!child) return;
    // Stars
    const navStars = document.getElementById('nav-star-count');
    const gardenStars = document.getElementById('garden-total-stars');
    if (navStars) navStars.innerText = child.stars || 0;
    if (gardenStars) gardenStars.innerText = child.stars || 0;

    // Overall level
    const overallEl = document.getElementById('overall-level-display');
    if (overallEl) overallEl.innerText = child.overallLevel || 1;

    // Merah Baagh Stage Title
    const stageTitle = document.getElementById('garden-stage-title');
    if (stageTitle) {
      const stars = child.stars || 0;
      if (stars >= 25) {
        stageTitle.innerText = t('garden.stageFlower') || 'Stage: Blooming Radiant Flower! 🌸🌻';
      } else if (stars >= 15) {
        stageTitle.innerText = t('garden.stageBud') || 'Stage: Growing Flower Bud 🌹';
      } else if (stars >= 5) {
        stageTitle.innerText = t('garden.stageSprout') || 'Stage: Green Garden Sprout 🌱';
      } else {
        stageTitle.innerText = t('garden.stageSeed') || 'Stage: Seed in Soft Soil 🌰';
      }
    }
  }

  function updateDashboardLive(child) {
    if (!child) return;

    // Overall metrics
    const dashLevel = document.getElementById('dash-overall-level');
    const dashStars = document.getElementById('dash-total-stars');
    const dashMinutes = document.getElementById('dash-minutes-spent');
    const dashStreak = document.getElementById('dash-daily-streak');

    if (dashLevel) dashLevel.innerText = child.overallLevel || 1;
    if (dashStars) dashStars.innerText = child.stars || 0;
    if (dashMinutes) dashMinutes.innerText = `${child.minutesSpent || 0}m`;
    if (dashStreak) dashStreak.innerText = `${child.streakDays || 1} Days`;

    // Per-section progress bars
    const sections = child.sections || {};
    for (const key in sections) {
      const sec = sections[key];
      const percent = Math.min(100, Math.round((sec.done / (sec.total || 1)) * 100));

      const barEl = document.getElementById(`dash-bar-${key}`) || document.getElementById(`level-bar-${key}`);
      const textEl = document.getElementById(`dash-text-${key}`) || document.getElementById(`level-text-${key}`);
      const badgeEl = document.getElementById(`dash-badge-${key}`) || document.getElementById(`level-badge-${key}`);

      if (barEl) barEl.style.width = percent + '%';
      if (textEl) {
        if (State.lang === 'ur') {
          textEl.innerText = `لیول ${sec.level}: ${sec.done} میں سے ${sec.total} مکمل (${percent}%)`;
        } else if (State.lang === 'both') {
          textEl.innerText = `Level ${sec.level}: ${sec.done}/${sec.total} done (${percent}%) • ${sec.done} میں سے ${sec.total}`;
        } else {
          textEl.innerText = `Level ${sec.level}: ${sec.done} of ${sec.total} done (${percent}%)`;
        }
      }
      if (badgeEl) badgeEl.innerText = `Level ${sec.level}`;
    }

    // Dynamic Suggestions Box
    const suggestionsContainer = document.getElementById('dash-suggestions-box');
    if (suggestionsContainer && window.NK_STORE) {
      const suggestions = window.NK_STORE.getSuggestions();
      suggestionsContainer.innerHTML = '';
      if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<p class="text-xs text-dark-light">All current activities are running smoothly! Great job!</p>';
      } else {
        suggestions.forEach((s) => {
          const li = document.createElement('li');
          li.className = 'text-xs sm:text-sm text-dark-light leading-relaxed';
          li.innerHTML = `<strong>${s.en}</strong><br><span class="font-urdu text-xs text-pastel-green-dark" dir="rtl">${s.ur}</span>`;
          suggestionsContainer.appendChild(li);
        });
      }
    }

    // Dynamic Next Topics List
    const topicsContainer = document.getElementById('dash-next-topics-box');
    if (topicsContainer && window.NK_STORE) {
      const topics = window.NK_STORE.getNextTopics();
      topicsContainer.innerHTML = '';
      topics.forEach((t) => {
        const li = document.createElement('li');
        li.className = 'text-xs sm:text-sm text-dark-light leading-relaxed';
        li.innerHTML = `<span>${t.en}</span><br><span class="font-urdu text-xs text-blue-600" dir="rtl">${t.ur}</span>`;
        topicsContainer.appendChild(li);
      });
    }

    // Dynamic Recent Events / Activity Log (Weekly report)
    const logContainer = document.getElementById('dash-activity-log');
    if (logContainer) {
      logContainer.innerHTML = '';
      const events = (child.events || []).slice(0, 5);
      if (events.length === 0) {
        logContainer.innerHTML = `
          <div class="text-center py-6">
            <span class="text-3xl">🌱</span>
            <p class="text-xs text-dark-light mt-1">No completed activities yet. Start an activity to record progress!</p>
          </div>
        `;
      } else {
        events.forEach((ev) => {
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between p-3 rounded-2xl bg-white/70 border border-gray-100 text-xs';
          const time = new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          row.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-green-100 text-[#4E9150] flex items-center justify-center font-bold text-[10px]">✓</span>
              <div>
                <strong class="capitalize">${ev.section}</strong>: ${ev.activityId}
                <span class="text-[10px] text-dark-light block">${time}</span>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-yellow-100 text-amber-800 font-bold">+${ev.stars} Stars</span>
          `;
          logContainer.appendChild(row);
        });
      }
    }

    // Render Homework in Home Card and Parent Dashboard
    renderHomeworkUI(child.homework || []);
  }

  // Homework UI Rendering
  function renderHomeworkUI(hwList) {
    const listEl = document.getElementById('homework-task-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    hwList.forEach((task) => {
      const card = document.createElement('div');
      card.className = `p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        task.status === 'Checked' ? 'bg-green-50/80 border-green-200' :
        task.status === 'Done' ? 'bg-yellow-50/80 border-yellow-200' : 'bg-white/80 border-gray-100 shadow-sm'
      }`;

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            task.status === 'Checked' ? 'bg-[#6AAE6A] text-white' :
            task.status === 'Done' ? 'bg-[#FFD36B] text-dark' : 'bg-gray-100 text-dark-light'
          }">
            ${task.day}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-heading font-semibold text-dark text-sm sm:text-base">${task.titleEn}</span>
              ${task.status === 'Checked' ? '<i class="fa-solid fa-circle-check text-[#6AAE6A] text-base"></i>' : ''}
            </div>
            <p class="font-urdu text-[#4E9150] text-xs sm:text-sm font-semibold" dir="rtl">${task.titleUr}</p>
            ${task.note ? `<p class="text-[11px] text-[#4E9150] font-medium mt-0.5"><i class="fa-solid fa-comment-dots mr-1"></i>${task.note}</p>` : ''}
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-center">
          <button onclick="window.handleHomeworkAction('${task.id}', '${task.status}')" class="glossy-click px-3.5 py-2 rounded-xl text-xs font-bold ${
            task.status === 'Checked' ? 'bg-green-100 text-[#4E9150] border border-green-200' :
            task.status === 'Done' ? 'bg-yellow-100 text-amber-900 border border-amber-300' : 'btn-primary shadow-sm'
          }">
            ${task.status === 'Checked' ? 'Checked / چیک شدہ ✓' : task.status === 'Done' ? 'Verify / تصدیق کریں' : 'Mark Done / مکمل'}
          </button>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  window.handleHomeworkAction = function (id, currentStatus) {
    if (!window.NK_STORE) return;
    if (currentStatus === 'Pending') {
      window.NK_STORE.updateHomework(id, 'Done', 'Great effort!', 2);
      speakText("Homework marked done! Show it to your parents!", "ہوم ورک مکمل ہو گیا! والدین کو دکھائیں!");
      triggerCelebration("Homework Complete! (+2 Stars)", "ہوم ورک مکمل ہو گیا!");
    } else if (currentStatus === 'Done') {
      window.NK_STORE.updateHomework(id, 'Checked', 'Teacher & Parent Verified! Mashallah!', 1);
      speakText("Verified by parent! Well done!", "والدین کی طرف سے تصدیق شدہ! ماشاءاللہ!");
      triggerCelebration("Verified by Parent! (+1 Star)", "والدین کی طرف سے تصدیق مکمل!");
    } else {
      window.NK_STORE.updateHomework(id, 'Pending', '', 0);
    }
  };

  // Reusable StepByStep Activity Modal Component
  window.NK_STEP_BY_STEP = {
    currentActivity: null,
    currentStep: 0,

    open({ titleEn, titleUr, section, steps }) {
      this.currentActivity = { titleEn, titleUr, section, steps };
      this.currentStep = 0;
      this.render();
      const modal = document.getElementById('step-by-step-modal');
      if (modal) modal.classList.remove('hidden');
      playChime(660);
    },

    close() {
      const modal = document.getElementById('step-by-step-modal');
      if (modal) modal.classList.add('hidden');
      this.currentActivity = null;
    },

    next() {
      if (!this.currentActivity) return;
      if (this.currentStep < this.currentActivity.steps.length - 1) {
        this.currentStep++;
        this.render();
        playChime(700);
      }
    },

    prev() {
      if (!this.currentActivity) return;
      if (this.currentStep > 0) {
        this.currentStep--;
        this.render();
        playChime(500);
      }
    },

    finish() {
      if (!this.currentActivity) return;
      const act = this.currentActivity;
      this.close();
      if (window.NK_STORE) {
        const res = window.NK_STORE.recordActivity({
          section: act.section,
          activityId: act.titleEn,
          stars: 2,
          minutes: 4,
          note: 'Step-by-step activity completed'
        });
        triggerCelebration(`${act.titleEn} Complete! (+2 Stars)`, "ماشاءاللہ! سرگرمی مکمل ہو گئی!");
        if (res && res.leveledUp) {
          setTimeout(() => showLevelUpCelebration(act.section, res.newLevel), 500);
        }
      }
    },

    render() {
      if (!this.currentActivity) return;
      const step = this.currentActivity.steps[this.currentStep];
      const total = this.currentActivity.steps.length;

      const titleEl = document.getElementById('step-modal-title');
      const iconEl = document.getElementById('step-modal-icon');
      const descEnEl = document.getElementById('step-modal-desc-en');
      const descUrEl = document.getElementById('step-modal-desc-ur');
      const dotsEl = document.getElementById('step-modal-dots');
      const btnNext = document.getElementById('step-modal-btn-next');
      const btnPrev = document.getElementById('step-modal-btn-prev');

      if (titleEl) titleEl.innerText = `${this.currentActivity.titleEn} (Step ${this.currentStep + 1}/${total})`;
      if (iconEl) iconEl.innerText = step.icon || '🌟';
      if (descEnEl) descEnEl.innerText = step.descEn || step.titleEn;
      if (descUrEl) descUrEl.innerText = step.descUr || step.titleUr;

      // Dots
      if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('span');
          dot.className = `w-3 h-3 rounded-full transition-all ${i === this.currentStep ? 'bg-[#6AAE6A] w-6' : 'bg-gray-300'}`;
          dotsEl.appendChild(dot);
        }
      }

      // Prev button
      if (btnPrev) {
        btnPrev.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';
      }

      // Next or Finish button
      if (btnNext) {
        if (this.currentStep === total - 1) {
          btnNext.innerHTML = '<span>Done / مکمل (+2 Stars)</span> <i class="fa-solid fa-star text-yellow-300 ml-1"></i>';
          btnNext.onclick = () => this.finish();
        } else {
          btnNext.innerHTML = '<span>Next / اگلا</span> <i class="fa-solid fa-arrow-right ml-1"></i>';
          btnNext.onclick = () => this.next();
        }
      }

      // Speak current step aloud automatically
      speakText(step.descEn || step.titleEn, step.descUr || step.titleUr);
    }
  };

  // 5-Page Interactive Story Reader Component
  window.NK_STORY_READER = {
    currentStory: null,
    currentPage: 1,

    open(storyId) {
      const data = window.NK_CONTENT?.storiesSection?.storyReader;
      if (!data) return;
      this.currentStory = data;
      this.currentPage = 1;
      const modal = document.getElementById('story-reader-modal');
      if (modal) modal.classList.remove('hidden');
      this.render();
      playChime(660);
    },

    close() {
      const modal = document.getElementById('story-reader-modal');
      if (modal) modal.classList.add('hidden');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },

    render() {
      if (!this.currentStory) return;
      const page = this.currentStory.pages[this.currentPage - 1];
      const total = this.currentStory.pages.length;

      const titleEl = document.getElementById('story-reader-title');
      const iconEl = document.getElementById('story-reader-icon');
      const textEnEl = document.getElementById('story-reader-text-en');
      const textUrEl = document.getElementById('story-reader-text-ur');
      const counterEl = document.getElementById('story-reader-page-num');
      const dotsEl = document.getElementById('story-reader-dots');
      const quizBox = document.getElementById('story-reader-quiz-box');
      const btnNext = document.getElementById('story-reader-btn-next');
      const btnPrev = document.getElementById('story-reader-btn-prev');

      if (titleEl) titleEl.innerText = `${this.currentStory.titleEn} / ${this.currentStory.titleUr}`;
      if (iconEl) iconEl.innerText = page.icon || '📖';
      if (textEnEl) textEnEl.innerText = page.textEn;
      if (textUrEl) textUrEl.innerText = page.textUr;
      if (counterEl) counterEl.innerText = `Page ${this.currentPage} of ${total} (صفحہ ${this.currentPage} از ${total})`;

      if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let i = 1; i <= total; i++) {
          const dot = document.createElement('button');
          dot.className = `h-3 rounded-full transition-all ${i === this.currentPage ? 'bg-purple-600 w-7' : 'bg-gray-300 w-3'}`;
          dot.onclick = () => { this.currentPage = i; this.render(); };
          dotsEl.appendChild(dot);
        }
      }

      if (btnPrev) btnPrev.style.visibility = this.currentPage === 1 ? 'hidden' : 'visible';

      if (quizBox) {
        if (page.questionEn) {
          quizBox.classList.remove('hidden');
          quizBox.innerHTML = `
            <div class="p-4 rounded-2xl bg-purple-50/90 border border-purple-200 text-center space-y-3">
              <span class="text-xs font-bold text-purple-700 uppercase">Question Time / سوال کا وقت</span>
              <p class="font-heading font-bold text-dark text-sm sm:text-base">${page.questionEn}</p>
              <p class="font-urdu font-bold text-purple-800 text-sm" dir="rtl">${page.questionUr}</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                ${page.optionsEn.map((opt, idx) => `
                  <button onclick="window.NK_STORY_READER.answerQuestion(${idx})" class="p-2.5 rounded-xl bg-white border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-all text-dark">
                    ${opt} <br><span class="font-urdu text-[11px] text-purple-700" dir="rtl">${page.optionsUr[idx]}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          quizBox.classList.add('hidden');
          quizBox.innerHTML = '';
        }
      }

      if (btnNext) {
        if (this.currentPage === total) {
          btnNext.innerHTML = '<span>Finish / مکمل (+3 Stars)</span> <i class="fa-solid fa-star text-yellow-300 ml-1"></i>';
          btnNext.onclick = () => this.finish();
        } else {
          btnNext.innerHTML = '<span>Next / اگلا</span> <i class="fa-solid fa-arrow-right ml-1"></i>';
          btnNext.onclick = () => this.next();
        }
      }

      // Auto-speak page text
      speakText(page.voiceEn || page.textEn, page.voiceUr || page.textUr);
    },

    next() {
      if (this.currentPage < this.currentStory.pages.length) {
        this.currentPage++;
        this.render();
        playChime(660);
      }
    },

    prev() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
        playChime(500);
      }
    },

    speakCurrentPage() {
      if (!this.currentStory) return;
      const page = this.currentStory.pages[this.currentPage - 1];
      speakText(page.voiceEn || page.textEn, page.voiceUr || page.textUr);
    },

    answerQuestion(idx) {
      const page = this.currentStory.pages[this.currentPage - 1];
      if (idx === page.correctIndex) {
        triggerCelebration("Brilliant Answer! (+1 Bonus)", "شاباش! بالکل درست جواب!");
      } else {
        speakText("Good try! The sun, rain and soil help it grow!", "شاباش! بارش، دھوپ اور نرم مٹی سے پودا کھلتا ہے!");
      }
    },

    finish() {
      this.close();
      if (window.NK_STORE) {
        window.NK_STORE.recordActivity({
          section: 'stories',
          activityId: 'story-sprout-and-sun',
          stars: 3,
          minutes: 6,
          note: 'Completed 5-page moral story reader'
        });
      }
      triggerCelebration("Story Completed! (+3 Stars)", "ماشاءاللہ! کہانی مکمل ہو گئی!");
    }
  };

  // Junior Science 10-Question Quiz Assignment Component
  window.NK_SCIENCE_QUIZ = {
    questions: [],
    currentIndex: 0,
    score: 0,

    open() {
      this.questions = window.NK_CONTENT?.juniorLearners?.scientistOfTheDay?.quiz || [];
      this.currentIndex = 0;
      this.score = 0;
      const modal = document.getElementById('science-quiz-modal');
      if (modal) modal.classList.remove('hidden');
      this.render();
      playChime(660);
    },

    close() {
      const modal = document.getElementById('science-quiz-modal');
      if (modal) modal.classList.add('hidden');
    },

    render() {
      if (!this.questions.length) return;
      const q = this.questions[this.currentIndex];
      const total = this.questions.length;

      const progressEl = document.getElementById('science-quiz-progress');
      const counterEl = document.getElementById('science-quiz-counter');
      const scoreEl = document.getElementById('science-quiz-score');
      const qEnEl = document.getElementById('science-quiz-q-en');
      const qUrEl = document.getElementById('science-quiz-q-ur');
      const optionsBox = document.getElementById('science-quiz-options');
      const explainBox = document.getElementById('science-quiz-explanation');

      if (progressEl) progressEl.style.width = `${((this.currentIndex + 1) / total) * 100}%`;
      if (counterEl) counterEl.innerText = `Question ${this.currentIndex + 1} of ${total}`;
      if (scoreEl) scoreEl.innerText = `Score: ${this.score}/${total}`;
      if (qEnEl) qEnEl.innerText = q.qEn;
      if (qUrEl) qUrEl.innerText = q.qUr;
      if (explainBox) {
        explainBox.classList.add('hidden');
        explainBox.innerHTML = '';
      }

      if (optionsBox) {
        optionsBox.innerHTML = '';
        q.optionsEn.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'w-full p-3.5 rounded-2xl bg-white border border-gray-200 text-start text-xs sm:text-sm font-bold text-dark hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm';
          btn.innerHTML = `
            <div class="flex items-center justify-between">
              <div>
                <span>${opt}</span>
                <span class="block font-urdu text-xs text-blue-700 mt-0.5" dir="rtl">${q.optionsUr[idx]}</span>
              </div>
              <span class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-dark-light font-mono">${String.fromCharCode(65 + idx)}</span>
            </div>
          `;
          btn.onclick = () => this.handleAnswer(idx);
          optionsBox.appendChild(btn);
        });
      }

      speakText(q.qEn, q.qUr);
    },

    handleAnswer(selectedIdx) {
      const q = this.questions[this.currentIndex];
      const isCorrect = selectedIdx === q.answer;
      const explainBox = document.getElementById('science-quiz-explanation');
      const optionsBox = document.getElementById('science-quiz-options');

      if (optionsBox) {
        Array.from(optionsBox.children).forEach((child, i) => {
          child.disabled = true;
          if (i === q.answer) {
            child.className = 'w-full p-3.5 rounded-2xl bg-green-100 border-2 border-green-500 text-start text-xs sm:text-sm font-bold text-green-900';
          } else if (i === selectedIdx && !isCorrect) {
            child.className = 'w-full p-3.5 rounded-2xl bg-red-100 border-2 border-red-400 text-start text-xs sm:text-sm font-bold text-red-900';
          }
        });
      }

      if (isCorrect) {
        this.score++;
        playChime(784, 'sine', 0.2);
      } else {
        playChime(350, 'sawtooth', 0.2);
      }

      const scoreEl = document.getElementById('science-quiz-score');
      if (scoreEl) scoreEl.innerText = `Score: ${this.score}/${this.questions.length}`;

      if (explainBox && q.explanation) {
        explainBox.classList.remove('hidden');
        explainBox.innerHTML = `
          <div class="p-3 rounded-2xl ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'} text-xs leading-relaxed">
            <strong>${isCorrect ? '✓ Correct!' : 'ℹ Explanation:'}</strong> ${q.explanation}
          </div>
        `;
      }

      setTimeout(() => {
        if (this.currentIndex < this.questions.length - 1) {
          this.currentIndex++;
          this.render();
        } else {
          this.finish();
        }
      }, 1600);
    },

    finish() {
      this.close();
      if (window.NK_STORE) {
        window.NK_STORE.recordActivity({
          section: 'juniorScience',
          activityId: 'ibn-haytham-10quiz',
          stars: 3,
          minutes: 8,
          note: `10-Question Science Quiz Assignment: ${this.score}/10`
        });
      }
      triggerCelebration(`Science Assignment Complete! (${this.score}/10) +3 Stars`, "ماشاءاللہ! سائنس کوئز اسائنمنٹ مکمل!");
    }
  };

  // Celebration Confetti & Level Up Toasts
  function triggerCelebration(titleEn, titleUr) {
    playChime(880, 'triangle', 0.5);
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6AAE6A', '#FFD36B', '#FFB3C1', '#9CD3EA']
      });
    }

    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card bg-white/95 border-2 border-yellow-300 shadow-2xl rounded-3xl p-4 sm:p-5 flex items-center gap-4 animate-bounce';
    toast.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">🌟</div>
      <div>
        <h4 class="font-heading font-extrabold text-dark text-base sm:text-lg">${titleEn}</h4>
        <p class="font-urdu text-[#4E9150] font-bold text-sm" dir="rtl">${titleUr}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  function showLevelUpCelebration(sectionKey, newLevel) {
    playChime(950, 'sine', 0.8);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    }
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="glass-card modal-glass-container rounded-4xl p-8 max-w-sm w-full text-center border-2 border-yellow-300 shadow-2xl space-y-3">
        <div class="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-5xl mx-auto animate-character-bob">🎉</div>
        <h3 class="text-2xl font-heading font-extrabold text-dark">Level Up!</h3>
        <p class="font-urdu text-xl font-bold text-[#4E9150]" dir="rtl">ماشاءاللہ! لیول ${newLevel} ان لاک ہو گیا!</p>
        <p class="text-xs text-dark-light">You are doing incredible work in ${sectionKey}. Keep blooming!</p>
        <button onclick="this.closest('.fixed').remove()" class="btn-primary glossy-click w-full py-3 rounded-2xl font-bold text-sm mt-3">Continue / جاری رکھیں</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // 20-Minute Timer Engine
  function initTimer() {
    const timerDisplay = document.getElementById('timer-display');
    const timerProgress = document.getElementById('timer-progress');
    const playBtn = document.getElementById('timer-play-btn');
    const playIcon = document.getElementById('timer-play-icon');

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateUI() {
      if (timerDisplay) timerDisplay.innerText = formatTime(State.timerSeconds);
      if (timerProgress) {
        const pct = Math.max(0, (State.timerSeconds / State.timerTotalSeconds) * 100);
        timerProgress.style.width = pct + '%';
      }
    }

    window.toggleTimer = function () {
      if (State.timerRunning) {
        clearInterval(State.timerInterval);
        State.timerRunning = false;
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        playChime(440);
      } else {
        State.timerRunning = true;
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        playChime(660);
        State.timerInterval = setInterval(() => {
          if (State.timerSeconds > 0) {
            State.timerSeconds--;
            updateUI();
          } else {
            clearInterval(State.timerInterval);
            State.timerRunning = false;
            if (playIcon) playIcon.className = 'fa-solid fa-play';
            onTimerOver();
          }
        }, 1000);
      }
    };

    window.resetTimer = function () {
      clearInterval(State.timerInterval);
      State.timerRunning = false;
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      State.timerSeconds = State.timerTotalSeconds;
      updateUI();
    };

    window.adjustTimer = function (mins) {
      State.timerSeconds += mins * 60;
      State.timerTotalSeconds += mins * 60;
      updateUI();
      playChime(600);
    };

    function onTimerOver() {
      playChime(440, 'triangle', 0.8);
      speakText(
        "Screen time is over, my little friends! Time for a hands-on home activity!",
        "اسکرین کا وقت ختم، اب گھر کی ایکٹیویٹی کا وقت ہے!"
      );
      const modal = document.getElementById('screen-free-modal');
      if (modal) modal.classList.remove('hidden');
    }

    window.completeHomeActivity = function () {
      const modal = document.getElementById('screen-free-modal');
      if (modal) modal.classList.add('hidden');
      if (window.NK_STORE) {
        window.NK_STORE.recordActivity({ section: 'weekly', activityId: 'screen-free-home', stars: 5, minutes: 15 });
      }
      triggerCelebration("Home Activity Champion! (+5 Stars)", "گھریلو سرگرمی مکمل ہو گئی!");
      window.resetTimer();
    };

    window.requestExtraScreenTime = function () {
      const modal = document.getElementById('screen-free-modal');
      if (modal) modal.classList.add('hidden');
      window.openParentModal();
    };

    updateUI();
  }

  // Tracing Canvas Engine (Dotted stroke order vs Free Drawing Mode)
  let traceCanvas = null, traceCtx = null, isTracing = false;
  function initTraceCanvas() {
    traceCanvas = document.getElementById('traceCanvas');
    if (!traceCanvas) return;
    traceCtx = traceCanvas.getContext('2d');
    traceCtx.lineWidth = 14;
    traceCtx.lineCap = 'round';
    traceCtx.lineJoin = 'round';
    traceCtx.strokeStyle = '#6AAE6A';

    loadTracingItem();

    function getPos(e) {
      const rect = traceCanvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (cx - rect.left) * (traceCanvas.width / rect.width),
        y: (cy - rect.top) * (traceCanvas.height / rect.height)
      };
    }

    function start(e) {
      e.preventDefault();
      isTracing = true;
      const pos = getPos(e);
      traceCtx.beginPath();
      traceCtx.moveTo(pos.x, pos.y);
      playChime(700, 'sine', 0.05);
    }

    function move(e) {
      if (!isTracing) return;
      e.preventDefault();
      const pos = getPos(e);
      traceCtx.lineTo(pos.x, pos.y);
      traceCtx.stroke();
    }

    function stop(e) {
      if (!isTracing) return;
      isTracing = false;
      traceCtx.closePath();
    }

    traceCanvas.addEventListener('mousedown', start);
    traceCanvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);

    traceCanvas.addEventListener('touchstart', start, { passive: false });
    traceCanvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);

    window.setTracingColor = function (color) {
      if (traceCtx) traceCtx.strokeStyle = color;
      playChime(620);
    };

    window.clearTracing = function () {
      if (!traceCanvas || !traceCtx) return;
      traceCtx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
      loadTracingItem();
      playChime(400);
    };

    window.toggleTracingMode = function (isTrace) {
      State.isTracingMode = isTrace;
      const btnTrace = document.getElementById('btn-mode-trace');
      const btnFree = document.getElementById('btn-mode-free');
      if (btnTrace && btnFree) {
        if (isTrace) {
          btnTrace.className = 'btn-primary px-4 py-2 rounded-xl text-xs font-bold transition-all';
          btnFree.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-white text-dark border border-gray-200 transition-all';
        } else {
          btnFree.className = 'btn-primary px-4 py-2 rounded-xl text-xs font-bold transition-all';
          btnTrace.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-white text-dark border border-gray-200 transition-all';
        }
      }
      window.clearTracing();
    };

    window.selectTracingLetter = function (type, index) {
      State.currentTracingType = type;
      State.currentTracingIndex = index;
      window.clearTracing();
      speakCurrentLetter();
    };

    window.submitTracing = function () {
      if (window.NK_STORE) {
        window.NK_STORE.recordActivity({ section: 'tracing', activityId: `letter-${State.currentTracingIndex}`, stars: 1, minutes: 4 });
      }
      triggerCelebration("Tracing Done! (+1 Star)", "بہترین لکھائی! ماشاءاللہ!");
      const bubble = document.getElementById('cartoon-1-speech');
      if (bubble) {
        bubble.innerText = "Bye bye for now! Keep writing! (اللہ حافظ، پھر ملیں گے!)";
        bubble.parentElement.classList.add('animate-bye-wave');
      }
      speakText("Well done! Beautiful handwriting! Bye bye!", "ماشاءاللہ! بہت پیارا لکھا ہے! اللہ حافظ!");
    };
  }

  function loadTracingItem() {
    if (!traceCanvas || !traceCtx) return;
    traceCtx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    if (!State.isTracingMode) return;

    traceCtx.save();
    traceCtx.font = "bold 180px 'Fredoka', 'Noto Nastaliq Urdu', sans-serif";
    traceCtx.fillStyle = "rgba(74, 59, 53, 0.12)";
    traceCtx.textAlign = "center";
    traceCtx.textBaseline = "middle";

    let displayChar = "A";
    const content = window.NK_CONTENT;

    if (State.currentTracingType === 'en-letter' && content?.englishLetters) {
      const item = content.englishLetters[State.currentTracingIndex] || content.englishLetters[0];
      displayChar = item.letter;
      updateStrokeGuideDisplay(item.strokes, item.wordEn, item.wordUr, item.icon);
    } else if (State.currentTracingType === 'ur-letter' && content?.urduLetters) {
      const item = content.urduLetters[State.currentTracingIndex] || content.urduLetters[0];
      displayChar = item.letter;
      updateStrokeGuideDisplay(item.strokes, item.wordEn, item.wordUr, item.icon);
    } else if (State.currentTracingType === 'number' && content?.numbersList) {
      const item = content.numbersList[State.currentTracingIndex] || content.numbersList[0];
      displayChar = item.num.toString();
      updateStrokeGuideDisplay(`Follow dotted number ${item.num}`, item.wordEn, item.wordUr, "🔢");
    }

    traceCtx.fillText(displayChar, traceCanvas.width / 2, traceCanvas.height / 2 + 10);
    traceCtx.setLineDash([8, 8]);
    traceCtx.strokeStyle = "rgba(106, 174, 106, 0.4)";
    traceCtx.lineWidth = 3;
    traceCtx.strokeText(displayChar, traceCanvas.width / 2, traceCanvas.height / 2 + 10);
    traceCtx.restore();
  }

  function updateStrokeGuideDisplay(strokes, wordEn, wordUr, icon) {
    const strokeEl = document.getElementById('stroke-guide-text');
    const wordEl = document.getElementById('stroke-word-display');
    if (strokeEl) strokeEl.innerText = strokes || "Follow the arrows smoothly from top to bottom.";
    if (wordEl) wordEl.innerHTML = `${icon || '✨'} <span class="font-bold">${wordEn}</span> / <span class="font-urdu font-bold" dir="rtl">${wordUr}</span>`;
  }

  function speakCurrentLetter() {
    const content = window.NK_CONTENT;
    if (State.currentTracingType === 'en-letter' && content?.englishLetters) {
      const item = content.englishLetters[State.currentTracingIndex];
      if (item) speakText(`${item.letter}. ${item.letter} for ${item.wordEn}. Sound is ${item.sound}`, `${item.letter} سے ${item.wordUr}`);
    } else if (State.currentTracingType === 'ur-letter' && content?.urduLetters) {
      const item = content.urduLetters[State.currentTracingIndex];
      if (item) speakText(`${item.nameUr}. ${item.wordUr} (${item.wordEn})`, `${item.nameUr} سے ${item.wordUr}`);
    } else if (State.currentTracingType === 'number' && content?.numbersList) {
      const item = content.numbersList[State.currentTracingIndex];
      if (item) speakText(`Number ${item.num}. ${item.wordEn}`, `نمبر ${item.num}، ${item.wordUr}`);
    }
  }

  // Speaking & Writing Words Engine
  window.selectWordCategory = function (cat) {
    State.selectedWordCategory = cat;
    renderWordSetCards();
    playChime(640);
  };

  function renderWordSetCards() {
    const container = document.getElementById('speaking-words-container');
    if (!container || !window.NK_CONTENT?.wordSets) return;
    const catData = window.NK_CONTENT.wordSets[State.selectedWordCategory] || window.NK_CONTENT.wordSets.wildAnimals;
    container.innerHTML = '';

    catData.words.forEach((w) => {
      const card = document.createElement('div');
      card.className = 'glass-card glossy-click p-4 rounded-3xl bg-white/70 border border-gray-100 hover:border-pastel-blue shadow-sm flex flex-col items-center text-center cursor-pointer group transition-all';
      card.onclick = () => {
        speakText(w.en, w.ur);
        if (window.NK_STORE) {
          window.NK_STORE.recordActivity({ section: 'speaking', activityId: w.en, stars: 1, minutes: 2 });
        }
        const promptEl = document.getElementById('speaking-current-prompt');
        if (promptEl) {
          promptEl.innerHTML = `You learned: <strong class="text-[#4E9150]">${w.en}</strong> / <span class="font-urdu font-bold" dir="rtl">${w.ur}</span> (+1 Star)`;
        }
      };
      card.innerHTML = `
        <span class="text-4xl group-hover:scale-110 transition-transform mb-2">${w.icon}</span>
        <h4 class="font-heading font-bold text-dark text-base">${w.en}</h4>
        <p class="font-urdu text-[#4E9150] font-bold text-sm" dir="rtl">${w.ur}</p>
        <span class="text-[10px] text-dark-light mt-1">${w.hint}</span>
        <div class="flex items-center gap-1.5 mt-2.5">
          <button class="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <i class="fa-solid fa-volume-high"></i> Speak
          </button>
          <button onclick="event.stopPropagation(); window.traceWord('${w.en}')" class="px-2.5 py-1.5 rounded-xl bg-green-50 text-[#4E9150] text-xs font-bold flex items-center gap-1 hover:bg-[#6AAE6A] hover:text-white transition-all" title="Trace this word">
            <i class="fa-solid fa-pencil"></i> Trace
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Connect Speaking Word to Tracing Board
  window.traceWord = function (word) {
    switchTab('little');
    switchSubTab('tracing');
    const firstLetter = (word[0] || 'A').toUpperCase();
    const index = (window.NK_CONTENT?.englishLetters || []).findIndex((item) => item.letter === firstLetter);
    if (index >= 0) {
      window.selectTracingLetter('en-letter', index);
    }
    speakText(`Let's trace word ${word}! Starting with letter ${firstLetter}!`, `آؤ ${word} لکھتے ہیں!`);
  };

  // Complete Paper Art
  window.completePaperArt = function () {
    if (window.NK_STORE) {
      window.NK_STORE.recordActivity({
        section: 'art',
        activityId: 'yellow-sun',
        stars: 3,
        minutes: 10,
        note: 'Completed hands-on paper sun coloring with wax crayons'
      });
    }
    triggerCelebration("Paper Art Complete! (+3 Stars)", "ماشاءاللہ! کاپی پر آرٹ کا کام مکمل ہو گیا!");
    speakText("Mashallah! Beautiful coloring on paper! 3 stars earned!", "ماشاءاللہ! کاپی پر بہت پیارا کام کیا ہے!");
  };

  // Junior Mental Maths
  let currentCorrectMathsAnswer = 56;
  window.handleJuniorMathsAnswer = function (chosen, correct) {
    const target = correct !== undefined ? correct : currentCorrectMathsAnswer;
    if (chosen === target) {
      if (window.NK_STORE) {
        window.NK_STORE.recordActivity({
          section: 'juniorMaths',
          activityId: 'speed-multiplication',
          stars: 2,
          minutes: 2,
          note: `Solved multiplication challenge correctly`
        });
      }
      triggerCelebration("Speed Maths Correct! (+2 Stars)", "شاباش! ریاضی کا جواب بالکل درست ہے!");
      setTimeout(() => window.generateNewMathsProblem(), 1200);
    } else {
      speakText("Try again, young mathematician!", "دوبارہ سوچیں اور درست جواب تلاش کریں!");
      playChime(350, 'sawtooth', 0.2);
    }
  };

  window.generateNewMathsProblem = function () {
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const num2 = Math.floor(Math.random() * 8) + 2;
    const ans = num1 * num2;
    currentCorrectMathsAnswer = ans;

    const probEl = document.getElementById('junior-maths-problem');
    const optContainer = document.getElementById('junior-maths-options');
    if (probEl) probEl.innerText = `${num1} × ${num2} = ?`;

    if (optContainer) {
      const wrongSet = new Set();
      while (wrongSet.size < 3) {
        const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1);
        const cand = ans + delta;
        if (cand > 0 && cand !== ans) wrongSet.add(cand);
      }
      const choices = [ans, ...Array.from(wrongSet)].sort(() => Math.random() - 0.5);
      optContainer.innerHTML = '';
      choices.forEach((c) => {
        const btn = document.createElement('button');
        btn.className = c === ans ? 'btn-primary py-2.5 rounded-xl font-bold text-sm shadow-sm' : 'py-2.5 rounded-xl bg-white text-dark font-bold text-sm border hover:bg-gray-50 transition-all';
        btn.innerText = c;
        btn.onclick = () => window.handleJuniorMathsAnswer(c, ans);
        optContainer.appendChild(btn);
      });
    }
    playChime(620);
  };

  // Junior English Grammar
  window.handleJuniorGrammarAnswer = function (chosen, correct) {
    if (chosen === correct) {
      if (window.NK_STORE) {
        window.NK_STORE.recordActivity({
          section: 'juniorEnglish',
          activityId: 'action-verb-identifier',
          stars: 2,
          minutes: 2,
          note: `Correctly identified action verb: ${chosen}`
        });
      }
      triggerCelebration("Grammar Spot On! (+2 Stars)", "شاباش! 'sings' ایک ایکشن ورب ہے!");
    } else {
      speakText(`${chosen} is not an action verb. An action verb tells what someone DOES!`, `${chosen} ایکشن ورب نہیں ہے۔ دوبارہ دیکھیں!`);
      playChime(350, 'sawtooth', 0.2);
    }
  };

  // Navigation Switching
  function switchTab(tabId) {
    State.currentTab = tabId;
    ['home', 'little', 'junior', 'garden', 'parent', 'admin', 'language-test'].forEach((id) => {
      const el = document.getElementById('tab-' + id);
      if (el) {
        if (id === tabId) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    playChime(659.25);
  }

  function switchSubTab(subId) {
    State.currentSub = subId;
    const subs = ['islamic', 'manners', 'tracing', 'speaking', 'exercise', 'art', 'fine-motor', 'poems', 'stories', 'weekly'];
    subs.forEach((s) => {
      const el = document.getElementById('sub-' + s);
      const btn = document.getElementById('sub-tab-btn-' + s);
      if (el) {
        if (s === subId) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
      if (btn) {
        if (s === subId) {
          btn.className = 'subtab-active glossy-click px-4 py-2.5 rounded-2xl bg-[#6AAE6A] text-white font-heading font-bold text-xs sm:text-sm whitespace-nowrap shadow-sm border border-transparent';
        } else {
          btn.className = 'glass-card glossy-click px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white text-dark font-heading font-medium text-xs sm:text-sm whitespace-nowrap border border-white shadow-sm';
        }
      }
    });

    if (subId === 'tracing') {
      setTimeout(() => initTraceCanvas(), 100);
    } else if (subId === 'speaking') {
      renderWordSetCards();
    }
  }

  // Parent PIN Protection
  function openParentModal() {
    const modal = document.getElementById('parent-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function checkParentPin() {
    const input = document.getElementById('parent-pin-input');
    const err = document.getElementById('parent-pin-err');
    if (input && input.value === '1234') {
      if (err) err.classList.add('hidden');
      const modal = document.getElementById('parent-modal');
      if (modal) modal.classList.add('hidden');
      switchTab('parent');
      input.value = '';
    } else {
      if (err) err.classList.remove('hidden');
      playChime(300, 'sawtooth', 0.2);
    }
  }

  // Initialization Lifecycle
  document.addEventListener('DOMContentLoaded', () => {
    attachUniversalListeners();
    initTimer();
    setupStoreIntegration();
    initWelcomeScreen();
    applyLanguage(State.lang);

    // Speed Controls
    const btnNormal = document.getElementById('speed-btn-normal');
    const btnSlow = document.getElementById('speed-btn-slow');
    if (btnNormal) btnNormal.onclick = () => setAudioSpeed(1.0);
    if (btnSlow) btnSlow.onclick = () => setAudioSpeed(0.75);

    // Skip Splash
    const skipBtn = document.getElementById('splash-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
      });
    }

    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => (splash.style.display = 'none'), 600);
      }
    }, 3200);
  });

  // Global Exports
  window.NK_APP = {
    State,
    setLanguage: applyLanguage,
    switchTab,
    switchSubTab,
    openParentModal,
    checkParentPin,
    speakText,
    speakArabic,
    setAudioSpeed
  };

  window.switchTab = switchTab;
  window.switchSubTab = switchSubTab;
  window.openParentModal = openParentModal;
  window.checkParentPin = checkParentPin;
  window.speakArabic = speakArabic;
  window.toggleVoice = function () {
    State.voiceEnabled = !State.voiceEnabled;
    const btn = document.getElementById('voice-toggle-btn');
    if (btn) {
      btn.innerHTML = State.voiceEnabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark text-gray-400"></i>';
    }
    playChime(State.voiceEnabled ? 660 : 330);
  };
})();
