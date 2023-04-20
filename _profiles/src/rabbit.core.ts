
import { colors } from './console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > R-Profiles :`, data, colors.reset );

import * as amqp from 'amqplib';
import { ConflictException, RequestTimeoutException } from '@nestjs/common';

export interface Message { id_msg: string, cmd: string, data: any }

const exchangeTypes = { ByKEY: undefined, ByBindKEY: 'direct', ToALL: 'fanout', HEADERS: 'headers', ByFILTER: 'topic' };

const exchangeNames = { P_A: `profiles - auth` };

export const queueNames   = { CMDs: `cmd`, DATA: `data` };
       const queueOptions : amqp.Options.AssertQueue = { expires : 5000 };

class Rabbit
{
    public channel : amqp.Channel;

    // connect to rabbit
    async connect()
    {
        log('connect');

        this.channel = await ( await amqp.connect( process.env.AMQP_URL ) ).createChannel();
        await this.channel.assertExchange( exchangeNames.P_A, exchangeTypes.ByKEY );
    }

    async assertQueue(queueName: string)
    {
        log('assertQueue');

        if ( !this.channel ) throw new ConflictException({ message: `No connection to rabbit channel` });

        // join data queue
        const queue = await RMQ.channel.assertQueue( queueName, queueOptions );
        await this.channel.bindQueue( queue.queue, exchangeNames.P_A, queueName );

        return queue;
    }

    async publishReq(message: Message)
    {
        log('publishReq');

        this.publishMessage(message, queueNames.CMDs);
    }

    async publishRes(message: Message)
    {
        log('publishRes');

        this.publishMessage(message, queueNames.DATA);
    }

    private async publishMessage(message: Message, queueName: string)
    {
        log('publishMessage');

        const queue = await this.assertQueue(queueName);

        this.channel.publish( exchangeNames.P_A, queueName,
            Buffer.from( JSON.stringify( message ) ) );
    }

    async acceptRes( id_msg: string )
    {
        log('acceptRes');

        const queue = await this.assertQueue(queueNames.DATA);

        let out = false;
        new Promise(() =>
        {
            setTimeout(() => { out = true; }, 3000);
        });

        let msg: amqp.GetMessage | boolean;
        while ( !msg && !out )
        {
            msg = await this.channel.get( queue.queue );
        }

        if (!msg && out) throw new RequestTimeoutException({ message: 'Response did not come' });

        msg = msg as amqp.GetMessage;
        const data: Message = JSON.parse( ( msg.content.toString() ) );
        if ( data.id_msg === id_msg ) this.channel.ack( msg );

        return data.data;
    }

    setCmdConsumer(_this)
    {
        log('setCmdConsumer');

        return () =>
        {
            RMQ.assertQueue(queueNames.CMDs).then
            ((res) =>
                RMQ.channel.consume( res.queue, ( msg ) =>
                {
                    log('consume');

                    const message: Message = JSON.parse( msg.content.toString() ) ;

                    try
                    {
                        const deal = _this[ message.cmd ]( message.data );

                        const back = (res) =>
                        {
                            RMQ.publishRes( { id_msg: message.id_msg, cmd: message.cmd, data: res } );
                            RMQ.channel.ack( msg );
                        };

                        if ( deal instanceof Promise ) deal.then( back ).catch
                        ((ex) => {
                            RMQ.publishRes( { id_msg: message.id_msg, cmd: message.cmd, data: ex } );
                            RMQ.channel.ack( msg );
                        });
                        else back( deal );
                    }
                    catch (ex)
                    {
                        RMQ.publishRes( { id_msg: message.id_msg, cmd: message.cmd, data: ex } );
                        RMQ.channel.ack( msg );
                    }
                } )
            );
        };
    }
}

export const RMQ = new Rabbit;
