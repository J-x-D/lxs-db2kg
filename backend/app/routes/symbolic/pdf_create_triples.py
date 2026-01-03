import openai
from openai import OpenAI
import os
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
import json

load_dotenv()


response_data = ""

pdf_create_triples_blueprint = Blueprint("pdf_create_triples", __name__)


@pdf_create_triples_blueprint.route("/pdf_create_triples", methods=["POST"])
def get_response_data():
    global response_data
    user_input = request.json.get("user_input", "")
    topics = request.json.get("topics", "")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    print("\033[94m" + "calling LLM" + "\033[0m")

    try:
        prompt = """
               ###Examples###
                {"triples":[
                    {"subject": {"words":"<subject related words exactly taken from text>", "value":"<actual subject that could be a summary of the found words>"},
                    "predicate": {"words":"<predicate related words exactly taken from text>", "value":"<actual predicate that could be a summary of the found words>"},
                    "object": {"words":"<object related words exactly taken from text>", "value":"<actual object that could be a summary of the found words>"} }
                ]}
                Return only JSON.

                ###Instruction###
                Construct triples that describe the following text. The goal is to extract the entire knowledge from the "Scientific Paper Abstract".
                Focus on generating triples that orient for the subjects and objects at the provided topics. 
                All topics should be part of a triple.
                text: "<placeholder_text>"
                topics: [<placeholder_topics>]
                Do not provide any explanation.
                """.replace("<placeholder_text>", user_input).replace("<placeholder_topics>", ",".join(topics))

        client = OpenAI()
        completion = client.chat.completions.create(
            model="gpt-4-1106-preview",
            seed=42,
            response_format={ "type": "json_object" },
            temperature=0.5,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        # Its now a dict, no need to worry about json loading so many times
        response_data = completion.choices[0].message.content
        print(response_data)

    except openai.RateLimitError as e:
        # request limit exceeded or something.
        print(e)
        return jsonify({"error": "".format(e)}), 429
    except json.decoder.JSONDecodeError as jde:
        return jsonify({"Error": "{}".format(jde)}), 500
    except Exception as e:
        # general exception handling
        print(e)
        return jsonify({"error": "".format(e)}), 400


    # print in green
    print("\033[92m" + "generated message" + "\033[0m")
    return response_data, 200
