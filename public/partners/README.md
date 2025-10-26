# Partner Logos

This directory is for storing partner company logos.

## How to Add Partner Logos

### 1. Download Logos Manually

Visit each partner website and download their logos:

1. **Agni Steels** - https://agnisteels.com/
2. **Arise Steel** - https://www.arisesteel.com/
3. **Metstar** - https://metstar.in/
4. **Ambica Steels** - https://ambicasteels.com/
5. **DCW Limited** - https://dcwltd.com/
6. **NLC India** - https://www.nlcindia.in/
7. **VinFast Auto** - https://vinfastauto.in/en
8. **Palladam Steels** - (website URL needed)

### 2. Save Logos in This Directory

Save each logo with a standardized name format:
- `agni-steels.png` or `agni-steels.svg`
- `arise-steel.png` or `arise-steel.svg`
- `metstar.png` or `metstar.svg`
- `ambica-steels.png` or `ambica-steels.svg`
- `dcw-limited.png` or `dcw-limited.svg`
- `nlc-india.png` or `nlc-india.svg`
- `vinfast-auto.png` or `vinfast-auto.svg`
- `palladam-steels.png` or `palladam-steels.svg`

### 3. Recommended Logo Specifications

- **Format**: PNG (with transparent background) or SVG
- **Dimensions**: 200x200 pixels minimum
- **File Size**: Keep under 100KB for optimal loading
- **Color**: Original brand colors (code will handle grayscale/hover effects)

### 4. Update the Homepage Code

Once logos are added, update `src/app/page.tsx` to use `next/image` component:

```tsx
import Image from 'next/image'

// Replace the gradient icon divs with:
<div className="w-16 h-16 mx-auto mb-3 relative">
  <Image
    src="/partners/agni-steels.png"
    alt="Agni Steels"
    width={64}
    height={64}
    className="object-contain grayscale group-hover:grayscale-0 transition-all"
  />
</div>
```

## Current Status

Currently using gradient-colored icon placeholders. Replace with actual logos for production.

