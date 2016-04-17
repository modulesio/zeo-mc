"use strict";

const LAYERS = [
  {
    legend: {
      'S': 'cobblestone',
      'P': 'planks',
      's': 'cobblestone-stairs',
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', 'S', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', 's', ' ', ' '],
    ]
  },
  {
    legend: {
      'S': 'cobblestone',
      'D': 'door',
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'D', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'S': 'cobblestone',
      'W': 'wood',
      'G': 'glass-pane',
      'P': 'planks',
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', ' '],
      ['W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      ['G', ' ', ' ', ' ', ' ', ' ', 'G', ' ', ' '],
      ['G', ' ', ' ', ' ', ' ', ' ', 'G', ' ', ' '],
      ['W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      ['P', ' ', ' ', ' ', ' ', ' ', 'P', 'P', 'S'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'G'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'G'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['S', 'P', 'W', 'G', 'W', 'P', ' ', 'P', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'S': 'cobblestone',
      'P': 'planks',
      's': 'stairs',
      'T': 'torch',
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 's', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 's', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 's', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 's', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 'P', 's'],
      ['S', ' ', ' ', ' ', ' ', ' ', 'P', 'P', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', 'T', ' ', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'D', 'S', 'S'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
    ]
  },
  {
    legend: {
      'W': 'wood',
      'P': 'planks',
      'G': 'glass',
      's': 'stairs',
    },
    layout: [
      ['s', 'P', 'W', 'G', 'W', 'P', 's', ' ', ' '],
      ['s', 'P', ' ', ' ', ' ', 'P', 's', ' ', ' '],
      ['s', 'P', ' ', ' ', ' ', 'P', 's', ' ', ' '],
      ['s', 'P', ' ', ' ', ' ', 'P', 's', ' ', ' '],
      ['s', 'P', ' ', ' ', ' ', 'P', 's', ' ', ' '],
      ['s', 'P', ' ', ' ', ' ', 'P', 'P', 's', 's'],
      ['P', 'P', ' ', ' ', ' ', 'P', 'P', 'P', 'P'],
      ['P', 'P', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['P', 'P', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'W': 'wood',
      'P': 'planks',
      'G': 'glass',
      's': 'stairs',
    },
    layout: [
      [' ', 's', 'P', 'P', 'P', 's', ' ', ' ', ' '],
      [' ', 's', 'P', ' ', 'P', 's', ' ', ' ', ' '],
      [' ', 's', 'P', ' ', 'P', 's', ' ', ' ', ' '],
      [' ', 's', 'P', ' ', 'P', 's', ' ', ' ', ' '],
      [' ', 's', 'P', ' ', 'P', 's', ' ', ' ', ' '],
      [' ', 's', 'P', ' ', 'P', 's', ' ', ' ', ' '],
      ['s', 'P', 'P', ' ', 'P', 'P', 's', 's', 's'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'W': 'wood',
      'P': 'planks',
      'G': 'glass',
      's': 'stairs',
    },
    layout: [
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      [' ', 's', 'P', 's', ' ', ' ', ' ', ' ', ' '],
      ['s', 's', 'P', 'P', 'P', 's', 's', 's', 's'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
];

class HouseLarge {
  constructor() {
    this.layers = LAYERS;
  }
}

module.exports = HouseLarge;
