import { ChatCompletionCreateParams } from 'openai/resources';

export const weatherFunction: ChatCompletionCreateParams.Function = {
  name: 'clima',
  description: 'Busca o clima atual de uma cidade',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'A cidade',
      },
    },
    required: ['city'],
  },
};
