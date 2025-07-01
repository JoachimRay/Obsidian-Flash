import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import OpenAI from 'openai'
import { getSystemPrompt } from '../../../utils/prompts'

// Function to fix flashcard formatting issues
function fixFlashcardFormatting(text: string): string {
    if (!text) return text;
    
    // Primary fix: Handle split ?? markers
    let result = text.replace(/\?\s*\n\s*\?/g, '??');
    
    // Secondary fix: Handle ?? with spaces
    result = result.replace(/\?\s+\?/g, '??');
    
    // Tertiary fix: Ensure ?? is on its own line
    const lines = result.split('\n');
    const fixedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // If line contains ?? but has other content too
        if (line.includes('??') && line.trim() !== '??') {
            const beforeContent = line.substring(0, line.indexOf('??')).trim();
            const afterContent = line.substring(line.indexOf('??') + 2).trim();
            
            if (beforeContent) fixedLines.push(beforeContent);
            fixedLines.push('??');
            if (afterContent) fixedLines.push(afterContent);
        }
        // If line contains single ? but has other content too (not in code blocks)
        else if (line.includes('?') && line.trim() !== '?' && 
                 !line.includes('```') && !line.startsWith('#') && 
                 !line.includes('??')) {
            const beforeContent = line.substring(0, line.indexOf('?')).trim();
            const afterContent = line.substring(line.indexOf('?') + 1).trim();
            
            if (beforeContent) fixedLines.push(beforeContent);
            fixedLines.push('?');
            if (afterContent) fixedLines.push(afterContent);
        }
        else {
            fixedLines.push(line);
        }
    }
    
    return fixedLines.join('\n');
}

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request)
{
    try {
        const {query} = await req.json()
        console.log('Received query:', query)

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

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({error}, {status: 500})
        }

        console.log('Found matches:', matches?.length || 0)

        const context = matches?.map((m:any) => m.content).join(`\n---\n`) || 'No relevant context found.'

        const systemPrompt = getSystemPrompt(context)

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
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

        const response = completion.choices[0]?.message?.content

        console.log('Generated response:', response ? 'Success' : 'Failed')
        if (response) {
            console.log('Raw AI output preview:', response.substring(0, 200) + '...')
        }

        // Post-process the response to fix formatting issues
        const fixedResponse = fixFlashcardFormatting(response || '')
        
        // Log if any fixes were made
        if (fixedResponse !== response) {
            console.log('Post-processing applied formatting fixes')
            console.log('Fixed response preview:', fixedResponse.substring(0, 200) + '...')
        }

        return NextResponse.json({
            response: fixedResponse || 'Failed to generate response'
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
            { status: 500 }
        )
    }
}
