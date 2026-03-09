import type { CatalogIcon } from '@/types';

export const CLOTHING_ICONS: CatalogIcon[] = [
  // Tops
  { id: 'tops-tshirt',      category: 'tops',        label: 'T-Shirt',        path: '/icons/clothing/tops/tshirt.svg' },
  { id: 'tops-blouse',      category: 'tops',        label: 'Blouse',         path: '/icons/clothing/tops/blouse.svg' },
  { id: 'tops-tank',        category: 'tops',        label: 'Tank Top',       path: '/icons/clothing/tops/tank.svg' },
  { id: 'tops-longsleeve',  category: 'tops',        label: 'Long Sleeve',    path: '/icons/clothing/tops/longsleeve.svg' },
  { id: 'tops-sweater',     category: 'tops',        label: 'Sweater',        path: '/icons/clothing/tops/sweater.svg' },
  // Bottoms
  { id: 'bottoms-jeans',    category: 'bottoms',     label: 'Jeans',          path: '/icons/clothing/bottoms/jeans.svg' },
  { id: 'bottoms-shorts',   category: 'bottoms',     label: 'Shorts',         path: '/icons/clothing/bottoms/shorts.svg' },
  { id: 'bottoms-skirt',    category: 'bottoms',     label: 'Skirt',          path: '/icons/clothing/bottoms/skirt.svg' },
  { id: 'bottoms-trousers', category: 'bottoms',     label: 'Trousers',       path: '/icons/clothing/bottoms/trousers.svg' },
  // Dresses
  { id: 'dresses-casual',   category: 'dresses',     label: 'Casual Dress',   path: '/icons/clothing/dresses/casual.svg' },
  { id: 'dresses-formal',   category: 'dresses',     label: 'Formal Dress',   path: '/icons/clothing/dresses/formal.svg' },
  { id: 'dresses-jumpsuit', category: 'dresses',     label: 'Jumpsuit',       path: '/icons/clothing/dresses/jumpsuit.svg' },
  // Outerwear
  { id: 'outerwear-jacket', category: 'outerwear',   label: 'Jacket',         path: '/icons/clothing/outerwear/jacket.svg' },
  { id: 'outerwear-rain',   category: 'outerwear',   label: 'Rain Jacket',    path: '/icons/clothing/outerwear/rain.svg' },
  { id: 'outerwear-coat',   category: 'outerwear',   label: 'Coat',           path: '/icons/clothing/outerwear/coat.svg' },
  { id: 'outerwear-cardigan',category:'outerwear',   label: 'Cardigan',       path: '/icons/clothing/outerwear/cardigan.svg' },
  // Shoes
  { id: 'shoes-sneakers',   category: 'shoes',       label: 'Sneakers',       path: '/icons/clothing/shoes/sneakers.svg' },
  { id: 'shoes-heels',      category: 'shoes',       label: 'Heels',          path: '/icons/clothing/shoes/heels.svg' },
  { id: 'shoes-sandals',    category: 'shoes',       label: 'Sandals',        path: '/icons/clothing/shoes/sandals.svg' },
  { id: 'shoes-boots',      category: 'shoes',       label: 'Boots',          path: '/icons/clothing/shoes/boots.svg' },
  { id: 'shoes-flats',      category: 'shoes',       label: 'Flats',          path: '/icons/clothing/shoes/flats.svg' },
  // Accessories
  { id: 'acc-hat',          category: 'accessories', label: 'Hat',            path: '/icons/clothing/accessories/hat.svg' },
  { id: 'acc-scarf',        category: 'accessories', label: 'Scarf',          path: '/icons/clothing/accessories/scarf.svg' },
  { id: 'acc-sunglasses',   category: 'accessories', label: 'Sunglasses',     path: '/icons/clothing/accessories/sunglasses.svg' },
  { id: 'acc-belt',         category: 'accessories', label: 'Belt',           path: '/icons/clothing/accessories/belt.svg' },
  { id: 'acc-jewelry',      category: 'accessories', label: 'Jewelry',        path: '/icons/clothing/accessories/jewelry.svg' },
  // Bags
  { id: 'bags-backpack',    category: 'bags',        label: 'Backpack',       path: '/icons/clothing/bags/backpack.svg' },
  { id: 'bags-tote',        category: 'bags',        label: 'Tote Bag',       path: '/icons/clothing/bags/tote.svg' },
  { id: 'bags-crossbody',   category: 'bags',        label: 'Crossbody',      path: '/icons/clothing/bags/crossbody.svg' },
  { id: 'bags-clutch',      category: 'bags',        label: 'Clutch',         path: '/icons/clothing/bags/clutch.svg' },
];

export const ICONS_BY_CATEGORY = CLOTHING_ICONS.reduce((acc, icon) => {
  if (!acc[icon.category]) acc[icon.category] = [];
  acc[icon.category].push(icon);
  return acc;
}, {} as Record<string, CatalogIcon[]>);
