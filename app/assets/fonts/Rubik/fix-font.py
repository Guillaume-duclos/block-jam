import sys
from fontTools.ttLib import TTFont

def fix_font_metrics(input_path, output_path, ascent, descent):
    # Charger la police
    font = TTFont(input_path)
    
    # 1. Modifier la table hhea (iOS)
    font['hhea'].ascent = ascent
    font['hhea'].descent = descent
    
    # 2. Modifier la table OS/2 (Android/Windows)
    font['OS/2'].sTypoAscender = ascent
    font['OS/2'].sTypoDescender = descent
    font['OS/2'].usWinAscent = abs(ascent)
    font['OS/2'].usWinDescent = abs(descent)
    font['OS/2'].sTypoLineGap = 0
    font['hhea'].lineGap = 0

    # Sauvegarder la nouvelle police
    font.save(output_path)
    print(f"✅ Police générée : {output_path} (Ascent: {ascent}, Descent: {descent})")

if __name__ == "__main__":
    # Paramètres : fichier_entree, ascent, descent
    if len(sys.argv) < 4:
        print("Usage: python3 fix_font.py MaFont.ttf 935 -250")
    else:
        file_in = sys.argv[1]
        asc = int(sys.argv[2])
        desc = int(sys.argv[3])
        file_out = file_in.replace(".ttf", "_fixed.ttf")
        fix_font_metrics(file_in, file_out, asc, desc)