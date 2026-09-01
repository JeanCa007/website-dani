# Daniel Alvarez Ramirez Portfolio

## 1. Project Description
Academic portfolio website for Daniel Alvarez Ramirez, a professor/researcher. The site features a clean, modern, and professional design with multilingual support (English primary, Spanish secondary). Includes a maintenance/admin panel to manage all content dynamically, including photo uploads and text editing.

## 2. Page Structure
- `/` - Home / Welcome page with bio, photo, research interests, and recent notes & resources
- `/cv` - CV / Resume with education and experience (stub)
- `/research` - Research interests and projects (stub)
- `/notes-resources` - Notes and Resources (course notes, book problem solutions, attached links & files)
- `/teaching` - Teaching experience and courses (stub)
- `/contact` - Contact information and form (stub)
- `/admin` - Maintenance panel to edit all site content (Phase 3)

## 3. Core Features
- [x] Multilingual support (i18n) with English as primary and Spanish as secondary
- [x] Modern responsive design with dark header and clean layout
- [x] Admin panel with content management for all pages (Phase 3)
- [x] Photo upload functionality in the admin panel (Phase 3)
- [x] Dynamic content loading from database (profile, notes_resources)
- [x] Social media links and academic profiles (Google Scholar, ORCID, LinkedIn)
- [x] Contact form (Phase 3)

## 4. Data Model Design

### Table: profile
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| full_name | text | Full name |
| photo_url | text | Profile photo URL (Storage) |
| email | text | Contact email |
| institution | text | Current institution |
| position | text | Current position |
| location | text | Location |
| bio_en | text | Bio in English |
| bio_es | text | Bio in Spanish |
| research_interests | jsonb | Array of research topics |
| social_links | jsonb | JSON with social media URLs |
| updated_at | timestamptz | Last update time |

### Table: site_content
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| page | text | Page identifier (home, cv, research, notes-resources, teaching, contact) |
| language | text | Language code (en, es) |
| content | jsonb | JSON content for the page |
| updated_at | timestamptz | Last update time |

### Table: notes_resources
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| course | text | Course or book name (free text) |
| title | text | Note / solution title |
| content | text | Note body or problem solution |
| resources | jsonb | Array of {label, url} links |
| files | jsonb | Array of {name, url} uploaded files |
| sort_order | int | Display order |
| created_at | timestamptz | Created timestamp |

### Table: cv_entries
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| type | text | education / experience / award |
| title | text | Entry title |
| organization | text | Organization/institution |
| period | text | Time period |
| description | text | Description |
| sort_order | int | Display order |

### Table: research_projects
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | Project title |
| description_en | text | English description |
| description_es | text | Spanish description |
| image_url | text | Project image |
| period | text | Time period |
| tags | jsonb | Array of tags |
| sort_order | int | Display order |

### Table: teaching_courses
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Course name |
| code | text | Course code |
| semester | text | Semester |
| level | text | Level (Undergraduate/Graduate) |
| description_en | text | English description |
| description_es | text | Spanish description |
| sort_order | int | Display order |

## 5. Backend / Third-party Integration Plan
- [x] Database: SaaS Supabase - stores profile, notes_resources, cv_entries, research_projects, teaching_courses
- [x] Storage: SaaS Supabase Storage - profile-photos bucket for photo upload
- [x] Email: Contact form (built-in Form)
- [x] Auth: Supabase Auth for admin authentication
- No Shopify, Stripe, or other payment needed

## 6. Development Phase Plan

### Phase 1: Home Page & Design System ✅ COMPLETE
- [x] Create database schema (profile, notes_resources)
- [x] Seed initial data with profile and notes_resources
- [x] Set up RLS policies for public read and admin write
- [x] Configure StyleSystem with warm terracotta/sage palette and Cormorant/Inter fonts
- [x] Implement i18n with EN (primary) and ES (secondary)
- [x] Build Navbar with sticky dark header, mobile hamburger, language switcher
- [x] Build Footer with dynamic academic links from profile
- [x] Build Home page: Hero section (name, photo placeholder, bio, social links, CTA)
- [x] Build Home page: Research interests as pill tags
- [x] Build Home page: Recent notes & resources cards from database
- [x] Configure router with all routes

### Phase 2: Content Pages ✅ COMPLETE
- [x] Build CV page with education, experience, and awards (timeline layout)
- [x] Build Research page with projects and interests
- [x] Build Teaching page with courses
- [x] Build Notes and Resources page with search

### Phase 3: Contact & Admin Panel ✅ COMPLETE
- [x] Create admin authentication (Supabase Auth)
- [x] Build admin login page
- [x] Build admin dashboard to edit profile (name, position, bio, social links)
- [x] Build admin photo upload (profile-photos Storage bucket)
- [x] Build admin notes & resources manager (CRUD with links + file upload + reorder)
- [x] Build admin CV manager (CRUD)
- [x] Build admin research projects manager (CRUD)
- [x] Build admin teaching courses manager (CRUD)
- [x] Build Contact page with working form (built-in Form)

### Phase 4: Polish & SEO ✅ COMPLETE
- [x] Add SEO meta tags (title, description, keywords, Open Graph, Twitter cards)
- [x] Add fade-in-up entrance animations
- [x] Hover transitions and loading skeletons throughout
- [ ] Test all responsive breakpoints
- [ ] Final accessibility audit
- [ ] Performance optimization