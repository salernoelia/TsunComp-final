from selenium import webdriver
from selenium.webdriver.common.by import By
import time




from selenium import webdriver
from selenium.webdriver.common.by import By
import time

options = webdriver.ChromeOptions()
options.add_experimental_option('debuggerAddress', 'localhost:8989')
driver = webdriver.Chrome(options=options)


driver.get("http://10.128.141.223:8000/#/workspace");

time.sleep(1)

button_element = driver.find_element(By.CSS_SELECTOR, "button.btn.btn-default[title='Run']")
button_element.click()

driver.quit()