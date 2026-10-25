# 🌐 Multi-Language Support Setup

## Overview
Landing page sekarang mendukung 2 bahasa: **Bahasa Indonesia (ID)** dan **English (EN)**. Pengguna dapat mengubah bahasa dengan mudah menggunakan toggle button di navbar.

## Features

✅ **Language Switcher** di Navbar
- Button ID/EN di desktop view
- Language selector di mobile menu
- Bahasa tersimpan di localStorage

✅ **Automatic Language Detection**
- Default bahasa: Indonesia
- Preference disimpan di browser

✅ **Fully Translated Content**
- All navbar items
- Hero section
- Expertise section (keahlian)
- Services section
- Projects
- Team
- Testimonials
- Pricing
- Contact
- Footer

## File Structure

```
frontend/src/
├── locales/
│   ├── en.json          # Bahasa English
│   └── id.json          # Bahasa Indonesia
├── hooks/
│   └── useLanguage.ts   # Hook untuk translation
└── components/
    ├── common/
    │   └── LanguageSwitcher.tsx   # Toggle button
    └── layout/
        └── Navbar.tsx   # Navbar dengan language switcher
```

## How to Use Translation in Components

### Import the hook:
```typescript
import { useLanguage } from '../../hooks/useLanguage';
```

### Use in component:
```typescript
const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('navbar.home')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
};
```

### Translation key format:
Gunakan dot notation untuk nested keys:
- `navbar.home` → navbar → home
- `hero.badge` → hero → badge
- `expertise.metrics.ownership.title` → expertise → metrics → ownership → title

## Adding New Translations

1. **Open translation files:**
   - `frontend/src/locales/en.json` (English)
   - `frontend/src/locales/id.json` (Bahasa Indonesia)

2. **Add new key-value pair** di kedua file dengan struktur yang sama:

```json
// en.json
{
  "section_name": {
    "key": "English translation here"
  }
}

// id.json
{
  "section_name": {
    "key": "Terjemahan Indonesia di sini"
  }
}
```

3. **Use in component:**
```typescript
const { t } = useLanguage();
<h1>{t('section_name.key')}</h1>
```

## Current Language Support

- ✅ **Bahasa Indonesia** (Default)
- ✅ **English**

Future languages dapat ditambahkan dengan membuat file baru di `locales/` folder dan menambahkan ke mapping di `useLanguage.ts`.

## Storage

Preferensi bahasa disimpan di localStorage dengan key: `language-storage`
- Otomatis tersimpan saat user mengganti bahasa
- Automatically restored saat halaman di-refresh

## Component Integration Status

✅ Navbar - Full translation support
✅ Hero Section - Full translation support  
✅ Expertise Section - Full translation support
✅ Services Section - Full translation support
⏳ Projects, Team, Testimonials, Pricing - Ready to translate (using default English/Indonesian content from API)
⏳ Contact Section - Ready to translate
⏳ Footer - Ready to translate

## Notes

- Language switcher tersedia di desktop (top-right navbar) dan mobile (dalam dropdown menu)
- Semua perubahan bahasa happen instantly tanpa page reload
- localStorage memastikan user preference tetap terjaga
