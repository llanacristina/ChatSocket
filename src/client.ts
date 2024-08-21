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
    client.write(JSON.stringify({ type: 'nickname', data: nickname }) + '\n');
    startChat();
  });
});

client.on('data', (data) => {
  const message = data.toString().trim();
  const parsedMessage = JSON.parse(message);
  
  if (parsedMessage.type === 'system') {
    console.log(`${colors.yellow}[System] ${parsedMessage.message}${colors.reset}`);

  } else if (parsedMessage.type === 'message') {
    console.log(`[${parsedMessage.nickname}] ${parsedMessage.message}`);
  } else if (parsedMessage.type === 'user-list') {
    console.log('Usuários conectados:', parsedMessage.data.join(', '));
  }
});

client.on('close', () => {
  console.log('Connection closed');
});

const startChat = () => {
  rl.on('line', (input) => {
    if (input.startsWith('/nick ')) {
      const newNickname = input.substring(6);
      client.write(JSON.stringify({ type: 'update-nickname', data: newNickname }) + '\n');
    } else if (input.startsWith('/poke ')) {
      const targetNickname = input.substring(6);
      client.write(JSON.stringify({ type: 'poke', data: targetNickname }) + '\n');
    } else {
      client.write(JSON.stringify({ type: 'message', data: input }) + '\n');
    }
  });
};
