import json
import base64
import requests
import sys 


def submit_post(url: str, prompt: str):

    data = prompt

    return requests.post(url, data=json.dumps(data))


def save_encoded_image(b64_image: str, output_path: str):
    with open(output_path, "wb") as image_file:
        image_file.write(base64.b64decode(b64_image))


if __name__ == '__main__':


    prompt = json.loads(sys.argv[1])

    override_settings = {}
    override_settings["sd_model_checkpoint"] = "lineLibraryHand_v10"
    override_payload = {
                    "override_settings": override_settings
                }
    prompt.update(override_payload)


    txt2img_url = 'http://127.0.0.1:7860/sdapi/v1/txt2img'

    response = submit_post(txt2img_url, prompt)
    save_encoded_image(response.json()['images'][0], '../api/python/prompt_results/prompt_result.png')
    print(response.json()['images'][0])

else:

    print(f"API request failed with status code {response.status_code}")



    