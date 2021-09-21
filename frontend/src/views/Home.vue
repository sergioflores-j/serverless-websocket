<template>
  <div class="home">
    <button @click="this.connect">Connect</button>
    <button @click="this.send">Send</button>
    <button @click="this.auth">Authenticate</button>
    <button @click="this.disconnect">Disconnect</button>
    <pre>{{ messages.join('\n') }}</pre>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      messages: [],
      websocket: undefined,
      eventType: 'test',
      accountId: '1d0252a0-fbb9-4520-a6b0-b24d8206318d',
      token: 'eyJraWQiOiJXXC9JTFRkaEg0cjNibk5BSW5LRVowaGo0aWFmSUVzelJvXC9DKzA5bGVDbkU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0ZWMzMjE0ZS01YjM0LTQ1OGItOWIxYi0yOTI0NTJkYjZjNGUiLCJjb2duaXRvOmdyb3VwcyI6WyJJTlZFU1RPUiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9qQkNXanJ2cDAiLCJjb2duaXRvOnVzZXJuYW1lIjoiNGVjMzIxNGUtNWIzNC00NThiLTliMWItMjkyNDUyZGI2YzRlIiwidHlwZSI6IklOVkVTVE9SIiwiZ2l2ZW5fbmFtZSI6IlNlcmdpbyIsImFjY291bnRJZCI6IjFkMDI1MmEwLWZiYjktNDUyMC1hNmIwLWIyNGQ4MjA2MzE4ZCIsImF1ZCI6IjFhbjNrYTIzZGs5MHBqOThhOGVtOGc0bHZoIiwiR0JfQURNSU4iOiJmYWxzZSIsInRva2VuX3VzZSI6ImlkIiwicHJvZmlsZUlkIjoiNzEyOGVjNTItYWY0YS00ZmQzLWI5ZDktZmYwZWVmYzk1ZWM2IiwiSU5WRVNUT1IiOiJ7XCIwMjdjMDc0Ny03M2I5LTQwYWYtYTUzYy03NTA0NjdkYWUyYjBcIjp7XCJ0eXBlXCI6XCJJTlZFU1RPUlwiLFwicHJvZmlsZUlkXCI6XCI5ODRkMDRhYS0yMTViLTQ2ZDMtYWVmMy03Zjg5MDI5MDRmZGFcIn0sXCIxZDAyNTJhMC1mYmI5LTQ1MjAtYTZiMC1iMjRkODIwNjMxOGRcIjp7XCJ0eXBlXCI6XCJJTlZFU1RPUlwiLFwicHJvZmlsZUlkXCI6XCI3MTI4ZWM1Mi1hZjRhLTRmZDMtYjlkOS1mZjBlZWZjOTVlYzZcIn0sXCI3MDBiNWJiNi03NTQxLTQxMGQtYTFjMS03OGRlZDk2YjJiZTNcIjp7XCJ0eXBlXCI6XCJJTlZFU1RPUlwiLFwicHJvZmlsZUlkXCI6XCI5NDZlOWQxZS0wZmJkLTRjNDMtYjMyYi0yN2VmNjM5Nzc5NmNcIn19IiwiYXV0aF90aW1lIjoxNjI2NDU3NTE5LCJwaG9uZV9udW1iZXIiOiIrNTU0Nzk5MTY0ODk0NiIsImV4cCI6MTYyNjcxOTU0MCwiaWF0IjoxNjI2NzE1OTQwLCJmYW1pbHlfbmFtZSI6IkNvbnRhY3QiLCJlbWFpbCI6InNlcmdpbytjb250YWN0QGdyb3VuZGJyZWFrZXIuY28ifQ.ThjFAv-VyEVkZ7Mq2YG9xoBorPnSZ3AwMCADZNXttbD0p8h2wNz1M0LQDsmjLstRB6RedwMoT4B7ym_3kPeq_C407J93aRrEPAHFYRpHqXaz_rhKXm9bCtl6UOOiQfS0nHz7Jb4lmuWTwffGqp0txkZ9f5HUn5qrFPx-h2YTBDEdCb54nokdteFovZP2pkcWosAK4tiO3-4cBOlNZG4GsuOHeOWsrXc3MTdzWDt1hvciWh6NNAUp47EO_mK73je5DVtyG0eHtTL26wVQBlxJzraDNhPYJd1hC0I9qGIA2CYH6S-U51ZrGwKrEJOOoRJ_rpvoW9ByjHr-sDbs5-aRaA',
      userRole: 'INVESTOR',
      userId: '6897a769-587a-4b1b-a36f-d5fa66105bcb',
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
      this.websocket = new WebSocket(`${this.$WS_HOST}/?type=${this.eventType}&userRole=${this.userRole}&userId=${this.userId}&accountId=${this.accountId}`);

      console.log('this.websocket', this.websocket);

      // util para reabrir a connection caso tenha sido fechada por inatividade
      this.websocket.onclose = ({ wasClean, code, reason }) => {
        this.messages.push(
          `onclose: ${JSON.stringify({ wasClean, code, reason })}`,
        );
      };

      this.websocket.onerror = (error) => {
        console.log(error);
        this.messages.push(
          'onerror: An error has occurred. See console for details.',
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
        // This message will be routed to 'routeA' based on the 'action' property
        JSON.stringify({ action: 'routeA', data: 'Hello from client.' }),
      );
    },
    auth() {
      this.messages.push('client: authenticating.');

      this.websocket.send(
        // This message will be routed to 'routeA' based on the 'action' property
        JSON.stringify({ action: 'authorize', data: JSON.stringify({ token: this.token, accountId: this.accountId }) }),
      );
    },
    disconnect() {
      // WebSocket sends a $disconnect message to the server on page reload or close, so you do not have to close the connection yourself in those scenarios
      // WebSocket sends a message to API Gateway that gets routed to the '$disconnect' route.
      this.messages.push('client: Closing the connection.');
      this.websocket.close();
    },
  },
};
</script>
