"""
Fix literal newlines inside JS single-quoted strings in oe arrays.
A literal newline inside 'string...\nstring' breaks JS parsing.
Replace with \n (the two-char escape sequence).
"""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed = 0
result = []
inside_oe = False
open_string = False  # are we inside a JS single-quoted string on a line that didn't close?
pending = []  # lines being accumulated for a broken string

for i, line in enumerate(lines):
    # Detect oe:[ blocks (simplified: just fix any line that's a continuation of a broken string)
    # Strategy: if a line doesn't start with { or whitespace+{ and we're in an oe block,
    # it's likely a continuation. Merge it with the previous line.

    # Simpler: just detect lines that look like they're mid-JS-string
    # (start with a lowercase letter or punctuation after what should be a line break)
    stripped = line.rstrip('\n')

    if pending:
        # We're accumulating a broken multi-line string
        # Append this line's content (replacing the newline with \n escape)
        prev = pending[-1].rstrip('\n')
        merged = prev + '\\n' + stripped + '\n'
        pending[-1] = merged
        fixed += 1

        # Check if this line closes the string context
        # Heuristic: if this line ends with },' or ends with }, or ends with ,
        # and the next line starts with { (new object), the string is closed
        # Actually: just check if the merged line now has balanced quotes
        # Simple approach: if next line starts with { it's a new question
        # Check lookahead
        next_i = i + 1
        if next_i < len(lines):
            next_stripped = lines[next_i].strip()
            if next_stripped.startswith('{bron:') or next_stripped.startswith(']},') or next_stripped == ']},':
                result.append(pending[-1])
                pending = []
            # else keep accumulating
        else:
            result.append(pending[-1])
            pending = []
    else:
        # Check if this line starts what looks like a continuation
        # A broken string continuation line starts with (typically) a letter/( and
        # the previous line in an oe array ended without closing its string
        # Heuristic: line starts with '(' or lowercase and is inside oe context
        # Better: check if the line is NOT a JS object line (doesn't have bron: or id: etc.)
        # and is preceded by a line that ends mid-string

        # Detect: line doesn't start with {, doesn't start with whitespace+{id|bron|sv|oe
        # and is inside oe array range
        if (stripped and
            not stripped.startswith('{') and
            not stripped.startswith('   ]') and
            not stripped.startswith('  {') and
            not stripped.startswith('   oe') and
            not stripped.startswith('   sv') and
            not stripped.startswith('   sam') and
            not stripped.startswith('   val') and
            not stripped.startswith('   on') and
            not stripped.startswith('   ce') and
            not stripped.startswith('   bi') and
            not stripped.startswith('/') and
            not stripped.startswith('*') and
            not stripped.startswith('<') and
            not stripped.startswith('let ') and
            not stripped.startswith('const ') and
            not stripped.startswith('function') and
            not stripped.startswith('//') and
            7700 <= i+1 <= 9000):  # line range where oe arrays are
            # This looks like a continuation line
            pending.append(line)
        else:
            result.append(line)

# Flush any pending
result.extend(pending)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(result)

print(f"Fixed {fixed} broken continuation lines")

# Verify: check for any remaining lines starting with (b) or similar
with open(path, 'r', encoding='utf-8') as f:
    lines2 = f.readlines()
problems = [(i+1, l[:80]) for i,l in enumerate(lines2) if l.startswith('(') and 7000 < i < 9100]
print(f"Remaining problems: {len(problems)}")
for ln, txt in problems:
    print(f"  L{ln}: {txt}")
