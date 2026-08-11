# Sonique Frontend — Agent Instructions

## 1. Project Identity

This is the frontend for **Sonique**, a music identity and compatibility platform.

The frontend consumes an existing Spring Boot backend.

The backend is the source of truth for:
- available features
- API capabilities
- request/response data
- authentication behavior
- compatibility data
- profile data

The frontend must present and visualize what the backend actually provides.

Do not invent backend capabilities to make a screen appear more complete.

---

## 2. Project Boundary

The frontend lives strictly inside:

`sonique-frontend/`

Do not create frontend files, configuration, assets, or projects outside this directory.

Do not modify the Spring Boot backend unless explicitly requested.

Do not create another repository or initialize another Git repository.

---

## 3. Existing Technology

Use the existing frontend stack.

Current foundation:
- React
- Vite
- TypeScript
- Tailwind CSS
- Native `fetch` for API communication

Prefer existing dependencies and components.

Do not introduce a new library when the existing stack can reasonably solve the problem.

Do not introduce state-management libraries, UI frameworks, animation libraries, or other infrastructure without a genuine implementation need.

---

# 4. Sonique Design System

The existing Login/Register page establishes the visual identity of the application.

Every future page must look like a natural continuation of that design.

### Visual character

Sonique should feel:

- modern
- expressive
- futuristic
- music-oriented
- confident
- visually interesting
- polished
- slightly unconventional

The design can be bold and creative, but creativity must remain within the established Sonique visual language.

Do not make every page look identical.

Pages may have different compositions and visual treatments where appropriate, while still clearly belonging to the same design system.

---

## 5. Global Visual Rules

Maintain consistency in:

- dark-only theme
- background treatment
- typography hierarchy
- font choices
- neon lime as the primary accent
- restrained supporting accent colors
- spacing scale
- responsive sizing
- border treatment
- button language
- input language
- card/panel language
- corner/radius philosophy
- shadows and glow treatment
- animation style
- visual density

Reuse existing design tokens and components whenever possible.

Do not create a new color palette for individual pages.

Do not introduce light mode.

Do not randomly change typography between pages.

Do not introduce unrelated visual motifs simply because a new page needs decoration.

---

# 6. Visual Creativity

The frontend should NOT feel generic.

Use visual elements when they improve the experience.

Appropriate Sonique-native visuals include:

- abstract waveforms
- frequency patterns
- audio-reactive-looking geometry
- gradients
- subtle grain/noise
- geometric compositions
- data-inspired visualizations
- tasteful motion
- large expressive typography
- layered shapes and panels

Visual elements should have a relationship to music, identity, listening, or compatibility.

Decorative elements should support hierarchy rather than compete with actual information.

---

# 7. No Random Images

Do not add:

- stock photographs
- random music photography
- AI-generated artist imagery
- random album covers
- fake Spotify artwork
- unrelated illustrations
- external image assets merely to fill empty space

The backend does not provide artist images, album artwork, or image URLs.

If a visual is needed, prefer CSS/SVG/HTML-based abstract visuals.

Never invent image data from the API.

---

# 8. Backend Contract Is Authoritative

Before implementing a page, inspect the existing frontend API contract and/or backend DTOs when necessary.

Only display information that is actually available from the backend.

Do not invent:

- API endpoints
- DTO fields
- statistics
- metrics
- compatibility categories
- user information
- Spotify information
- social features
- account capabilities
- profile fields
- recommendation features

If the backend does not provide a piece of information, do not fabricate it.

If a design concept requires information that does not exist in the API, redesign that part of the UI around information that does exist.

Do not modify the backend simply to satisfy a frontend design idea unless explicitly instructed.

---

# 9. API Integration

Use the existing API abstraction rather than making ad-hoc fetch implementations throughout components.

All authenticated requests must use the existing JWT mechanism.

Respect the exact request and response structures provided by the backend.

Handle:

- loading states
- successful responses
- empty states
- validation errors
- authentication errors
- API failures
- unavailable data

Do not silently replace missing backend data with fake values.

If a value is nullable, design the UI to handle the null case gracefully.

---

# 10. Authentication

The backend authentication contract is:

### Register

`POST /auth/register`

Fields:

- email
- username
- displayName
- password

### Login

`POST /auth/login`

Fields:

- email
- password

Successful login returns a JWT.

Do not add unsupported authentication features such as:

- Google login
- Apple login
- OTP
- password reset
- phone authentication
- additional registration fields

The existing authentication UI is considered approved unless a specific bug or usability issue is being fixed.

Do not redesign it during unrelated page work.

---

# 11. Page Design

Each page should be designed around its actual purpose.

Do not force every page into the same card grid.

Use the most appropriate composition for the information being presented.

For example:

- identity information can use large typography and expressive sections
- statistics can use large numbers
- ranked data can use structured rows
- compatibility can use visual comparison
- onboarding can use focused calls to action

The visual hierarchy should make the most important information immediately obvious.

---

# 12. Data Visualization

When displaying backend metrics:

- use the actual values
- label them accurately
- preserve their meaning
- choose a visualization appropriate to the metric

Do not create visualizations for metrics that don't exist.

Do not rename backend concepts into unrelated concepts that change their meaning.

Do not create fake scores simply because the design would look better with another number.

---

# 13. Compatibility

Compatibility is based on the actual `CompatibilityResponse`.

Available concepts include:

- overall compatibility
- listening style compatibility
- musical taste compatibility
- exploration
- artist diversity
- average track age
- dominant time window
- shared genres
- shared musical traits
- shared vocal characteristics
- unique preferences
- match type
- preference ownership
- Gemini-generated summary

Do NOT invent compatibility concepts such as:

- rhythm alignment
- vocal texture
- personality compatibility
- musical chemistry
- social match prediction
- primary divergence
- other unsupported scores

The Gemini summary is a generated explanation of the compatibility result, not another compatibility metric.

---

# 14. Loading & Motion

Motion should make the interface feel alive without becoming distracting.

Use animation intentionally for:

- page transitions
- data reveals
- compatibility score presentation
- loading experiences
- progress/analysis states
- subtle hover interactions

Do not animate every element.

Avoid excessive bouncing, spinning, flashing, or unnecessary transitions.

For compatibility analysis, the backend does not expose individual calculation progress.

Therefore any multi-stage compatibility loading sequence is PRESENTATIONAL ONLY.

Never imply that the backend is actually reporting those individual stages.

---

# 15. Loading States

Every API-driven page should have a deliberate loading state.

Loading states should:

- match the Sonique visual language
- communicate that data is being retrieved or processed
- avoid fake claims about what the backend is currently doing

For example, a compatibility loading animation may present an atmospheric analysis sequence, but it must not falsely imply that the backend exposes real-time progress for each stage.

---

# 16. Empty & Error States

Empty data is a valid state.

Design intentional empty states rather than filling missing information with invented content.

Examples:

- profile not generated
- no listening history
- no shared preferences
- no unique preferences
- nullable profile fields
- Gemini summary unavailable

Error messages should be understandable to the user.

Do not expose stack traces or raw internal exceptions.

Do not invent error semantics that the backend does not provide.

---

# 17. Responsive Design

The frontend must work across:

- desktop
- laptop
- tablet
- mobile

Do not design around a single screenshot size.

Use responsive layouts, flexible containers, appropriate max-widths, and responsive typography.

Do not allow desktop compositions to become unusable on mobile.

---

# 18. Component Reuse

Prefer reusable components when the same visual pattern appears multiple times.

Examples may include:

- buttons
- inputs
- section headings
- stat displays
- metric visualizations
- preference tags
- ranked rows
- loading visuals
- error states

Do not create an abstraction merely for the sake of abstraction.

Use components where reuse or clarity genuinely benefits the implementation.

---

# 19. Code Quality

The frontend should be production-quality for the scope of this project.

Prioritize:

1. Correct API integration
2. Accurate representation of backend data
3. Clean component structure
4. Responsive behavior
5. Consistent visual language
6. Good UX
7. Maintainability
8. Performance

"Do not over-engineer" means avoid unnecessary architecture.

It does NOT mean:
- skip error handling
- skip responsive behavior
- create disposable code
- hardcode API responses
- ignore edge cases
- produce a low-quality UI

Build the simplest implementation that is still clean, polished, and reliable.

---

# 20. Anti-Hallucination Rule

When a requirement is unclear:

**Do not guess a product feature.**

First inspect:
- existing frontend code
- existing components
- API contract
- backend DTOs when available
- existing design patterns

If the required information still does not exist, choose the closest design that can be supported by the existing system.

Do not invent functionality just to make the interface look richer.

---

# 21. Scope Discipline

Sonique is currently being completed as a focused project/demo.

Do not expand the product scope.

Do not add:

- social feeds
- followers
- friend systems
- messaging
- playlists
- music playback
- recommendations
- profile editing
- password management
- user discovery
- subscription systems
- unsupported Spotify features

unless explicitly requested.

Focus on implementing the existing Sonique experience exceptionally well.

---

# 22. Before Implementing Any New Page

Always follow this order:

1. Understand the page's purpose.
2. Identify the exact backend data available.
3. Reuse the existing Sonique design language.
4. Decide the visual hierarchy.
5. Implement the smallest clean architecture required.
6. Handle loading, empty, and error states.
7. Verify responsive behavior.
8. Run the frontend build.
9. Only then consider minor visual refinements.

Do not start by inventing UI content and work backwards toward an API.

---

# 23. Final Principle

**Build what Sonique actually is, not what a generic music app might be.**

The frontend should be visually ambitious and polished while remaining completely grounded in the real Sonique backend.

When choosing between:

- a visually impressive feature that requires invented data

and

- a visually impressive implementation of real Sonique data

always choose the second.