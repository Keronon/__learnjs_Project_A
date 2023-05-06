
import { colors } from './console.colors';
const log = ( data: any ) => console.log( colors.fg.gray, `- - > R-Films :`, data, colors.reset );

import * as amqp from 'amqplib';
import { HttpException, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';

export interface Message { id_msg: string, cmd: string, data: any }

const ExchangeTypes = { ByKEY: undefined, ByBindKEY: 'direct', ToALL: 'fanout', HEADERS: 'headers', ByFILTER: 'topic' };
const queueOptions  : amqp.Options.AssertQueue = { expires : 5000 };

const exchangeName = 'CMDs - DATA';
// ! different in any service
export enum QueueNames { FFI_cmd = 'FFI_cmd', FFI_data = 'FFI_data',
                         CF_cmd = 'CF_cmd', CF_data = 'CF_data',
                         FC_cmd = 'FC_cmd', FC_data = 'FC_data',
                         FR_cmd = 'FR_cmd', FR_data = 'FR_data',
                         RF_cmd = 'RF_cmd', RF_data = 'RF_data',
                         FRU_cmd = 'FRU_cmd', FRU_data = 'FRU_data',
                         FFM_cmd = 'FFM_cmd', FFM_data = 'FFM_data',
                         FMF_cmd = 'FMF_cmd', FMF_data = 'FMF_data' };

class Rabbit
{
    public channel : amqp.Channel;

    // connect to rabbit
    async connect()
    {
        log('connect');

        this.channel = await ( await amqp.connect(process.env.AMQP_URL) ).createChannel();
        await this.channel.assertExchange( exchangeName, ExchangeTypes.ByKEY );
    }

    async assertQueue(queueName: string)
    {
        log('assertQueue');

        if ( !this.channel ) throw new InternalServerErrorException({ message: `No connection to rabbit channel` });

        // join data queue
        const queue = await this.channel.assertQueue( queueName, queueOptions );
        await this.channel.bindQueue( queue.queue, exchangeName, queueName );

        return queue;
    }

    private async publishMessage(queueName: string, message: Message)
    {
        log('publishMessage');

        const queue = await this.assertQueue(queueName);

        this.channel.publish( exchangeName, queueName,
            Buffer.from( JSON.stringify( message ) ) );
    }

    async publishReq(reqQueueName: string, resQueueName: string, message: Message)
    {
        log('publishReq');

        await this.publishMessage(reqQueueName, message);
        return await this.acceptRes(resQueueName, message.id_msg);
    }

    async acceptRes( queueName: string, id_msg: string )
    {
        log('acceptRes');

        const queue = await this.assertQueue(queueName);

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

        if (data.data instanceof Object    &&
            'name'    in         data.data &&
            data.data.name.includes('Exception'))
            throw new HttpException(data.data.response, data.data.status);

        return data.data;
    }

    setCmdConsumer(_this, reqQueueName: string, resQueueName: string)
    {
        log('setCmdConsumer');

        return () =>
        {
            this.assertQueue(reqQueueName).then
            ((res) =>
                this.channel.consume( res.queue, ( msg ) =>
                {
                    log('consume');

                    const message: Message = JSON.parse( msg.content.toString() );

                    const back = (res) =>
                    {
                        this.publishMessage( resQueueName, { id_msg: message.id_msg, cmd: message.cmd, data: res } );
                        this.channel.ack( msg );
                    };

                    try
                    {
                        const deal = _this[ message.cmd ]( message.data );

                        if ( deal instanceof Promise ) {
                            deal.then( back ).catch
                            ((ex) => back(ex));
                        }
                        else back( deal );
                    }
                    catch (ex)
                    {
                        back(ex);
                    }
                } )
            );
        };
    }
}

export const RMQ = new Rabbit;
