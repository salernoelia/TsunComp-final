import json
import sys
import io

svg_data = sys.stdin.read()

def save_svg(svg_data, output_path):


    print(svg_data)

    with io.open(output_path, 'w', encoding='utf-8') as file:
        file.write(svg_data)

if __name__ == '__main__':

    
    if len(sys.argv) != 2:
        print("Usage: python save_svg.py 'svg_data' 'output_path'")
    else:
        output_path = sys.argv[1]

        save_svg(svg_data, output_path)