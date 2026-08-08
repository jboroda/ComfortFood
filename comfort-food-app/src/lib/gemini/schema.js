import { Type } from '@google/genai';

export const RECOMMENDATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    encouragingWords: { type: Type.STRING },
    heroDish: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        tagline: { type: Type.STRING },
        whyItHeals: { type: Type.STRING },
      },
      required: ['name', 'tagline', 'whyItHeals'],
    },
    pathways: {
      type: Type.OBJECT,
      properties: {
        express15Min: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['title', 'summary', 'ingredients', 'instructions'],
        },
        deepDive2Hour: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['title', 'summary', 'ingredients', 'instructions'],
        },
        friendCook: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            personA: { type: Type.ARRAY, items: { type: Type.STRING } },
            personB: { type: Type.ARRAY, items: { type: Type.STRING } },
            winePairing: { type: Type.STRING },
          },
          required: ['title', 'summary', 'ingredients', 'personA', 'personB'],
        },
        minimalist5: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['title', 'summary', 'ingredients', 'instructions'],
        },
        localSpot: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            searchQuery: { type: Type.STRING },
          },
          required: ['title', 'summary', 'searchQuery'],
        },
        onlineOrder: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            searchQuery: { type: Type.STRING },
          },
          required: ['title', 'summary', 'searchQuery'],
        },
      },
      required: ['express15Min', 'deepDive2Hour', 'friendCook', 'minimalist5', 'localSpot', 'onlineOrder'],
    },
  },
  required: ['encouragingWords', 'heroDish', 'pathways'],
};
