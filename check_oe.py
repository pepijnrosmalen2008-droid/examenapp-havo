"""Check all oe arrays for literal newlines inside single-quoted strings."""
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

problems = []
for i, line in enumerate(lines):
    ln = i + 1
    # We're looking for lines that are clearly inside an oe array's string content
    # but are NOT valid starts of oe objects or array syntax
    stripped = line.strip()
    # A bare continuation line inside an oe array would NOT start with:
    # {bron:, oe:[, ]}, or be empty
    # But it would be in a range where oe arrays are (between oe:[ and ])
    # The simplest check: find lines after "oe:[" that don't look like JS object starts
    pass  # replaced by approach below

# Approach: find all oe:[ blocks and check each line within them
import re

# Find all oe:[ ... ] blocks
oe_blocks = []
pos = 0
while True:
    start = content.find('\n   oe:[', pos)
    if start < 0:
        break
    end = content.find('\n   ]', start + 7)
    if end < 0:
        break
    block_content = content[start:end + 6]
    start_line = content[:start].count('\n') + 1
    oe_blocks.append((start_line, block_content))
    pos = end + 1

print(f"Found {len(oe_blocks)} oe blocks")

total_problems = 0
for start_line, block in oe_blocks:
    block_lines = block.split('\n')
    for j, line in enumerate(block_lines):
        ln = start_line + j
        stripped = line.strip()
        if not stripped:
            continue
        # Valid lines in an oe block:
        # - starts with oe:[
        # - starts with {bron:
        # - starts with ]  (closing)
        # - starts with , (separator — rare but possible if questions on multiple lines)
        if (stripped.startswith('oe:[') or
            stripped.startswith('{bron:') or
            stripped.startswith(']') or
            stripped.startswith(',{bron:') or
            stripped == '' ):
            continue
        # This line looks like a continuation of a broken string
        problems.append((ln, line[:100]))
        total_problems += 1

print(f"Problem lines (bare continuations): {total_problems}")
for ln, txt in problems[:20]:
    print(f"  L{ln}: {repr(txt[:80])}")
