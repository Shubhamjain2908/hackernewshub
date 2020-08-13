import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    stories: Array<number>;
}

const expirationQueue = new Queue<Payload>('story:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        stories: job.data.stories
    });
});

export { expirationQueue };

