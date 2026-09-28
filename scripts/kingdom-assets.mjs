// Bouwt assets3d/kingdom.glb: gebouwen en natuur voor Slagio Kingdom in 3D.
// Bron: Kenney (CC0) City Kit Suburban/Commercial, Fantasy Town Kit, Castle Kit, Nature Kit, Mini Characters.
//   npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions
//   KENNEY=/pad/naar/uitgepakte/kits node scripts/kingdom-assets.mjs
import { NodeIO, Document } from '@gltf-transform/core';
import { mergeDocuments, dedup, prune, unpartition, quantize, weld } from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const K=process.env.KENNEY;
const sub=f=>`${K}/kenney_city-kit-suburban_20/Models/GLB format/${f}.glb`;
const com=f=>`${K}/kenney_city-kit-commercial_2.1/Models/GLB format/${f}.glb`;
const fan=f=>`${K}/kenney_fantasy-town-kit_2.0/Models/GLB format/${f}.glb`;
const ck=f=>`${K}/kenney_castle-kit/Models/GLB format/${f}.glb`;
const nk=f=>`${K}/kenney_nature-kit/Models/GLTF format/${f}.glb`;
const mc=f=>`${K}/kenney_mini-characters/Models/GLB format/${f}.glb`;
const BRON={};
for(const x of ['a','c','e','g','k','m','p','q','s','u'])BRON['huis-'+x]=sub('building-type-'+x);
for(const x of ['c','d','e','f','g','h','i','k','l','m','n'])BRON['pand-'+x]=com('building-'+x);
for(const x of ['a','b','c','d','e'])BRON['toren-'+x]=com('building-skyscraper-'+x);
Object.assign(BRON,{'plat-a':com('low-detail-building-wide-a'),'plat-b':com('low-detail-building-wide-b'),
  molen:fan('windmill'),watermolen:fan('watermill'),'kraam-rood':fan('stall-red'),'kraam-groen':fan('stall-green'),kar:fan('cart'),fontein:fan('fountain-round-detail'),
  lantaarn:fan('lantern'),'banier-rood':fan('banner-red'),'banier-groen':fan('banner-green'),'zuil-steen':fan('pillar-stone'),bankje:fan('stall-bench'),
  'boom-f':fan('tree'),'boom-hoog':fan('tree-high'),'boom-rond':fan('tree-high-round'),'rots-groot':fan('rock-large'),'rots-breed':fan('rock-wide'),heg:fan('hedge'),
  'kt-voet':ck('tower-square-base-color'),'kt-midden':ck('tower-square-mid-windows'),'kt-dak':ck('tower-square-top-roof-high'),
  'hx-voet':ck('tower-hexagon-base'),'hx-midden':ck('tower-hexagon-mid'),'hx-dak':ck('tower-hexagon-roof'),muur:ck('wall'),poort:ck('gate'),vlag:ck('flag-banner-long'),wimpel:ck('flag-pennant'),
  eik:nk('tree_oak'),den:nk('tree_pineTallA_detailed'),dennetje:nk('tree_pineRoundA'),struik:nk('plant_bushLarge'),'bloem-rood':nk('flower_redA'),'bloem-geel':nk('flower_yellowA'),'bloem-paars':nk('flower_purpleA'),
  // inwoners (één rig; loop- en staanimatie alleen uit 'burger-a')
  'burger-a':mc('character-male-a'),'burger-b':mc('character-female-a'),'burger-c':mc('character-female-d'),'burger-d':mc('character-male-c'),'burger-e':mc('character-female-e'),
  'muur-hoek':ck('wall-corner'),'muur-toren':ck('wall-corner-half-tower'),brug:ck('bridge-straight'),'hx-top':ck('tower-hexagon-top'),'rotsen':ck('rocks-large'),
  gras:nk('grass_large'),steen:nk('rock_largeA'),'steen-hoog':nk('stone_tallA'),kano:nk('canoe'),boomstam:nk('log_stack')});
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doel=new Document();doel.createBuffer();
for(const [naam,pad] of Object.entries(BRON)){const doc=await io.read(pad);const root=doc.getRoot();
  for(const ext of root.listExtensionsUsed())if(ext.extensionName==='KHR_materials_unlit')ext.dispose();
  for(const a of root.listAnimations()){if(naam==='burger-a'&&['idle','walk','emote-yes'].includes(a.getName()))a.setName('burger|'+a.getName());else a.dispose();}
  root.listScenes().forEach((s,i)=>s.setName(i?`${naam}-${i}`:naam));mergeDocuments(doel,doc);}
await doel.transform(unpartition(),dedup(),weld(),prune({keepLeaves:true}),quantize());
await io.write(process.argv[2]||'assets3d/kingdom.glb',doel);console.log('klaar',Object.keys(BRON).length);
