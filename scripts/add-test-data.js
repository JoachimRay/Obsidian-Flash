// Test script to add sample documents to Supabase
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable.')
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable.')
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const sampleDocuments = [
  {
    content: `# Photosynthesis
    
Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigments. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.

The overall equation: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2

Key stages:
- Light reactions (occur in thylakoids)
- Calvin cycle (occurs in stroma)`,
    metadata: { topic: 'biology', subject: 'photosynthesis' }
  },
  {
    content: `# React Hooks

React Hooks are functions that let you use state and other React features in functional components.

useState: Manages local state in functional components
useEffect: Performs side effects in functional components  
useContext: Consumes context values
useReducer: Alternative to useState for complex state logic
useMemo: Memoizes expensive calculations
useCallback: Memoizes functions

Example:
const [count, setCount] = useState(0)
useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])`,
    metadata: { topic: 'programming', subject: 'react' }
  },
  {
    content: `# Machine Learning Basics

Machine Learning is a subset of artificial intelligence that focuses on algorithms that can learn from and make predictions or decisions based on data.

Types of ML:
- Supervised Learning: Learning with labeled data
- Unsupervised Learning: Finding patterns in unlabeled data  
- Reinforcement Learning: Learning through rewards and penalties

Common algorithms:
- Linear Regression
- Decision Trees
- Neural Networks
- K-Means Clustering`,
    metadata: { topic: 'ai', subject: 'machine-learning' }
  }
]

async function addTestData() {
  try {
    for (const doc of sampleDocuments) {
      // Create embedding
      const embeddingResponse = await openai.embeddings.create({
        input: doc.content,
        model: 'text-embedding-3-small',
      })
      
      const embedding = embeddingResponse.data[0].embedding
      
      // Insert into Supabase
      const { data, error } = await supabase.rpc('insert_document', {
        document_content: doc.content,
        document_embedding: embedding,
        document_metadata: doc.metadata
      })
      
      if (error) {
        console.error('Error inserting document:', error)
      } else {
        console.log('Inserted document with ID:', data)
      }
    }
    
    console.log('Test data added successfully!')
  } catch (error) {
    console.error('Error:', error)
  }
}

addTestData()
