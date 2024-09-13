import { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';

const fakeMessages = (req: NextApiRequest, res: NextApiResponse) => {
  // Cria uma lista de mensagens fictícias
  const messages = Array.from({ length: 5 }, () => ({
    text: faker.hacker.phrase(),
    sender: faker.internet.userName(),
    time: new Date().toLocaleTimeString(),
  }));

  // Envia as mensagens fictícias como resposta
  res.status(200).json(messages);
};

export default fakeMessages;
