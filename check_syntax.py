path = r'C:/Users/pepij/examenapp-havo/index.html'
with open(path, encoding='utf-8') as f:
    c = f.read()

start = c.find('const VAKKEN =')
depth = 0
in_str = False
str_char = None
escape = False
first_bracket = None
bs = chr(92)

for i in range(start, min(start+2000000, len(c))):
    ch = c[i]
    if escape:
        escape = False
        continue
    if ch == bs:
        if in_str:
            escape = True
        continue
    if in_str:
        if ch == str_char:
            in_str = False
    else:
        if ch in ("'", '"', '`'):
            in_str = True
            str_char = ch
        elif ch == '[':
            if first_bracket is None:
                first_bracket = i
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0 and first_bracket is not None:
                print(f'VAKKEN array ends at position {i}')
                print(repr(c[i:i+15]))
                break
else:
    print('ERROR: VAKKEN array not closed. depth=%d in_str=%s' % (depth, in_str))
    if in_str:
        last_str_start = -1
        in_str2 = False
        str_char2 = None
        esc2 = False
        for j in range(start, min(start+2000000, len(c))):
            ch2 = c[j]
            if esc2:
                esc2 = False
                continue
            if ch2 == bs:
                if in_str2:
                    esc2 = True
                continue
            if in_str2:
                if ch2 == str_char2:
                    in_str2 = False
            else:
                if ch2 in ("'", '"', '`'):
                    in_str2 = True
                    str_char2 = ch2
                    last_str_start = j
        print(f'Last opened string at {last_str_start}: {repr(c[last_str_start:last_str_start+100])}')
        vak_search = c.rfind("{id:'", 0, last_str_start)
        print(f'Nearest vak/domain: {repr(c[vak_search:vak_search+60])}')
