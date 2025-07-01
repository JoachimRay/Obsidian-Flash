-- Enable the pgvector extension for vector similarity search
create extension if not exists vector;

-- Create a table to store your documents/notes with embeddings
create table if not exists documents (
  id bigserial primary key,
  content text not null,
  metadata jsonb,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  created_at timestamp with time zone default now()
);

-- Create an index for faster vector similarity search
create index if not exists documents_embedding_idx on documents 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Create a function to match documents based on embedding similarity
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;

-- Create a function to insert documents with embeddings
create or replace function insert_document (
  document_content text,
  document_embedding vector(1536),
  document_metadata jsonb default '{}'::jsonb
)
returns bigint
language sql
as $$
  insert into documents (content, metadata, embedding)
  values (document_content, document_metadata, document_embedding)
  returning id;
$$;
