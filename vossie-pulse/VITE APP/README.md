# Pulse: Student Wellbeing & Connection Platform

## Overview
Pulse is a comprehensive, mobile-first web application designed specifically for Eduvos students. It serves as a gentle, non-clinical companion that encourages regular mindfulness, active participation in campus life, and emotional self-reflection through daily check-ins, gamified "House" systems, and AI-powered personalized insights.

## Core Features

### 📅 Daily Check-ins & Reflection
- **Interactive Mood Tracking:** Users can log their daily emotional wellbeing using an intuitive, animated 5-emoji rating system.
- **Dynamic Prompts:** Depending on the selected mood and specific tags (e.g., "Academic Stress", "Social Life", "Burnout"), Pulse surfaces thoughtful, dynamically adapted questions (e.g., "What specific academic task is causing the most stress right now?").
- **Streak Tracking:** Checking in consecutively builds a streak, fostering positive habit formation.

### 🏠 Social Houses & Gamification
Aligned with the Eduvos community structure, students join one of six Social Houses during onboarding:
- **LEFATSHE (Earth):** Grounding and stability.
- **LESEDI (Light):** Hope, joy, and unity.
- **MOYO (Fire):** Heart, passion, and purpose.
- **PULA (Water):** Harmony, renewal, and adaptability.
- **SERITI (Heart):** Honour, integrity, and legacy.
- **UMOYA (Wind):** Movement, discovery, and connection.

Users earn House Points by completing daily challenges, maintaining check-in streaks, and reflecting, fostering healthy, collective competition across campuses.

### 🌟 AI-Powered Dashboard Insights
- **Personalized Observations:** Powered by Google's Gemini API, the dashboard provides daily, personalized, non-diagnostic wellbeing insights based on the student's latest check-in and recent pattern.
- **Adaptive Empathy:** If the user logs a positive day, the AI warmly reaffirms and celebrates their joy based on specific tags (e.g., spending time with friends). If the user logs a neutral or difficult day, the AI offers 2-3 gentle, actionable suggestions tailored to their challenges.
- **Daily Quotes:** Each user is greeted with a uniquely generated, daily motivational quote tied to their profile seed.

### 🏆 House Achievements & Badges
- **Milestone Badges:** Users earn digital stickers or badges when they reach specific milestones—such as their first check-in, first written reflection, or 10-day streaks.
- **Dashboard Showcase:** Earned badges are beautifully showcased in a dynamic, scrollable section on the Dashboard, instilling a sense of progression and House pride.

### 🎯 Daily Challenges
- **Dynamic Challenge Pool:** Challenges rotate daily and are dynamically seeded for each user based on their name and the current date.
- **Action-Oriented Engagement:** Examples include "5 Day Check-In Streak", "Deep Reflection", "Explore Support", "House Pride", and "History Review". These challenges are verifiable within the application, automatically marking themselves complete as the user navigates and interacts with the platform.

### 🆘 Support & Resources
A dedicated support hub that connects students strictly to verifiable campus resources:
- **Emergency Interjection System:** The check-in reflection field actively monitors for critical emergency keywords (e.g., suicide, self-harm). If flagged, the normal flow immediately halts, rendering a red emergency screen. The system refuses to provide generalized advice for dire circumstances, instead unconditionally displaying the SADAG 24/7 hotline (0800 567 567) and Campus Counseling links.
- **Campus Counseling Center:** Quick access and direct modal contact details for Eduvos counselors (Savannah Naick and Babalo Lutholi).
- **Stress Management Tips:** Modal providing quick links to essential PDF wellness resources (Wellness Guide, Stress Control Tips, Mindfulness Exercises, Problem Solving).
- **Proactive Early Warning:** If a user reports consecutive "Difficult" days, the Support page gently escalates an embedded suggestion to connect with a counselor.

## Technical Architecture

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS with utility-first responsive design, leveraging `motion/react` for fluid, native-feeling micro-interactions (e.g., spring-based scaling on mood emojis).
- **Icons & UI:** Lucide React for consistent vector iconography.
- **Backend Model Setup (Node/Express):** Uses a local Express server mapped to Vite (`server.ts`) operating dynamically to handle the `GoogleGenAI` prompts server-side, hiding API keys and acting as a proxy for the Insight generations.
- **State Management:** React Context API with seamless `localStorage` persistence (`pulse_app_state`).
- **Deployment Build:** Runs `vite build` concatenated with `esbuild` to compile a single, container-ready `server.cjs` bundle.

## AI Prompt Engineering Design

### Wellbeing Insights Prompt Strategy
The underlying Gemini prompt is explicitly engineered to remain **observational and supportive**, actively instructed to avoid diagnostic language.

```text
You are a supportive, calm wellbeing companion for a university student named {User's Name}.
Based on their latest check-in and recent pattern:
- CRITICAL EMERGENCY: If any of their recent reflections contain words like "suicide" or express dire circumstances, DO NOT offer any advice or suggestions. Mute all normal responses and answer ONLY with exactly: "We are deeply concerned about you. Please reach out to SADAG immediately at 0800 567 567..."
- If good/great: warmly reaffirm them and celebrate their positive day.
- If neutral/difficult: offer 2 to 3 gentle, practical, actionable suggestions tailored to their challenges.
Do not diagnose and do not give medical advice. Keep it concise, friendly, and conversational. 

Recent check-ins (1=very difficult, 5=great, with tags, date, and their text reflection):
[{ JSON Payload of the last 14 days }]
```

### Dynamic Reflection Prompts (Frontend Logic)
```typescript
if (mood <= 2 && tags.includes('Academic Stress')) {
  return "What specific academic task is causing the most stress right now?";
}
if (mood >= 4 && tags.includes('Social Life')) {
  return "What made your social interactions so positive today?";
}
```

## Setup & Local Development

1. **Environment Initialization**
   Ensure dependencies are installed:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`.
   Requires `GEMINI_API_KEY` to run the Insight Generators.

3. **Running the Dev Server**
   Start both the Vite dev server and proxy backend concurrently:
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm run start
   ```

## Design Philosophy

- **Anti-Clinical / Anti-Slop:** Uses elegant, literal, and friendly terminology rather than highly technical or clinical phrasing (e.g., "Pulse" over "Biometric Monitor", "Check-in" over "Assessments").
- **Fluid Animation:** Emojis spring to life on click, challenge progress bars glide smoothly, and screens cross-fade seamlessly ensuring the application itself feels calming and reliable to interact with.
- **Color & Vibe:** Soft pastels, clean whites, and distinct accent colors assigned dynamically per House.
