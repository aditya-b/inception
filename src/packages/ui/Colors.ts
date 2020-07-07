import * as colors from "@material-ui/core/colors";
import { map } from "lodash";

const InceptionColors: string[] = [];

map(colors, colorSet => {
    map(colorSet, v => {
        InceptionColors.push(v);
    })
})

function hexToRGB(hex: string) {
    let r:any = '', g:any = '', b:any = '';
  
    // 3 digits
    if (hex.length === 4) {
      r = hex[1] + hex[1];
      g = hex[2] + hex[2];
      b = hex[3] + hex[3];
  
    // 6 digits
    } else if (hex.length === 7) {
      r = hex[1] + hex[2];
      g = hex[3] + hex[4];
      b = hex[5] + hex[6];
    }

    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);
    
    return `${r},${g},${b}`;
  }

export function strToRGBColor(str: string) {
    let  hash = 0

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = Math.abs(hash) % InceptionColors.length;
    const color = InceptionColors[hash]
    return hexToRGB(color);
} 

