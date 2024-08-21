import net from 'net';

// Definição das cores ANSI
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
};

interface Client {
  socket: net.Socket;
  nickname?: string;
}

const clients: Client[] = [];

const getConnectedNicknames = (): string[] => {
  return clients.map((client) => client.nickname || 'Unknown');
};

const broadcastUserList = () => {
  const nicknames = getConnectedNicknames();
  console.log('-----------------------------');
  console.log('Usuários conectados:');
  nicknames.forEach((nickname) => {
    console.log(`- ${nickname}`);
  });
  console.log('-----------------------------');

  clients.forEach((client) => {
    client.socket.write(JSON.stringify({
      type: 'user-list',
      data: nicknames,
    }) + '\n');
  });
};

const server = net.createServer((socket) => {
  const client: Client = { socket };
  clients.push(client);

  socket.on('data', (data) => {
    const message = data.toString().trim();
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'nickname') {
      client.nickname = parsedMessage.data;
      console.log(`${colors.yellow}Cliente conectado com nome: ${client.nickname} ${colors.reset}`);

      clients.forEach((c) => {
        c.socket.write(JSON.stringify({
          type: 'system',
          message: `${client.nickname} conectou-se à sala.`,
        }) + '\n');
      });

      broadcastUserList();
    }

    if (parsedMessage.type === 'update-nickname') {
      const oldNickname = client.nickname;
      client.nickname = parsedMessage.data;
      console.log(`${oldNickname} alterado para ${client.nickname}`);

      clients.forEach((c) => {
        c.socket.write(JSON.stringify({
          type: 'system',
          message: `${oldNickname} alterado para ${client.nickname}`,
        }) + '\n');
      });

      broadcastUserList();
    }

    if (parsedMessage.type === 'message') {
      const displayMessage = `${client.nickname}: ${parsedMessage.data}`;
      console.log(displayMessage);

      clients.forEach((c) => {
        if (c !== client) {
          c.socket.write(JSON.stringify({
            type: 'message',
            nickname: client.nickname,
            message: parsedMessage.data,
          }) + '\n');
        }
      });
    }

    if (parsedMessage.type === 'poke') {
      const targetClient = clients.find((c) => c.nickname === parsedMessage.data);

      if (targetClient) {
        clients.forEach((c) => {
          c.socket.write(JSON.stringify({
            type: 'system',
            message: `${client.nickname} cutucou ${targetClient.nickname}!`,
          }) + '\n');
        });

        console.log(`${client.nickname} cutucou ${targetClient.nickname}!`);
      } else {
        client.socket.write(JSON.stringify({
          type: 'system',
          message: `O usuário ${parsedMessage.data} não está conectado.`,
        }) + '\n');
      }
    }
  });

  socket.on('end', () => {
    console.log(`${colors.yellow}Cliente ${client.nickname || 'Unknown'} desconectado ${colors.reset}`);
    clients.splice(clients.indexOf(client), 1);

    clients.forEach((c) => {
      c.socket.write(JSON.stringify({
        type: 'system',
        message: `${client.nickname} desconectou-se da sala.`,
      }) + '\n');
    });

    broadcastUserList();
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
