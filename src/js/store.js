// Nanhi Kaliyan (Little Buds) — Centralized Progress Store v1
// Single source of truth for child progress, levels, homework, and activity completions.
// Fully reactive with live subscriber updates. Designed for localStorage now, structured for Supabase.

(function () {
  'use strict';

  const STORAGE_KEY = 'nanhi_kaliyan_central_store_v1';

  const DEFAULT_SECTIONS = {
    islamic: { level: 1, done: 3, total: 6, nameEn: "Islamic Values", nameUr: "اسلامی اقدار", activities: { tauz: true, tasmiya: true, kalma1: true } },
    manners: { level: 1, done: 2, total: 3, nameEn: "Good Manners", nameUr: "آداب و اخلاق", activities: { 'm-salam': true, 'm-please': true } },
    tracing: { level: 2, done: 5, total: 26, nameEn: "Tracing & Writing", nameUr: "ٹریسنگ و لکھائی", activities: { A: true, B: true, C: true, D: true, E: true } },
    speaking: { level: 1, done: 3, total: 6, nameEn: "Speaking & Words", nameUr: "بولنا اور الفاظ", activities: { Lion: true, Elephant: true, Cat: true } },
    finemotor: { level: 1, done: 1, total: 3, nameEn: "Fine Motor Skills", nameUr: "ہاتھوں کی مہارت", activities: { 'paper-tear': true } },
    exercise: { level: 1, done: 2, total: 4, nameEn: "Morning Exercise", nameUr: "صبح کی ورزش", activities: { 'reach-sun': true, 'butterfly-wings': true } },
    art: { level: 1, done: 1, total: 2, nameEn: "Paper Art", nameUr: "کاغذ کا آرٹ", activities: { 'yellow-sun': true } },
    poems: { level: 2, done: 2, total: 3, nameEn: "Action Poems", nameUr: "نظمیں و ترانے", activities: { 'poem-1': true, 'poem-2': true } },
    stories: { level: 1, done: 1, total: 3, nameEn: "Moral Stories", nameUr: "اخلاقی کہانیاں", activities: { 'story-1': true } },
    weekly: { level: 1, done: 1, total: 2, nameEn: "Weekly Home Play", nameUr: "ہفتہ وار سرگرمی", activities: { 'water-flower': true } },
    juniorMaths: { level: 1, done: 4, total: 10, nameEn: "Mental Maths", nameUr: "ریاضی چیلنج", activities: { 'tab-2': true, 'tab-5': true, 'sum-1': true, 'sum-2': true } },
    juniorEnglish: { level: 1, done: 3, total: 10, nameEn: "English Grammar", nameUr: "انگلش گرامر", activities: { 'verbs-1': true, 'nouns-1': true, 'adj-1': true } },
    juniorScience: { level: 1, done: 3, total: 10, nameEn: "Science Lab", nameUr: "سائنس لیب", activities: { 'optics-1': true, 'camera-1': true, 'quiz-1': true } }
  };

  const DEFAULT_HOMEWORK = [
    { id: "hw-1", titleEn: "Trace Letter 'A' and 'B' 3 times", titleUr: "حرف 'A' اور 'B' کو 3 بار ٹریس کریں", day: "Mon", status: "Done", stars: 2, note: "Beautiful neat strokes!" },
    { id: "hw-2", titleEn: "Practice Alif se Anaar on draw board", titleUr: "ڈرا بورڈ پر 'ا' سے انار بنائیں", day: "Tue", status: "Checked", stars: 2, note: "MashAllah, very neat." },
    { id: "hw-3", titleEn: "Identify 3 red things in the home", titleUr: "گھر میں موجود 3 لال چیزیں تلاش کریں", day: "Wed", status: "Pending", stars: 0, note: "" },
    { id: "hw-4", titleEn: "Count 1 to 10 with spoon counter", titleUr: "چمچوں کے ساتھ 1 سے 10 تک گنتی گنیں", day: "Thu", status: "Pending", stars: 0, note: "" },
    { id: "hw-5", titleEn: "Say Bismillah before lunch and dinner", titleUr: "کھانے سے پہلے بلند آواز میں بسم اللہ کہیں", day: "Fri", status: "Pending", stars: 0, note: "" },
    { id: "hw-6", titleEn: "Paper sun coloring in notebook", titleUr: "کاپی پر سورج میں پیلا رنگ بھریں", day: "Sat", status: "Pending", stars: 0, note: "" },
    { id: "hw-7", titleEn: "Morning stretch with Kali", titleUr: "کلی کے ساتھ صبح کی ہلکی ورزش", day: "Sun", status: "Pending", stars: 0, note: "" }
  ];

  function getInitialState() {
    return {
      activeChildId: 'default_bud',
      children: {
        default_bud: {
          id: 'default_bud',
          nameEn: 'Little Bud',
          nameUr: 'ننھی کلی',
          avatar: '🌸',
          stars: 14,
          minutesSpent: 52,
          streakDays: 4,
          overallLevel: 2,
          sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
          homework: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK)),
          events: [
            { childId: 'default_bud', section: 'islamic', activityId: 'tauz', status: 'completed', stars: 1, minutes: 3, date: new Date().toISOString() },
            { childId: 'default_bud', section: 'tracing', activityId: 'letter-A', status: 'completed', stars: 1, minutes: 5, date: new Date().toISOString() },
            { childId: 'default_bud', section: 'exercise', activityId: 'reach-sun', status: 'completed', stars: 1, minutes: 4, date: new Date().toISOString() }
          ]
        }
      }
    };
  }

  // Load or initialize store
  let state = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? JSON.parse(raw) : getInitialState();
    if (!state.children || !state.children[state.activeChildId]) {
      state = getInitialState();
    }
  } catch (e) {
    state = getInitialState();
  }

  const subscribers = new Set();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage quota exceeded or error:', e);
    }
    notify();
  }

  function notify() {
    const child = getActiveChild();
    subscribers.forEach((fn) => {
      try {
        fn(child);
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  function getActiveChild() {
    return state.children[state.activeChildId];
  }

  // Central Progress Store API
  const NK_STORE = {
    // Subscribe to live changes
    subscribe(fn) {
      subscribers.add(fn);
      // Run once immediately with current data
      try {
        fn(getActiveChild());
      } catch (e) {}
      return () => subscribers.delete(fn);
    },

    // Get current child profile data
    getChild() {
      return getActiveChild();
    },

    // Record an activity completion event
    recordActivity({ section, activityId, stars = 1, minutes = 3, note = '' }) {
      const child = getActiveChild();
      if (!child) return;

      // Update stars & minutes
      child.stars = (child.stars || 0) + stars;
      child.minutesSpent = (child.minutesSpent || 0) + minutes;

      // Update section level & progress
      if (!child.sections[section]) {
        child.sections[section] = { level: 1, done: 0, total: 5, activities: {} };
      }
      const sec = child.sections[section];
      sec.activities = sec.activities || {};

      let isNew = false;
      if (!sec.activities[activityId]) {
        sec.activities[activityId] = true;
        sec.done = (sec.done || 0) + 1;
        isNew = true;
      }

      // Check level up
      let leveledUp = false;
      if (sec.done >= sec.total) {
        sec.level = (sec.level || 1) + 1;
        sec.done = 0;
        leveledUp = true;
      }

      // Recalculate overall level
      let totalCompleted = 0;
      for (const k in child.sections) {
        totalCompleted += Object.keys(child.sections[k].activities || {}).length;
      }
      child.overallLevel = Math.max(1, Math.floor(totalCompleted / 4) + 1);

      // Append event log
      const eventRecord = {
        childId: child.id,
        section,
        activityId,
        status: 'completed',
        stars,
        minutes,
        note,
        date: new Date().toISOString()
      };
      child.events = child.events || [];
      child.events.unshift(eventRecord);

      // Save & Notify Live
      save();

      return {
        child,
        isNew,
        leveledUp,
        newLevel: sec.level,
        overallLevel: child.overallLevel,
        stars: child.stars
      };
    },

    // Update homework task status
    updateHomework(id, status, note = '', bonusStars = 0) {
      const child = getActiveChild();
      if (!child || !child.homework) return;

      const task = child.homework.find((h) => h.id === id);
      if (task) {
        task.status = status;
        if (note) task.note = note;
        if (bonusStars > 0) {
          child.stars = (child.stars || 0) + bonusStars;
        }
        child.events.unshift({
          childId: child.id,
          section: 'homework',
          activityId: id,
          status,
          stars: bonusStars,
          minutes: 5,
          note,
          date: new Date().toISOString()
        });
        save();
      }
    },

    // Parent assigns new homework
    assignHomework({ titleEn, titleUr, day = 'Today' }) {
      const child = getActiveChild();
      if (!child) return;
      const newHw = {
        id: 'hw-' + Date.now(),
        titleEn,
        titleUr,
        day,
        status: 'Pending',
        stars: 2,
        note: ''
      };
      child.homework = child.homework || [];
      child.homework.unshift(newHw);
      save();
    },

    // Dynamic suggestions based on unfinished or lowest-progress sections
    getSuggestions() {
      const child = getActiveChild();
      if (!child) return [];

      const suggestions = [];
      const sections = child.sections || {};

      // Find lowest completed sections
      const sorted = Object.keys(sections).map((key) => ({
        key,
        ...sections[key],
        pct: (sections[key].done / (sections[key].total || 1)) * 100
      })).sort((a, b) => a.pct - b.pct);

      if (sorted.length > 0) {
        const lowest = sorted[0];
        suggestions.push({
          en: `Focus Next: ${lowest.nameEn} (Level ${lowest.level}). Complete 1 more activity to reach milestone!`,
          ur: `اگلی توجہ: ${lowest.nameUr} (لیول ${lowest.level})۔ اگلا مرحلہ حاصل کرنے کے لیے ایک اور مشق مکمل کریں۔`,
          key: lowest.key
        });
      }

      // Check homework
      const pendingHw = (child.homework || []).filter((h) => h.status === 'Pending');
      if (pendingHw.length > 0) {
        suggestions.push({
          en: `Homework alert: "${pendingHw[0].titleEn}" is waiting. Guide your child to finish it today!`,
          ur: `ہوم ورک یاد دہانی: "${pendingHw[0].titleUr}" باقی ہے۔ آج بچے کو مکمل کروائیں۔`,
          key: 'homework'
        });
      } else {
        suggestions.push({
          en: `All homework done! Spend 10 minutes reading a story together before screen time expires.`,
          ur: `تمام ہوم ورک مکمل! اسکرین ختم ہونے سے پہلے مل کر ایک کہانی پڑھیں۔`,
          key: 'stories'
        });
      }

      return suggestions;
    },

    // Upcoming topics unlocked
    getNextTopics() {
      const child = getActiveChild();
      const level = child?.overallLevel || 1;
      return [
        {
          en: `Level ${level + 1} Tracing: Urdu 2-letter connectors (با، تا، سا)`,
          ur: `لیول ${level + 1} ٹریسنگ: اردو دو حرفی الفاظ (با، تا، سا)`
        },
        {
          en: `Science Lab 2: Water refraction & bending pencils magic!`,
          ur: `سائنس لیب ۲: پانی میں پنسل مڑنے اور روشنی کے انعطاف کا جادو!`
        },
        {
          en: `Junior Mental Maths: Multiplication tables 3 and 4 challenge`,
          ur: `ریاضی چیلنج: ۳ اور ۴ کے پہاڑوں کی تیز رفتار پریکٹس`
        }
      ];
    },

    // Reset progress for testing
    reset() {
      state = getInitialState();
      save();
    }
  };

  window.NK_STORE = NK_STORE;
})();
