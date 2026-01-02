# UE PO Translator

**AI-powered translation tool for Unreal Engine localization (.po) files**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**English** | [한국어](./README.md)

Upload `.po` files, translate with AI, review, and download.

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/genorca/ue-po-translator.git
cd ue-po-translator

# Install dependencies
npm install
```

### API Key Setup

**Option A: Environment Variable (Recommended)**

```bash
cp .env.example .env
# Open .env and add your VARCO API key
```

```env
VARCO_API_KEY=your_api_key_here
VARCO_GAME_CODE=linw
```

**Option B: Web UI**

Skip environment setup and enter your personal API key in Settings.

### Run Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload** - Drag & drop or click to select a .po file
2. **Translate** - Click "Translate All" to auto-translate untranslated entries
3. **Review** - Check and edit translation results in the table
4. **Download** - Download translated .po file
5. **Import** - Import in UE Localization Dashboard

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE](LICENSE) for details.
