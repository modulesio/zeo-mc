"use strict";

const LAYERS = [
  {
    legend: {
      'C': 'Cobblestone',
      'S': 'Cobblestone Stairs',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Planks',
      'S': 'Oak Wood Stairs',
      'F': 'Fence',
      'c': 'Crafting Table',
      'D': 'Door',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'O', 'S', 'S', 'S', 'S', ' ', ' ', 'C'],
      ['C', 'S', 'F', ' ', 'F', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', 'c', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'D', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Planks',
      'G': 'Glass Pane',
      'W': 'Wooden Pressure Plate',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'O', 'G', 'G', 'O', 'G', 'G', 'O', 'C'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['G', ' ', 'W', ' ', 'W', ' ', ' ', ' ', 'G'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'G'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['C', 'O', 'G', 'G', 'G', 'O', 'O', ' ', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Planks',
      'G': 'Glass Pane',
      'B': 'Bookshelf',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'C'],
      ['O', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'O'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'G'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'G'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['C', 'O', 'G', 'G', 'G', 'O', 'O', 'O', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Planks',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'C'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['C', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Stairs',
    },
    layout: [
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Stairs',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Stairs',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'O': 'Oak Wood Stairs',
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
];

class Library {
  constructor() {
    this.layers = LAYERS;
  }
}

module.exports = Library;
