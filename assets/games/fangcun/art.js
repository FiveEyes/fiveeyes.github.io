/** Original code-drawn artwork for 方寸疑案. */
const ink = '#425047';

const wrap = (body, viewBox = '0 0 48 48') => `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;
const line = `stroke="${ink}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;

export function sceneArt(index = 0) {
  const scenes = [
    `<path fill="#e9e6d8" d="M0 0h420v180H0z"/><path fill="#e0dfce" d="M0 146h420v34H0z"/><path d="M20 146h380M42 28v118M378 28v118M42 32h336" ${line}/>
     <path d="M59 48h104v98H59z" fill="#d8d9c7" ${line}/><path d="M64 80h94M64 112h94M111 48v98" ${line}/>
     <g fill="#b8bca1" ${line}><path d="M72 60h18v17H72zM123 91h20v18h-20zM74 125h24v17H74z"/><path d="M129 59h12v15h-12z"/><path d="M68 97h13v12H68z"/></g>
     <path d="M186 52h102v74H186z" fill="#f3efe2" ${line}/><path d="M192 58h90v62h-90zM217 58v62M257 58v62M192 88h90" stroke="#b3b6a2" stroke-width="1.5"/><path d="M196 114c14-22 24-32 38-33 14-2 26 12 44 30" stroke="#b3b6a2" stroke-width="1.5"/>
     <path d="M189 139h99v9h-99z" fill="#b7a389" ${line}/><path d="M199 148v22M278 148v22" ${line}/><ellipse cx="237" cy="137" rx="31" ry="7" fill="#d8c5a5" ${line}/><path d="M224 132v-10h14v10M238 125c9-2 10 6 1 6" fill="#f3efe2" ${line}/><path d="M247 131h10v5h-10zM212 131h7v5h-7z" fill="#faf7ed" ${line}/>
     <path d="M326 32v14" ${line}/><path d="M314 47h24l5 15-5 19h-24l-5-19z" fill="#ba7157" ${line}/><path d="M326 51v25M312 62h28M319 84h14M326 84v8" stroke="#f3e5ce" stroke-width="1.4"/>
     <path d="M329 136h26l-4 29h-18z" fill="#c7b396" ${line}/><path d="M342 137v-38m0 20c-19-3-23-11-20-16 10-1 18 6 20 16zm0 8c17-5 23-14 18-19-10 0-17 10-18 19z" fill="#9fae8e" ${line}/>
     <path d="M177 153h12v14h-12zM290 153h12v14h-12z" fill="#b7a389" ${line}/><path d="M17 166h34M365 166h38" stroke="#c2c5b2" stroke-width="1.5"/>`,
    `<path fill="#e7dfd4" d="M0 0h420v180H0z"/><path fill="#d9d4c9" d="M0 145h420v35H0z"/><path d="M14 149h394" ${line}/>
     <path d="M28 57h155l-15 30H42z" fill="#bd795d" ${line}/><path d="M28 57h155M52 57l-8 30m36-30-4 30m34-30v30m31-30 4 30m14-30 9 30" stroke="#eedbc4" stroke-width="2"/><path d="M42 87c4 8 14 8 18 0 5 8 15 8 20 0 5 8 15 8 20 0 5 8 15 8 20 0 5 8 15 8 20 0 5 8 15 8 20 0" stroke="#425047" stroke-width="1.7"/>
     <path d="M48 91v56M163 91v56M48 113h115v34H48z" fill="#d4b78e" ${line}/><path d="M56 121h99M56 130h99M56 139h99" stroke="#b99c78" stroke-width="1.3"/>
     <g fill="#e4d0ad" ${line}><path d="M57 108c0-12 21-12 21 0zM84 108c0-12 21-12 21 0zM111 108c0-12 21-12 21 0z"/><path d="M140 99h11v11h-11z"/></g>
     <path d="M218 70h157l-12 28H230z" fill="#84918a" ${line}/><path d="M243 70l-4 28m36-28-2 28m34-28 2 28m33-28 5 28" stroke="#c9d1c4" stroke-width="2"/><path d="M235 98v50M358 98v50M235 121h123v27H235z" fill="#9eaaa0" ${line}/><path d="M245 131h103M245 139h103" stroke="#718177" stroke-width="1.5"/>
     <g fill="#d5c5a5" ${line}><path d="M246 109h20v11h-20zM272 105h23v15h-23zM303 111h17v9h-17zM328 104h19v16h-19z"/></g>
     <path d="M13 19q194 42 393 3" ${line}/><path d="M80 31v10M204 38v15M330 32v12" ${line}/><g fill="#c08663" ${line}><rect x="71" y="41" width="18" height="23" rx="6"/><rect x="195" y="53" width="18" height="23" rx="6"/><rect x="321" y="44" width="18" height="23" rx="6"/></g><path d="M80 46v13M204 58v13M330 49v13" stroke="#f3dfb9" stroke-width="1.4"/>
     <path d="M191 151c-7-5-8-14-4-20l5 4 8-1 5-6c3 5 4 13-1 17 5 7 3 16-7 16h-11m0-2c-9 1-13-5-10-10" fill="#eee6d5" ${line}/><path d="M193 140h1m7-1h1" ${line}/><path d="M29 166h30M329 166h53M236 163h25" stroke="#b9b8a8" stroke-width="1.5"/>`,
    `<path fill="#dce2dd" d="M0 0h420v180H0z"/><path d="M22 31h376v120H22z" fill="#c4d0c7" ${line}/><path d="M22 140h376v11H22z" fill="#9cab9f"/><path d="M22 152h376l22 28H0z" fill="#b9c2b6"/>
     <g fill="#3f5657" ${line}><rect x="45" y="50" width="86" height="56" rx="7"/><rect x="166" y="50" width="86" height="56" rx="7"/><rect x="287" y="50" width="86" height="56" rx="7"/></g>
     <path d="M52 88l18-14 21 10 16-10 18 15v10H52zM173 91l20-17 20 13 12-6 21 13v6h-73zM294 90l15-10 15 9 15-16 27 20v7h-72z" fill="#637a70"/><path d="M60 62h2M114 65h2M186 61h2M232 69h2M354 61h2M315 62h2" stroke="#e5e4bf" stroke-width="2" stroke-linecap="round"/><path d="M342 64a10 10 0 0 1-12-12 10 10 0 1 0 12 12" fill="#e0dbb9"/>
     <path d="M42 118h83v30H42zM170 118h80v30h-80zM294 118h82v30h-82z" fill="#9e7965" ${line}/><path d="M47 126h73M175 126h70M299 126h72" stroke="#b9977e" stroke-width="1.5"/><path d="M48 148v11M119 148v11M176 148v11M244 148v11M300 148v11M370 148v11" ${line}/>
     <path d="M138 48v100M145 45v106M267 48v100M275 45v106" ${line}/><path d="M143 117h25v8h-25zM252 117h23v8h-23z" fill="#e0d4bd" ${line}/>
     <path d="M46 21h83v8H46zM169 21h83v8h-83zM290 21h83v8h-83z" fill="#e6dcb5" ${line}/><path d="M22 12h376M33 15v12M386 15v12" ${line}/><path d="M57 15h31v12H57zM95 18h26v9H95zM302 16h26v11h-26zM335 15h23v12h-23z" fill="#b5a58c" ${line}/>
     <path d="M204 151h24v20h-24z" fill="#b29b78" ${line}/><path d="M211 151v-5h10v5M210 154v14M222 154v14" ${line}/><path d="M189 178l12-19M230 159l12 19" stroke="#dce0d3" stroke-width="1.3"/>`
  ];
  return wrap(scenes[Number(index) % scenes.length] || scenes[0], '0 0 420 180');
}

export function objectIcon(type) {
  const icons = {
    chair: '<rect x="12" y="10" width="24" height="8" rx="3" fill="#cabda0"/><rect x="13" y="18" width="22" height="19" rx="4" fill="#ded2b8"/><path d="M10 22v12m28-12v12M17 39v3m14-3v3"/>',
    table: '<rect x="7" y="11" width="34" height="27" rx="5" fill="#ceb994"/><path d="M12 16h24M13 40v2m22-2v2"/><circle cx="24" cy="27" r="5" fill="#e7ddc6"/>',
    shelf: '<rect x="8" y="8" width="32" height="33" rx="2" fill="#c5b795"/><path d="M10 23h28M10 35h28M15 12v8m5-8v8m7-7 3 7m4-7v7M15 27v5m6-5v5m7-5v5m6-5v5"/>',
    tea: '<ellipse cx="23" cy="36" rx="16" ry="5" fill="#d2cfb6"/><path d="M12 17h22v13c0 9-22 9-22 0z" fill="#e8dec4"/><path d="M35 20c12-2 11 12 0 10M18 12c-5-6 5-5 0-11m9 11c-5-6 5-5 0-11"/>',
    seal: '<rect x="10" y="27" width="28" height="13" rx="2" fill="#b97c65"/><path d="M17 26V15a7 7 0 0 1 14 0v11" fill="#cda185"/><path d="M15 34h18m-12-3v6m6-6v6" stroke="#f3e8ce"/>',
    plant: '<path d="M15 28h20l-3 14H18z" fill="#c3ac8b"/><path d="M24 30V8m0 17C9 25 8 13 12 12c8-1 13 7 12 13zm0-7c14 0 16-12 11-13-6 0-11 7-11 13z" fill="#a3b08d"/>',
    fish: '<ellipse cx="24" cy="26" rx="18" ry="11" fill="#d0d3c0"/><path d="M12 26c7-9 15-9 22 0-7 9-15 9-22 0z" fill="#aab8ab"/><path d="m11 26-4-5v10zM23 20v12"/><circle cx="29" cy="25" r="1.2" fill="#425047" stroke="none"/>',
    box: '<path d="m8 15 16-8 16 8v23l-16 8-16-8z" fill="#d0b78d"/><path d="m8 15 16 8 16-8M24 23v23M16 11l16 8v9"/><path d="m12 30 7 3"/>',
    awning: '<path d="M7 12h34l-4 14H11z" fill="#bd8667"/><path d="M10 26v15m28-15v15M17 12l-2 14m9-14v14m7-14 2 14M8 41h32"/><path d="M13 33h22v8H13z" fill="#d1bc98"/>',
    bench: '<rect x="6" y="10" width="36" height="9" rx="2" fill="#b9a382"/><rect x="6" y="23" width="36" height="12" rx="2" fill="#cbb696"/><path d="M11 19v4m26-4v4M11 35v7m26-7v7M8 28h32"/>',
    panel: '<rect x="9" y="6" width="30" height="36" rx="3" fill="#aeb9ac"/><rect x="15" y="12" width="18" height="9" rx="1" fill="#e0e5d2"/><circle cx="17" cy="29" r="2" fill="#b87b60"/><circle cx="30" cy="29" r="2" fill="#788d78"/><path d="M16 36h16"/>',
    seat: '<rect x="9" y="6" width="30" height="15" rx="5" fill="#a7826a"/><rect x="11" y="21" width="26" height="18" rx="4" fill="#bb967b"/><path d="M7 24v12m34-12v12M16 41v3m16-3v3"/>',
    luggage: '<rect x="8" y="13" width="32" height="28" rx="4" fill="#b8a17f"/><path d="M18 13V7h12v6M16 15v23m16-23v23M13 43h3m16 0h3"/><path d="M21 23h6v8h-6z" fill="#ece0bf"/>',
    door: '<path d="M11 42V6h27v36" fill="#c5c6af"/><path d="M16 41V11h17v30M8 42h33"/><circle cx="28" cy="28" r="1.5" fill="#425047"/>',
  };
  const aliases = { book: 'shelf', books: 'shelf', teapot: 'tea', counter: 'table', stall: 'awning', crates: 'box', control: 'panel', window: 'door', ticket: 'seal', cat: 'plant' };
  return wrap(`<g ${line}>${icons[type] || icons[aliases[type]] || '<circle cx="24" cy="24" r="13" fill="#d5d7c3"/><path d="M18 24h12M24 18v12"/>'}</g>`);
}

export function avatar(index = 0) {
  const palettes = [['#d6cbb5', '#657e70', '#ddc3a4'], ['#ddc7b9', '#a87862', '#e9cbaa'], ['#c7d2c6', '#78857f', '#d6b591'], ['#d5d2bb', '#a39770', '#e3c5a3'], ['#c8ced3', '#727d8a', '#d5b293'], ['#dbc7bf', '#99786d', '#e7c9ab']];
  const [bg, shirt, skin] = palettes[Number(index) % palettes.length] || palettes[0];
  const hair = [
    '<path d="M15 22c-3-16 22-20 22-1l-6-5-11 1z" fill="#4d574c"/>',
    '<path d="M14 28V18c0-15 24-15 24 1v10l-5-11-4-5-12 9z" fill="#5e574a"/>',
    '<path d="M14 22c-3-14 10-20 16-14 10-2 9 11 6 15l-4-8c-6 3-12 2-15 6z" fill="#66645a"/>',
    '<path d="M14 24c-4-19 27-23 24 0l-6-10-6 5-10-1z" fill="#655342"/>',
    '<path d="M14 21c-1-17 25-17 24 1l-4-7-6 2-9-3z" fill="#7c7e73"/>',
    '<path d="M14 29V18c0-14 24-14 24 0v12l-5-5-1-11-14 7-1 9z" fill="#51504b"/>',
  ][Number(index) % 6] || '';
  return wrap(`<circle cx="26" cy="26" r="25" fill="${bg}"/><path d="M7 52v-7c0-15 38-15 38 0v7" fill="${shirt}"/><path d="M21 30v7l5 5 5-5v-7" fill="${skin}"/><ellipse cx="26" cy="23" rx="11" ry="14" fill="${skin}"/>${hair}<path d="M21 24h1m9 0h1M24 30q2 2 4 0" stroke="#5c584a" stroke-width="1.4" stroke-linecap="round"/><path d="m16 39 7 12m13-12-7 12" stroke="#fff" stroke-opacity=".35" stroke-width="1.4"/>`, '0 0 52 52');
}
