/* eslint-disable eslint-comments/require-description -- mock data */
/* eslint-disable no-magic-numbers */
/* eslint-disable @cspell/spellchecker */
import { DataSource } from 'typeorm';

import { ShopEntity } from '../../src/modules/shop/entities/shop.entity.js';

export const createShops = async (dataSource: DataSource): Promise<void> => {
  try {
    console.debug('Creating shops...');

    const shopRepository = dataSource.getRepository(ShopEntity);

    await shopRepository.save(shops);

    console.debug('Shops have been created successfully!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const shops: Partial<ShopEntity>[] = [
  {
    name: 'Tokyo Market',
    address: '1-1 Chiyoda, Tokyo 100-0001, Japan',
    location: { type: 'Point', coordinates: [139.753595, 35.68536] },
  },
  {
    name: 'Berlin Bookstore',
    address: 'Unter den Linden 10, 10117 Berlin, Germany',
    location: { type: 'Point', coordinates: [13.388859, 52.517037] },
  },
  {
    name: 'Sydney Café',
    address: '10 George St, Sydney NSW 2000, Australia',
    location: { type: 'Point', coordinates: [151.2099, -33.865143] },
  },
  {
    name: 'New York Bakery',
    address: '350 5th Ave, New York, NY 10118, USA',
    location: { type: 'Point', coordinates: [-73.985656, 40.748817] },
  },
  {
    name: 'Paris Boutique',
    address: '10 Rue de Rivoli, 75001 Paris, France',
    location: { type: 'Point', coordinates: [2.351499, 48.856696] },
  },
  {
    name: 'Cape Town Store',
    address: '1 Adderley St, Cape Town, 8000, South Africa',
    location: { type: 'Point', coordinates: [18.424055, -33.924868] },
  },
  {
    name: 'Rio de Janeiro Souvenirs',
    address: 'Av. Atlântica, 1702 - Copacabana, Rio de Janeiro - RJ, Brazil',
    location: { type: 'Point', coordinates: [-43.180277, -22.971177] },
  },
  {
    name: 'Toronto Electronics',
    address: '100 Queen St W, Toronto, ON M5H 2N2, Canada',
    location: { type: 'Point', coordinates: [-79.383186, 43.653225] },
  },
  {
    name: 'Moscow Grocery',
    address: 'Red Square, Moscow, Russia, 109012',
    location: { type: 'Point', coordinates: [37.618423, 55.751244] },
  },
  {
    name: 'Dubai Mall',
    address: 'Downtown Dubai, Dubai, United Arab Emirates',
    location: { type: 'Point', coordinates: [55.274288, 25.197525] },
  },
];
