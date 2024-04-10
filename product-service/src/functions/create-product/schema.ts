export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number', default: 0 }
  },
  required: ['title', 'description', 'price']
} as const;
