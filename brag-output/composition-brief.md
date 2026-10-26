# Hyperframes Composition Brief: FixLanka

## Objective
Create a 20-second vertical launch brag video for FixLanka — Sri Lanka's bilingual technician directory. Warm, community-first, real product shown in use.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: vertical — 1080×1920
- Duration: 20 seconds

## Source Material
- Project root: `d:/projects/FixLanka`
- Primary files read: `src/messages/en.json`, `src/components/HomePage.tsx`, `src/components/TechnicianCard.tsx`, `src/components/CategoryCard.tsx`, `src/app/globals.css`, `README.md`
- Product name: FixLanka
- Tagline / strongest claim: "Find trusted technicians near you"
- Key UI to recreate: category chip grid (colored icons) + technician card (gradient avatar, verified badge, price, WhatsApp button)
- Copy that must appear verbatim:
  - "Your AC broke at midnight."
  - "One tap. Fixed."
  - "Find trusted technicians near you."
  - "FixLanka"
  - "Free. Direct. Local."
  - "From LKR 2,500"

## Creative Direction
- Tone preset: default
- Creative direction: warm community app launch — local, real, no puff
- Interpretation: comfortable 20s pace; music bed warm and upbeat; each card arrival is a small reward; voiceover is the primary storytelling thread, visuals support it
- Angle: Sri Lanka has no good way to find a local technician — FixLanka fixes that with one tap
- Hook: "Your AC broke at midnight." slams in on dark navy
- Outro / punchline: "Free. Direct. Local." under the FixLanka wordmark
- Avoid:
  - Generic SaaS language (no "streamline your workflow")
  - Abstract filler (no color washes, particle clouds)
  - Unrelated visual redesign

## Visual Identity
- Background: #0F172A (dark navy)
- Text: #FFFFFF on dark; #0F172A on white cards
- Accent: #2563EB (blue primary)
- Category chip colors: Plumbing #2563EB, Electrical #EAB308, AC #0EA5E9, Appliances #7C3AED, HomeRepairs #F97316, Painting #F43F5E, Phone #10B981, Cleaning #14B8A6
- Gradient avatars: blue-to-blue-700 for "KP" (Kamal Perera)
- Display font: Archivo Black (weight 900, letter-spacing -0.02em)
- Body font: Archivo (weight 400–700)
- Visual references: dot-grid hero + blue radial glow, colored category icon chips with rounded container, gradient avatar cards, solid blue pill CTA

## Storyboard
Use `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 3s — "Your AC broke at midnight." slams on dark navy
2. Release — 2s — "One tap. Fixed." with blue underline pulse on "Fixed"
3. Category Grid — 5s — White panel, 8 chips arrive beat-synced, Electrical selected
4. Technician Card — 5s — Kamal Perera card lifts in, cursor taps WhatsApp
5. Outro — 5s — "Find trusted technicians near you." / FixLanka / "Free. Direct. Local."

## Voiceover
Voice is enabled. Generate with Kokoro:

```bash
npx hyperframes tts "Your AC broke at midnight. One tap. Fixed. FixLanka — Sri Lanka's trusted technician directory. Eight services. Twenty-five districts. Find a plumber, electrician, or AC tech near you — see their price, call or WhatsApp directly. Free. Direct. Local. FixLanka." \
  --voice af_heart \
  --output brag-output/composition/assets/voiceover.wav
```

Wire as:
```html
<audio id="vo" data-start="0" data-track-index="3" data-volume="1" src="assets/voiceover.wav"></audio>
```

After generating, check WAV duration and flex scene `data-duration` values to match the narration timing. Keep total within 20s; trim script and regenerate if it overruns.

Music ducks to 0.13 for the voiceover duration, then returns to 0.32.

## Audio
- Audio role: warm upbeat bed; voiceover primary; SFX motion-matched
- Audio arc: music fades in on Scene 1, ducks under VO throughout, brief lift at Scene 5 logo, then fades last 1.5s
- Music: `assets/music/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3`
- Music treatment: start at 0s, volume 0.32 (duck to 0.13 during VO), fade out from ~18.5s to 20s
- Music cue guidance: bundled preset at `.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-9-by-ende-dot-app.music-cues.json`. Strong cues in window: 4.23s, 6.34s, 10.54s, 12.65s. Beat grid ~0.52s intervals. Use 4.23s for hook text reveal, 6.34s for first chip arrival, 10.54s for card reveal, 17.38s for logo slam.
- Audio-reactive treatment: subtle; hero dot-grid glow and technician card background presence breathe gently with music RMS; no waveform or equalizer visuals
- Audio-coupled moments:
  - Scene 1 hook text slam → `impact/impactSoft_medium_001.ogg` at 0.05s (track-index 11)
  - Scene 3 chip arrivals → alternate `interface/drop_001.ogg` / `interface/drop_002.ogg`, beat-grid 6.34–7.92s (track-index 12–15)
  - Scene 4 card arrival → `casino/card-place-1.ogg` at ~10.40s (track-index 16)
  - Scene 4 WhatsApp tap → `interface/bong_001.ogg` at ~14.22s (track-index 17)
  - Scene 5 logo slam → `impact/impactBell_heavy_000.ogg` at ~17.38s (track-index 18)
- SFX selection guidance: use drop sounds for soft chip pop-ins; card-place for the card reveal; bong for the WhatsApp success moment; bell for the logo. All at 0.65–0.75 volume.
- SFX analysis guidance: `.agents/skills/brag/assets/sfx/sfx-analysis.md` — prefer low HF-risk files
- Exact SFX choice: Hyperframes should choose exact filenames, timestamps, density, and volume based on the implemented animation
- Audio files: already copied into `brag-output/composition/assets/`

## Hyperframes Instructions
Load `hyperframes`, `hyperframes-registry`, `media-use`, `hyperframes-cli`.
Skip storyline step, skip `references/types/*`, `references/story.md`, `SPEC.md`, `usage`, `history`, `feedback`, `REVIEW.md`.
This brief and `brag-output/brag-plan.md` are the contract.

Requirements:
- Vertical 1080×1920
- Show at least one real UI element from the source (category chips + technician card)
- Keep all text readable — especially the voiceover-timed copy
- Total 20s; flex scene durations to match generated voiceover WAV
- Music bed present with ducking during VO
- Beat-grid chip arrivals in Scene 3 (4 individual, 4 grouped)
- Simulated cursor tap on WhatsApp button in Scene 4
- Audio-reactive glow on dot-grid hero and card presence
- Run `npx hyperframes check` inside `brag-output/composition/` before render
- Render to `brag-output/brag.mp4`
