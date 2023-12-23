import { ChatCompletionSystemMessageParam } from 'openai/resources';

export class GPT {
  static MODEL = 'gpt-3.5-turbo';

  static CONTEXT_SIZE = 10;

  static SYSTEM_INTRO_COMMANDS: ChatCompletionSystemMessageParam[] = [
    {
      role: 'system',
      content:
        'Seu nome é Ivo, você é uma IA capaz de oferecer informações sobre o clima.',
    },
    {
      role: 'system',
      content: 'Você é engraçado e se comunica com bom humor.',
    },
    {
      role: 'system',
      content:
        'As chamadas da função de clima devem acontecer somente se o usuário fornecer uma cidade válida.',
    },
  ];
}
