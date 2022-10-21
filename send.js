const { EventHubProducerClient } = require("@azure/event-hubs");

const connectionString = "Endpoint=sb://pagopa-d-evh-ns01.servicebus.windows.net/;SharedAccessKeyName=";
const eventHubName = "nodo-dei-pagamenti-biz-evt";

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

async function main() {

    // Create a producer client to send messages to the event hub.
    const producer = new EventHubProducerClient(connectionString, eventHubName);

    const newBtzEvt = {
        id: makeid(10),
        debtorPosition : {
          modelType: "2",
          noticeNumber : "302040000097735020584",
          iuv: "97735020584"
        },
        creditor : {
          idPA: "77777777777",
          idBrokerPA: "77777777777",
          idStation: "77777777777_01",
          companyName: "company EC"
        }
    }

    // Prepare a batch of three events.
    const batch = await producer.createBatch();
    batch.tryAdd({ body: newBtzEvt } );
    // batch.tryAdd({ body: "Second event" });
    // batch.tryAdd({ body: "Third event" });

    // Send the batch to the event hub.
    await producer.sendBatch(batch);

    // Close the producer client.
    await producer.close();

    console.log("A batch of events have been sent to the event hub");
}

main().catch((err) => {
    console.log("Error occurred: ", err);
});