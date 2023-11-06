import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
import shutil

# Define the relative paths for image and SVG files
image_folder = 'prompt_results'
svg_folder = 'svg'

# Get the current working directory
current_directory = os.path.dirname(os.path.abspath(__file__))

# Create the relative path for the image file to upload

file_to_upload = os.path.join(current_directory, image_folder, 'prompt_result.png')

# Initialize the Chrome webdriver
options = webdriver.ChromeOptions()
options.add_experimental_option('debuggerAddress', 'localhost:8989')
driver = webdriver.Chrome(options=options)

# Navigate to the website
driver.get('https://online.rapidresizer.com/tracer.php')

try:
    # Click "Upload a file to trace" button
    upload_button = driver.find_element(By.NAME, 'traceFile')
    upload_button.send_keys(file_to_upload)
    time.sleep(4)

    # Change file format to SVG
    trace_format = Select(driver.find_element(By.NAME, 'traceFormat'))
    trace_format.select_by_value('svg')

    # Click on "Centerline" radio button
    radio_button = driver.find_element(By.CSS_SELECTOR, 'input[value="centerline"]')
    driver.execute_script("arguments[0].click();", radio_button)
    time.sleep(1)

    # Click the "Download" button
    download_button = driver.find_element(By.CSS_SELECTOR, 'input[value="Download"].traceImage.btn.btn-default.btn-block')
    download_button.click()

    # Find the most recently downloaded SVG file in the Downloads folder
    time.sleep(4)


    # Get the destination file name with a consecutive number

    destination_base_name = 'result.svg'
    destination_path = os.path.join(svg_folder, destination_base_name)

    with open('../api/python/svg/Tracing.svg', 'r', encoding='utf-8') as svg_file:
        svg_content = svg_file.read()
        print(svg_content)



        

finally:
    # Close the browser
    driver.quit()
