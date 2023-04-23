
import { colors } from './console.colors';
const log = ( data: any ) => console.log( colors.fg.gray, `- - > R-Film_info :`, data, colors.reset );

import * as amqp from 'amqplib';
import { ConflictException, RequestTimeoutException } from '@nestjs/common';

export interface Message { id_msg: string, cmd: string, data: any }

const ExchangeTypes = { ByKEY: undefined, ByBindKEY: 'direct', ToALL: 'fanout', HEADERS: 'headers', ByFILTER: 'topic' };
const queueOptions  : amqp.Options.AssertQueue = { expires : 5000 };

export enum ExchangeNames { F_FI = 'films - film_info' }; // ! different in any service
export enum QueueNames    { CMDs = `cmd`, DATA = `data` };

class Rabbit
{
    public channel : amqp.Channel;

    // connect to rabbit
    async connect()
    {
        log('connect');

        this.channel = await ( await amqp.connect( process.env.AMQP_URL ) ).createChannel();

        // ! different in any service
        await this.channel.assertExchange( ExchangeNames.F_FI, ExchangeTypes.ByKEY );
    }

    async assertQueue(queueName: string)
    {
        log('assertQueue');

        if ( !this.channel ) throw new ConflictException({ message: `No connection to rabbit channel` });

        // join data queue
        const queue = await RMQ.channel.assertQueue( queueName, queueOptions );
        await this.channel.bindQueue( queue.queue, ExchangeNames.F_FI, queueName );

        return queue;
    }

    async publishReq(exchangeName: string, message: Message)
    {
        log('publishReq');

        this.publishMessage(exchangeName, QueueNames.CMDs, message);
    }

    async publishRes(exchangeName: string, message: Message)
    {
        log('publishRes');

        this.publishMessage(exchangeName, QueueNames.DATA, message);
    }

    private async publishMessage(exchangeName: string, queueName: string, message: Message)
    {
        log('publishMessage');

        const queue = await this.assertQueue(queueName);

        this.channel.publish( exchangeName, queueName,
            Buffer.from( JSON.stringify( message ) ) );
    }

    async acceptRes( id_msg: string )
    {
        log('acceptRes');

        const queue = await this.assertQueue(QueueNames.DATA);

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

        if ('name' in data.data && (data.data.name.includes('Exception') ||
                                    data.data.name.includes('Error'    ) ))
            throw eval('new ' + data.data.name + '(data.data.response);'); // throw data.data;

        return data.data;
    }

    setCmdConsumer(_this, exchangeName: string)
    {
        log('setCmdConsumer');

        return () =>
        {
            RMQ.assertQueue(QueueNames.CMDs).then
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
                            RMQ.publishRes( exchangeName, { id_msg: message.id_msg, cmd: message.cmd, data: res } );
                            RMQ.channel.ack( msg );
                        };

                        if ( deal instanceof Promise ) {
                            deal.then( back ).catch
                            ((ex) => {
                                RMQ.publishRes( exchangeName, { id_msg: message.id_msg, cmd: message.cmd, data: ex } );
                                RMQ.channel.ack( msg );
                            });
                        }
                        else back( deal );
                    }
                    catch (ex)
                    {
                        RMQ.publishRes( exchangeName, { id_msg: message.id_msg, cmd: message.cmd, data: ex } );
                        RMQ.channel.ack( msg );
                    }
                } )
            );
        };
    }
}

export const RMQ = new Rabbit;
