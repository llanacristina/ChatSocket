import net from 'net';
import readline from 'readline';

const client = new net.Socket();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cores ANSI
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
};

client.connect(3000, 'localhost', () => {
  console.log('Connected to server');

  rl.question('Enter your nickname: ', (nickname) => {
    client.write(`!nick ${nickname}\n`);
    startChat();
  });
});

client.on('data', (data) => {
  const message = data.toString().trim();

  if (message.startsWith('!msg ')) {
    console.log(message.substring(5));
  } else if (message.startsWith('!changenickname ')) {
    console.log(`${colors.yellow}${message.substring(16)}${colors.reset}`);
  } else if (message.startsWith('!poke ')) {
    console.log(`${colors.yellow}${message.substring(6)}${colors.reset}`);
  } else if (message.startsWith('!users ')) {
    console.log(`${colors.yellow}Usuários conectados: ${message.substring(7)}${colors.reset}`);  }
});

client.on('close', () => {
  console.log('Connection closed');
});

const startChat = () => {
  rl.on('line', (input) => {
    if (input.startsWith('/nick ')) {
      const newNickname = input.substring(6);
      client.write(`!changenickname ${newNickname}\n`);
    } else if (input.startsWith('/poke ')) {
      const targetNickname = input.substring(6);
      client.write(`!poke ${targetNickname}\n`);
    } else {
      client.write(`!sendmsg ${input}\n`);
    }
    rl.prompt();
  });
};
