import { ChatCompletionCreateParams } from 'openai/resources';

export const weatherFunctionSpec: ChatCompletionCreateParams.Function = {
  name: 'clima',
  description: 'Busca o clima atual de uma cidade',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'Uma cidade válida',
      },
    },
    required: ['city'],
  },
};
