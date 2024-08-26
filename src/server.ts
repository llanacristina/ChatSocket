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
  const userListMessage = `!users [${nicknames.length}] ${nicknames.join(' / ')}`;
  clients.forEach((client) => {
    client.socket.write(`${userListMessage}`);
  });
};

const printUserList = () => {
  const nicknames = getConnectedNicknames();
  console.log(`Usuários conectados: [${nicknames.length}] ${nicknames.join(', ')}`);
};

const server = net.createServer((socket) => {
  const client: Client = { socket };
  clients.push(client);

  socket.on('data', (data) => {
    const message = data.toString().trim();

    if (message.startsWith('!nick ')) {
      const nickname = message.substring(6).trim();
      if (nickname) {
        client.nickname = nickname;
        console.log(`${colors.yellow}Cliente conectado com nome: ${client.nickname} ${colors.reset}`);

        clients.forEach((c) => {
          if (c !== client) {
            c.socket.write(`!msg ${client.nickname} entrou na sala.`);
          }
        });

        broadcastUserList();
        printUserList(); 
      } else {
        socket.end();
      }
    }

    if (message.startsWith('!changenickname ')) {
      const newNickname = message.substring(16).trim();
      const oldNickname = client.nickname;
      if (newNickname && oldNickname) {
        client.nickname = newNickname;
        console.log(`${oldNickname} alterado para ${client.nickname}`);

        clients.forEach((c) => {
          c.socket.write(`!msg ${oldNickname} alterado para ${client.nickname}`);
        });

        broadcastUserList();
        printUserList(); 
      }
    }

    if (message.startsWith('!sendmsg ')) {
      const msg = message.substring(9).trim();
      if (client.nickname && msg) {
        const displayMessage = `[${client.nickname}]: ${msg}`;
        console.log(displayMessage);

        clients.forEach((c) => {
          if (c !== client) {
            c.socket.write(`!msg [${client.nickname}]: ${msg}`);
          }
        });
      }
    }

    if (message.startsWith('!poke ')) {
      const targetNickname = message.substring(6).trim();
      const targetClient = clients.find((c) => c.nickname === targetNickname);

      if (targetClient && client.nickname) {
        const pokeMessage = `${client.nickname} cutucou ${targetClient.nickname}`;
        clients.forEach((c) => {
          c.socket.write(`!poke ${pokeMessage}`);
        });

        console.log(pokeMessage);
      } else {
        client.socket.write(`!msg ${targetNickname} não está conectado.`);
      }
    }
  });

  socket.on('end', () => {
    console.log(`${colors.yellow}Cliente ${client.nickname || 'Unknown'} desconectado ${colors.reset}`);
    clients.splice(clients.indexOf(client), 1);

    if (client.nickname) {
      clients.forEach((c) => {
        c.socket.write(`!msg ${client.nickname} desconectou-se da sala.`);
      });
    }

    broadcastUserList();
    printUserList(); 
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
