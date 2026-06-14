"""Check for literal newlines inside JS single-quoted strings."""
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Strategy: scan through file tracking if we're inside a JS single-quoted string
# If we find a newline while inside a string, that's a problem
problems = []
in_string = False
string_start_line = 0
line_num = 1
i = 0
while i < len(content):
    ch = content[i]
    if ch == '\n':
        if in_string:
            problems.append((line_num, content[max(0,i-80):i]))
        line_num += 1
        i += 1
        continue
    if ch == '\\' and not in_string:
        i += 2  # skip escaped char
        continue
    if ch == '\\' and in_string:
        i += 2  # skip escaped char inside string
        continue
    if ch == "'" and not in_string:
        in_string = True
        string_start_line = line_num
        i += 1
        continue
    if ch == "'" and in_string:
        in_string = False
        i += 1
        continue
    i += 1

print(f"Problems found: {len(problems)}")
for ln, ctx in problems[:20]:
    print(f"  L{ln}: ...{repr(ctx[-60:])}...")
