"""Check oe arrays for literal newlines — only look for non-{} continuation lines."""
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all oe:[ blocks and check for lines that are clearly NOT object starts
# i.e., lines that don't start with { or ] and are not empty
pos = 0
problems = []
while True:
    start = content.find('\n   oe:[', pos)
    if start < 0:
        break
    end = content.find('\n   ]', start + 7)
    if end < 0:
        break
    block_content = content[start:end + 6]
    start_line = content[:start].count('\n') + 1

    block_lines = block_content.split('\n')
    for j, line in enumerate(block_lines):
        ln = start_line + j
        stripped = line.strip()
        if not stripped:
            continue
        # A bare continuation = doesn't start with { or ] or oe
        # (a question object always starts with {)
        if not stripped.startswith('{') and not stripped.startswith(']') and not stripped.startswith('oe:'):
            problems.append((ln, line[:100]))

    pos = end + 1

print(f"Bare continuation lines in oe blocks: {len(problems)}")
for ln, txt in problems[:30]:
    print(f"  L{ln}: {repr(txt[:80])}")
