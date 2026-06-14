"""
Fix double-bracket issue in ak HAVO oe arrays.
The fix_ak_oe2.py script added an extra `   ]\n` before each `   ]},` and `   ]}\n ]}`.
Remove the redundant `   ]` lines.
"""
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

fixes = 0

# Fix B, C, D: have `   ]\n   ]},\n  {id:` pattern — remove the first `   ]\n`
for next_dom in [('C', 'Aarde'), ('D', 'Ontwikkelingsland'), ('E', 'Leefomgeving')]:
    bad = '   ]\n   ]},\n  {id:\'' + next_dom[0] + '\',naam:\'' + next_dom[1] + '\''
    good = '   ]},\n  {id:\'' + next_dom[0] + '\',naam:\'' + next_dom[1] + '\''
    if bad in content:
        content = content.replace(bad, good, 1)
        fixes += 1
        print(f"Fixed domain before {next_dom[0]}")
    else:
        print(f"Pattern not found for before {next_dom[0]}: {repr(bad[:60])}")

# Fix E (last domain): has `   ]\n   ]}\n ]},` pattern — remove the first `   ]\n`
# Domain E ends with ]}\n ]}, (close oe, close domain E, close domeinen, close vak object)
bad_e = '   ]\n   ]}\n ]}'
good_e = '   ]}\n ]}'
if bad_e in content:
    content = content.replace(bad_e, good_e, 1)
    fixes += 1
    print("Fixed domain E")
else:
    # Try alternative pattern
    bad_e2 = '   ]\n   ]}\n ]},\n'
    good_e2 = '   ]}\n ]},\n'
    if bad_e2 in content:
        content = content.replace(bad_e2, good_e2, 1)
        fixes += 1
        print("Fixed domain E (variant)")
    else:
        # Search for what's actually there
        ak_start = content.find("{id:'ak',naam:'Aardrijkskunde'")
        ec_start = content.find("{id:'ec',naam:'Economie'", ak_start)
        ak_section = content[ak_start:ec_start]
        e_idx = ak_section.find("{id:'E',naam:'Leefomgeving'")
        oe_idx = ak_section.find('   oe:[', e_idx)
        end_area = ak_section[oe_idx:oe_idx+400]
        # Find double ] pattern
        print("E pattern not found, showing end of domain E:")
        lines = end_area.split('\n')
        for i, line in enumerate(lines):
            if '   ]' in line:
                print(f"  [{i}]: {repr(line)}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal fixes applied: {fixes}")

# Verify
with open('index.html', 'r', encoding='utf-8') as f:
    v = f.read()

# Check no double brackets remain
ak_start = v.find("{id:'ak',naam:'Aardrijkskunde'")
ec_start = v.find("{id:'ec',naam:'Economie'", ak_start)
ak_section = v[ak_start:ec_start]

for dom in ['B', 'C', 'D', 'E']:
    idx = ak_section.find("{id:'" + dom + "',naam:")
    if idx < 0:
        print(f"Domain {dom}: not found")
        continue
    oe_start = ak_section.find('   oe:[', idx)
    # Find the end of this domain's oe block
    next_domain_or_end = ak_section.find("\n  {id:", oe_start)
    if next_domain_or_end < 0:
        next_domain_or_end = len(ak_section)
    block = ak_section[oe_start:next_domain_or_end]
    double = block.count('   ]\n   ]')
    print(f"Domain {dom}: double-bracket count = {double} (should be 0)")
