// Bouwt assets3d/clash.glb: alle 3D-modellen voor Slagio Clash in één bestand.
// Bron: Kenney (CC0) Mini Characters, Castle Kit, Tower Defense Kit, Nature Kit,
// plus RobotExpressive (Tomás Laulhé, CC0) uit de three.js-voorbeelden.
// Draaien (alleen nodig als je modellen toevoegt):
//   npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions
//   KENNEY=/pad/naar/uitgepakte/kits ROBOT=/pad/robot.glb node scripts/clash-assets.mjs
// Elke bron wordt een eigen 'scene' met een vaste naam; clash.js pakt ze op naam.
import { NodeIO, Document } from '@gltf-transform/core';
import { mergeDocuments, dedup, prune, unpartition, quantize, weld } from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const K = process.env.KENNEY, R = process.env.ROBOT;
const mc = f => `${K}/kenney_mini-characters/Models/GLB format/${f}.glb`;
const ck = f => `${K}/kenney_castle-kit/Models/GLB format/${f}.glb`;
const td = f => `${K}/kenney_tower-defense-kit/Models/GLB format/${f}.glb`;
const nk = f => `${K}/kenney_nature-kit/Models/GLTF format/${f}.glb`;
const BRON = {
  // figuren (één rig; de animaties komen alleen uit 'mens-ridder')
  'mens-ridder': mc('character-male-b'), 'mens-boog': mc('character-female-b'), 'mens-onderzoeker': mc('character-male-e'),
  'mens-wacht': mc('character-female-c'), 'mens-koning': mc('character-male-d'),
  robot: R,
  // kasteel
  'prinses-voet': ck('tower-hexagon-base'), 'prinses-midden': ck('tower-hexagon-mid'), 'prinses-top': ck('tower-hexagon-top'),
  'koning-voet': ck('tower-square-base-color'), 'koning-midden': ck('tower-square-mid-windows'), 'koning-top': ck('tower-square-top'),
  'muur': ck('wall'), 'muur-hoek': ck('wall-corner'), 'poort': ck('gate'), 'vlag': ck('flag-banner-long'), 'wimpel': ck('flag-pennant'),
  'ram': ck('siege-ram'), 'katapult': ck('siege-catapult'), 'ballista': ck('siege-ballista'),
  'rotsen': ck('rocks-large'), 'rotsjes': ck('rocks-small'),
  // torenverdediging
  'kristaltoren': td('tower-round-crystals'), 'pijl': td('weapon-ammo-arrow'), 'kei': td('weapon-ammo-boulder'), 'kogel': td('weapon-ammo-cannonball'), 'kanon': td('weapon-cannon'),
  // natuur
  'boom-eik': nk('tree_oak'), 'boom-rond': nk('tree_default'), 'boom-dik': nk('tree_fat'), 'den-rond': nk('tree_pineRoundA'), 'den-hoog': nk('tree_pineTallA_detailed'),
  'struik': nk('plant_bushLarge'), 'struikje': nk('plant_bush'), 'bloem-rood': nk('flower_redA'), 'bloem-geel': nk('flower_yellowA'), 'bloem-paars': nk('flower_purpleA'),
  'gras': nk('grass_large'), 'grasje': nk('grass'), 'steen-groot': nk('rock_largeA'), 'steen': nk('rock_smallA'), 'steen-hoog': nk('stone_tallA'),
  'paddenstoel': nk('mushroom_redGroup'), 'boomstam': nk('log'),
};
const HOUD = { 'mens-ridder': ['idle','walk','sprint','die','attack-melee-right','holding-right-shoot','holding-both-shoot','holding-both','emote-yes'], robot: ['Idle','Walking','Running','Punch','Death','Jump','No','Yes','Wave','ThumbsUp','Dance'] };

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doel = new Document();
doel.createBuffer();
for (const [naam, pad] of Object.entries(BRON)) {
  const doc = await io.read(pad);
  const root = doc.getRoot();
  // Natuurmodellen zijn 'unlit'; wij willen ze belicht (schaduw, zon).
  for (const ext of root.listExtensionsUsed()) if (ext.extensionName === 'KHR_materials_unlit') ext.dispose();
  for (const a of root.listAnimations()) if (!(HOUD[naam] || []).includes(a.getName())) a.dispose();
  for (const a of root.listAnimations()) a.setName(`${naam}|${a.getName()}`);
  root.listScenes().forEach((s, i) => s.setName(i ? `${naam}-${i}` : naam));
  mergeDocuments(doel, doc);
}
await doel.transform(unpartition(), dedup(), weld(), prune({ keepLeaves: true }), quantize());
await io.write(process.argv[2] || 'assets3d/clash.glb', doel);
console.log('klaar', Object.keys(BRON).length, 'modellen');
