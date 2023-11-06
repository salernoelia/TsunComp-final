import os

file_path = '../api/python/svg/Tracing.svg'
file_path2 = '../api/gcode/result.gcode'

# Check if the file exists before attempting to delete it
if os.path.exists(file_path):
    os.remove(file_path)
    print("File {file_path} has been deleted.")
else:
    print("File {file_path} does not exist.")

if os.path.exists(file_path2):
    os.remove(file_path2)
    print("File {file_path} has been deleted.")
else:
    print("File {file_path} does not exist.")