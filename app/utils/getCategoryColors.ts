import { hashString } from "./hash"

const golden_ratio_conjugate = 0.618033988749895 // conjugate = 1/golden ratio

function hsv_to_rgb(h, s, v) {
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    let r, g, b

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function RGBToHex(r,g,b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

export function getCategoryColor(category: string){
    const hashValue = hashString(category)

	const hue = (hashValue % 360) / 360

    console.log({hashValue, hue})

    const toRGB = hsv_to_rgb(hue, .5, .95)

    const {r, g, b} = toRGB

    const rgbString = RGBToHex(r, g, b)

	return rgbString
}

export function getItemColor(category: string){
	const base = getCategoryColor(category)

	return base
}
