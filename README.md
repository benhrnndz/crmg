# 🏛️ Congressman Roy M. Gonzales — Official Website

Official website of **Congressman Roy M. Gonzales**, representing the **Lone District of Santa Rosa, Laguna** in the House of Representatives of the Philippines.

> *"Sa Bagong Kongreso, Ramdam ang Serbisyo"*

---

## 📌 Overview

A static, single-page website that serves as the online presence for the Office of Congressman Roy M. Gonzales. It highlights his political profile, accomplishments, ongoing programs, and includes a built-in **CHED TDP Scholarship Checker** for constituents.

### Key Features

- **Home** — Landing page with the Congressman's mission & vision, key stats, and brief biography
- **Accomplishments** — Vertical timeline of legislative milestones and community achievements
- **Programs** — Overview of ongoing office programs, with a dedicated section for the CHED Tulong Dunong Program (TDP) including FAQs
- **Scholarship Checker** — A floating button (bottom-right) that opens a side drawer where users can search by name or student number to check if they qualify for the CHED TDP Scholarship 2026–2027

---

## 🗂️ Project Structure

```
crmg/
├── index.html                 # Main website (self-contained HTML/CSS/JS)
├── applicants.json            # CHED TDP qualified applicants data
├── tdp_applicants.csv         # Source CSV of applicant records
├── tdp_read.py                # Python script to convert Excel → JSON
├── README.md                  # This file
└── images/
    ├── congressmanroygonzales.jpg   # Congressman's portrait
    ├── logo-santarosa.png           # City of Santa Rosa seal
    ├── logo-hor.png                 # Secondary logo
    ├── bagongkongreso.png           # Bagong Kongreso logo
    └── crmgpic1–16.png/jpg         # Activity/event photos (background collage)
```

---

## 🚀 Getting Started

No build tools, frameworks, or servers required. Just open the file in a browser.

### Option 1 — Open Directly
Double-click `index.html` or open it in any modern browser.

### Option 2 — Local Server (for JSON fetch)
Some browsers block local `fetch()` requests. If the scholarship checker doesn't load data, run a simple local server:

```bash
# Python 3
cd crmg
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 🎓 Scholarship Checker — How It Works

1. Applicant data is stored in `applicants.json` (converted from the official Excel file)
2. The floating **"Check Scholarship"** button (bottom-right corner) opens a side drawer
3. Users type their **registered name** or **exact student number** (minimum 4 characters)
4. Matching qualified applicants appear with a green **"Qualified"** badge
5. The search checks against `first_name`, `middle_name`, `last_name`, and `student_num` fields

### Updating Applicant Data

1. Update the source Excel file
2. Run the conversion script:
   ```bash
   python tdp_read.py
   ```
3. This regenerates `applicants.json` with the latest records

---

## ✏️ Customization Guide

All placeholder content is marked with `[Placeholder]` in the HTML. To personalize:

| Section | What to Update |
|---------|---------------|
| **Hero Banner** | Title, tagline, background photo |
| **Mission & Vision** | Replace placeholder paragraph |
| **Key Stats** | Update numbers (Projects, Bills, Beneficiaries) |
| **About the Congressman** | Replace bio text |
| **Accomplishments Timeline** | Replace placeholder milestones with real achievements |
| **Programs** | Update program descriptions (keep CHED TDP as-is or modify) |
| **Footer** | Office address, phone, email, Facebook link, office hours |
| **Images** | Replace photos in `images/` folder |

---

## 🎨 Design & Tech

### Built With
- **HTML5** / **CSS3** / **Vanilla JavaScript** — no frameworks, no dependencies
- **Google Fonts** — [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) (headings) + [Inter](https://fonts.google.com/specimen/Inter) (body)

### Visual Features
- Interactive particle canvas (mouse-reactive)
- Animated gradient blobs and ambient glow effects
- Background photo collage with fade overlays (visible on wide screens)
- Glassmorphic cards with backdrop blur
- Scroll-reveal animations (IntersectionObserver)
- 3D card tilt effect on scholarship results
- Smooth page transitions with ripple feedback
- Fully responsive (mobile → desktop)

### Color Scheme
| Token | Value | Usage |
|-------|-------|-------|
| `--red` | `#C8102E` | Primary accent |
| `--red-deep` | `#9E0B23` | Gradients, active states |
| `--red-soft` | `#FDF1F4` | Light backgrounds, badges |
| `--ink` | `#1f2430` | Primary text |
| `--ink-soft` | `#5e6472` | Secondary text |

---

## 📱 Browser Support

Tested and works on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)
- Mobile browsers (Chrome/Safari on iOS/Android)

---

## 📄 License

This project is for the exclusive use of the **Office of Congressman Roy M. Gonzales, Lone District of Santa Rosa, Laguna**.

---

*Developed for the Office of Congressman Roy M. Gonzales*
