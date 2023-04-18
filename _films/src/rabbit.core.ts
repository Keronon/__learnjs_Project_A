
const log = ( data: any ) => console.log( colors.fg.blue, ` - > R-Profiles :`, data, colors.reset );

import * as amqp from 'amqplib';
import { colors } from './console.colors';

// structs
import { MsgData } from './structs.core';
import { HttpException, HttpStatus } from '@nestjs/common';

const exchangeName  = `profiles - users`;
const exchangeKeys  = { CMDs: `cmd`, DATA: `data` };
const exchangeTypes = { ByKEY: undefined, ByBindKEY: 'direct', ToALL: 'fanout', HEADERS: 'headers', ByFILTER: 'topic' };
const queueOptions  : amqp.Options.AssertQueue = { expires : 5000 };

export class Rabbit
{
    private channel  : amqp.Channel;
    private queueCMDs: amqp.Replies.AssertQueue;
    private queueDATA: amqp.Replies.AssertQueue;

    // initializing of rabbit service objects
    async Prepare()
    {
        log(`prepare`);

        // connecting to rabbit
        this.channel = await ( await amqp.connect( process.env.AMQP_URL ) ).createChannel();
        await this.channel.assertExchange( exchangeName, exchangeTypes.ByKEY );

        // creating commands queue
        this.queueCMDs = await this.channel.assertQueue( `CMDs`, queueOptions );
        await this.channel.bindQueue( this.queueCMDs.queue, exchangeName, exchangeKeys.CMDs );
    }

    Publish( data: MsgData )
    {
        log(`publish`);

        if ( !this.channel ) throw new HttpException( `No connection to rabbit channel`, HttpStatus.CONFLICT );

        this.channel.publish( exchangeName, exchangeKeys.CMDs,
            Buffer.from( JSON.stringify( data ) ) );
    }

    async Get( cmd: string )
    {
        log(`consume`);

        if ( !this.channel ) throw new HttpException( `No connection to rabbit channel`, HttpStatus.CONFLICT );

        // creating data queue
        this.queueDATA = await this.channel.assertQueue( `DATA`, queueOptions );
        await this.channel.bindQueue( this.queueDATA.queue, exchangeName, exchangeKeys.DATA );

        let msg: amqp.GetMessage | boolean;

        while ( !msg )
        {
            msg = await this.channel.get( this.queueDATA.queue );
        }

        msg = msg as amqp.GetMessage;
        const data: MsgData = JSON.parse( ( msg.content.toString() ) );
        if ( data.cmd === cmd ) this.channel.ack( msg );

        return data.data;
    }
}
