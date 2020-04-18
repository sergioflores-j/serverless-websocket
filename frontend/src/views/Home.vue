<template>
  <div class="home">
    <button @click="this.connect">Connect</button>
    <button @click="this.send">Send</button>
    <button @click="this.disconnect">Disconnect</button>
    <pre>{{ messages.join('\n') }}</pre>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      endpoint: 'ws://localhost:3001',
      messages: [],
      websocket: undefined
    };
  },
  methods: {
    connect() {
      /*
       * See https://html.spec.whatwg.org/multipage/indices.html#events-2
       * for details around each WebSocket event type.
       */

      // WebSocket sends a message to API Gateway on creation that gets
      // routed to the '$connect' route
      this.websocket = new WebSocket(this.endpoint);

      console.log('this.websocket', this.websocket);

      // util para reabrir a connection caso tenha sido fechada por inatividade
      this.websocket.onclose = ({ wasClean, code, reason }) => {
        this.messages.push(
          `onclose: ${JSON.stringify({ wasClean, code, reason })}`);
      };

      this.websocket.onerror = error => {
        console.log(error);
        this.messages.push(
          'onerror: An error has occurred. See console for details.'
        );
      };

      this.websocket.onmessage = ({ data }) => {
        this.messages.push(`onmessage: ${data}`);
      };

      this.websocket.onopen = () => {
        this.messages.push('onopen: Connected successfully.');
      };
    },
    send() {
      this.messages.push('client: Sending a message.');

      this.websocket.send(
        // This message will be routed to 'routeA' based on the 'action'
        // property
        JSON.stringify({ action: 'routeA', data: 'Hello from client.' })
      );
      this.websocket.send(
        // This message will be routed to the '$default' route as 'routeB'
        // has not been defined
        JSON.stringify({ action: 'routeB', data: 'Hello from client.' })
      );
    },
    disconnect() {
      // WebSocket sends a $disconnect message to the server on page reload or close, so you do not have to close the connection yourself in those scenarios
      // WebSocket sends a message to API Gateway that gets routed to the
      // '$disconnect' route.
      this.messages.push('client: Closing the connection.');
      this.websocket.close();
    }
  },

  // Discover what the WebSocket endpoint is. This implementation is for
  // demo purposes only and should be done differently in production.
  // async beforeCreate() {
  //   // const response = await fetch('./data.json');
  //   // const { ServiceEndpointWebsocket } = await response.json();
  //   // this.endpoint = ServiceEndpointWebsocket;
  //   // this.endpoint = 'localhost:3001';
  // }
};
</script>
