# Quran Ayah Studio

A production-oriented, dependency-free web application for retrieving Quran ayahs from a structured API, verifying them, generating deterministic Islamic designs, and exporting native-resolution PNG/JPEG/WebP artwork.

## Run locally

Serve this directory with any static HTTP server. A service worker and API calls require HTTP(S) rather than `file://` in most browsers.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Architecture

```text
Structured Quran API
        ↓
Reference parser + validation
        ↓
Immutable Ayah object + SHA-256
        ↓
Deterministic design engine
        ↓
Native-size Canvas renderer
        ↓
Export verification
        ↓
PNG / JPEG / WebP
```

The browser never asks an AI model to generate, rewrite, translate, spellcheck, or repair Quran Arabic.

## Quran data and licensing notes

Arabic retrieval uses Al Quran Cloud's `quran-uthmani` structured edition. The app verifies the returned surah/ayah identity, requires non-empty text, and calculates SHA-256 over the exact returned Arabic string before it is marked `verified=true`.

Translations are retrieved as named editions and the selected edition is shown in the UI. Translation licensing varies by edition and deployment; review the selected source's terms before redistribution or commercial use.

The Tanzil Project states that its Quran text may be used in websites/applications when reproduced verbatim, with attribution and a link to Tanzil. The app's architecture follows the same immutability principle: text data and visual layout state are separate.

Font strategy: Amiri Quran and Amiri are offered as Arabic display fonts. Amiri is distributed under the SIL Open Font License; Amiri Quran is also available under OFL 1.1.

## Important production hardening

For a commercial deployment that needs an explicit content license, plug a server-side licensed provider into the `api()` function rather than exposing provider credentials in the browser. The client contains no secret API keys.

For strict SEO indexing of every dynamic `/quran/:surah/:ayah` route, deploy behind a server-rendered framework or pre-render route pages during build. The client app already exposes canonical reference state via `?ref=2:255`.
