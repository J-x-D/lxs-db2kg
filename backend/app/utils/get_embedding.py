import os
from openai import OpenAI
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-mpnet-base-v2')



def get_embedding(text, engine="text-embedding-ada-002"):
    client = OpenAI(
        api_key=os.getenv('OPENAI_API_KEY'),
        organization=os.environ.get('OPENAI_ORGANIZATION')
    )
    if text is not None and "\n" in text:
        text = text.replaceAll("\n", " ")
    return client.embeddings.create(input = [text], model=engine).data[0].embedding

def get_sbert_embedding(text):
    return model.encode([text], normalize_embeddings=True, convert_to_numpy=True)[0]

def test_sbert_embedding():
    query_embedding = model.encode('How big is London')
    passage_embedding = model.encode(['London has 9,787,426 inhabitants at the 2011 census',
                                  'London is known for its finacial district'])
    
    # print type of embedding
    print(type(query_embedding))
    print(type(passage_embedding))
    
    hits = util.semantic_search(query_embedding, passage_embedding, score_function=util.dot_score)

    print("Similarity:", util.dot_score(query_embedding, passage_embedding))
    print(hits)
    print(hits[0][0]['corpus_id'])
