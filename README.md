# Chat_socket

Este é um projeto de chat em tempo real utilizando o módulo `net` do Node.js para criar um servidor e cliente de chat simples. Ambos rodam diretamente no terminal, permitindo a comunicação entre várias instâncias de cliente.

## Requisitos

Antes de começar, certifique-se de ter o Node.js instalado em sua máquina.

## Instruções de Configuração

**1. Instale as dependências**

Não há pacotes externos para instalar, mas você pode querer configurar seu ambiente de TypeScript.

```
npm install
```

**2. Compile o TypeScript para JavaScript**

Para compilar o código TypeScript e gerar os arquivos JavaScript na pasta `/dist`, utilize o comando:

```
npx tsc
```

**3. Inicie o servidor**

Para iniciar o servidor de chat, execute o seguinte comando:

```
node dist/server.js
```

**4. Inicie o cliente**

Para iniciar um cliente e se conectar ao servidor, execute:

```
node dist/client.js
```
Você pode abrir vários terminais e rodar o comando acima em cada um deles para criar múltiplos clientes, que poderão conversar entre si através do servidor.

## Instruções no código
Além de enviar mensagens normais, este chat suporta alguns comandos específicos que você pode executar no terminal:

* **Cutucar um usuário:**

Para cutucar um usuário específico, digite no terminal:
```
/poke nome-do-usuario
```
Isso enviará uma mensagem informando que você cutucou o usuário especificado.

* **Atualizar seu próprio nome:**

Para alterar o seu nome de usuário, utilize o comando:

```
/nick novo-nome
```

>***Observação:*** Este projeto é uma implementação simples de um chat usando o módulo `net` do Node.js, sem interface gráfica. Tudo acontece no terminal, e você pode testar o chat abrindo múltiplos terminais, conectando-os ao servidor.

### Tecnologias Utilizadas
* Node.js
* TypeScript
* Módulo net do Node.js