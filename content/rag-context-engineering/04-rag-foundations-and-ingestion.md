# RAG Foundations & Ingestion

> Why retrieval-augmented generation exists, and how documents are turned into retrievable chunks.

## RAG Foundations

- Why RAG: Knowledge Cutoffs, Private Data and Grounding
- RAG Architecture End to End
- RAG vs Fine-Tuning vs Long Context

## Indexing Pipeline

> Documents → Parse → Chunk → Embed → Index → Vector Database

- Document Ingestion Strategies
- Document Parsing (PDFs, Tables, Images)
- OCR and Layout-Aware Parsing
- Cleaning and Deduplicating Documents
- Metadata Extraction

## Chunking

- What Chunking Is and Why It Matters
- Fixed-Size Chunking with Overlap
- Recursive Chunking
- Structure-Aware Chunking (Headings, Markdown, HTML)
- Semantic Chunking
- Parent-Child (Small-to-Big) Chunking
- Contextual Chunking (Prepending Document Context)
- Choosing Chunk Size and Overlap
