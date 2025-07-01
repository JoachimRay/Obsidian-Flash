import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import OpenAI from 'openai'
import { getSystemPrompt } from '../utils/prompts'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request)
{
    const {query} = await req.json()

    const embeddingResponse = await openai.embeddings.create({
    input: query,
    model: 'text-embedding-3-small',
})

const queryEmbedding = embeddingResponse.data[0].embedding

const {data:matches, error} = await supabase.rpc('match_documents', {
    query_embedding:queryEmbedding,
    match_threshold:0.78,
    match_count: 3,
})

if (error) return NextResponse.json({error}, {status: 500})

    const context = matches.map((m:any) => m.content).join(`\n---\n`)

    const systemPrompt = getSystemPrompt(context)

    const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: query
            }
        ]
    })

    return NextResponse.json({
        response: completion.choices[0].message.content
    })
}

