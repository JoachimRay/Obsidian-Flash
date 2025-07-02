# ObsidianFlash 🧠⚡

An AI-powered flashcard generator that creates perfectly formatted flashcards for Obsidian's Spaced Repetition plugin. Transform any text into study materials instantly with GPT-4 intelligence.

![ObsidianFlash Logo](public/Obsidian_Flash.png)

## 🌟 Features

- **AI-Powered Generation**: Uses OpenAI GPT-4o to create intelligent flashcards
- **Obsidian Compatible**: Perfect formatting for Spaced Repetition plugin
- **Multiple Formats**: One-way (?), reversible (??), and cloze deletion flashcards
- **Smart Context**: Vector search integration with Supabase for relevant content
- **History Management**: Save, preview, and organize your flashcard collections
- **Professional UI**: Clean, modern interface with intuitive navigation
- **Instant Export**: Copy to clipboard or download as markdown files

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- Supabase account (optional, for enhanced context)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/obsidianflash.git
   cd obsidianflash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How It Works

1. **Input Content**: Paste any text content (notes, articles, concepts)
2. **AI Processing**: GPT-4 analyzes and creates appropriate flashcards
3. **Smart Formatting**: Automatic post-processing ensures Obsidian compatibility
4. **Review & Export**: Copy, download, or save to history

### Example Input:
```
Photosynthesis is the process by which plants convert sunlight, 
carbon dioxide, and water into glucose and oxygen using chlorophyll.
```

### Generated Flashcards:
```markdown
What is photosynthesis
?
The process by which plants convert sunlight, CO2, and water into glucose and oxygen

---

Photosynthesis
??
Process where plants use chlorophyll to convert sunlight, CO2, and water into glucose and oxygen
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **AI**: OpenAI GPT-4o
- **Database**: Supabase with pgvector
- **Storage**: LocalStorage for history
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
obsidianflash/
├── app/
│   ├── page.tsx              # Main input interface
│   ├── results/page.tsx      # Flashcard display
│   ├── history/page.tsx      # History management
│   └── api/route/route.ts    # AI processing endpoint
├── prompts/
│   └── system-prompt.md      # AI instruction set
├── utils/
│   └── prompts.ts           # Prompt utilities
├── public/                  # Static assets
└── scripts/
    └── add-test-data.js     # Supabase setup
```

## ⚙️ Configuration

### OpenAI Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env.local` as `OPENAI_API_KEY`

### Supabase Setup (Optional)
1. Create project at [Supabase](https://supabase.com/)
2. Run the SQL from `supabase-setup.sql`
3. Add credentials to `.env.local`

## 🎯 Flashcard Types

### One-way Flashcards (?)
```markdown
Question
?
Answer
```

### Reversible Flashcards (??)
```markdown
Term
??
Definition
```

### Cloze Deletions
```markdown
The ==capital== of France is ==Paris==
```

### Code Block Support
```markdown
What does this JavaScript do?
?
```javascript
const [count, setCount] = useState(0)
```
Creates a React state variable
```

## 🔧 Advanced Features

### Subject Detection
Automatically detects content type and applies appropriate formatting:
- **Science**: Terminology and processes
- **Programming**: Code examples and concepts  
- **Mathematics**: Formulas and problem-solving
- **History**: Facts and chronology
- **Literature**: Analysis and interpretation

### Post-Processing
Intelligent formatting fixes ensure compatibility:
- Merges split ?? markers
- Adds missing question markers
- Fixes spacing issues
- Validates markdown syntax

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Obsidian](https://obsidian.md/) for the amazing note-taking platform
- [Spaced Repetition Plugin](https://github.com/st3v3nmw/obsidian-spaced-repetition) by Stephen Mwangi
- [OpenAI](https://openai.com/) for GPT-4 technology
- [Supabase](https://supabase.com/) for vector database capabilities

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/JoachimRay/obsidianflash/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/JoachimRay/obsidianflash/discussions)
- 📧 **Contact**: raychiong2006@gmail.com

## 🎯 Roadmap

- [ ] Batch processing for multiple topics
- [ ] Custom templates and themes
- [ ] Mobile app development
- [ ] Integration with more learning platforms
- [ ] Collaborative flashcard sharing
- [ ] Analytics and progress tracking

---

**Made with ❤️ for the Obsidian community**

# Obsidian-Flash
