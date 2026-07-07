from PIL import Image
from collections import deque

src = r"D:\Sites\Bar jardim\bola.png"   # ficheiro real da pasta pai (48702 bytes)
dst = r"D:\Sites\Bar jardim\bardojardim\images\bola-futebol.png"

img = Image.open(src).convert("RGBA")
w, h = img.size
print(f"Tamanho original: {w}x{h}")

pixels = img.load()
THRESHOLD = 240

visited = [[False] * h for _ in range(w)]
queue = deque()

# Sementes: percorre toda a borda exterior (não só os 4 cantos)
for x in range(w):
    for y in [0, h - 1]:
        if not visited[x][y]:
            r, g, b, a = pixels[x, y]
            if r >= THRESHOLD and g >= THRESHOLD and b >= THRESHOLD:
                visited[x][y] = True
                queue.append((x, y))

for y in range(h):
    for x in [0, w - 1]:
        if not visited[x][y]:
            r, g, b, a = pixels[x, y]
            if r >= THRESHOLD and g >= THRESHOLD and b >= THRESHOLD:
                visited[x][y] = True
                queue.append((x, y))

removed = 0
while queue:
    x, y = queue.popleft()
    r, g, b, a = pixels[x, y]
    if r >= THRESHOLD and g >= THRESHOLD and b >= THRESHOLD:
        pixels[x, y] = (r, g, b, 0)
        removed += 1
        for nx, ny in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]:
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                visited[nx][ny] = True
                nr, ng, nb, na = pixels[nx, ny]
                if nr >= THRESHOLD and ng >= THRESHOLD and nb >= THRESHOLD:
                    queue.append((nx, ny))

print(f"Pixels removidos: {removed}")
img.save(dst, "PNG")
print(f"Guardado em: {dst}")
