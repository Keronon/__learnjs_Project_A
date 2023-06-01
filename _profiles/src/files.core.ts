
const log = ( data: any ) => console.log( colors.fg.blue, `- - > F-Profiles :`, data, colors.reset );

import * as path from 'path';
import * as fs   from 'fs';
import * as uuid from 'uuid';

import { colors } from './console.colors';
import { InternalServerErrorException } from '@nestjs/common';

export function addFile(file: any)
{
    log('add file');

    try {
        const file_name: string = file.originalname;
        const f_path = path.resolve( __dirname, '..', '_files' );
        const f_name = uuid.v4() + file_name.substring( file_name.lastIndexOf('.') );

        // если составленного пути нет - создать недостающие папки
        if ( !fs.existsSync(f_path) )
            fs.mkdirSync( f_path, { recursive: true } );

        fs.writeFileSync( path.join( f_path, f_name ), file.buffer );

        return f_name;
    } catch (e) {
        throw new InternalServerErrorException({ message: 'Ошибка записи файла' });
    }
}

export function getFile(fileName: string)
{
    log('getFile');

    const f_path = path.resolve( __dirname, '..', '_files' );
    const f_name = path.join(f_path, fileName);

    if (!fs.existsSync(f_name)) return null;

    return {
        fileName: fileName,
        base64: fs.readFileSync(f_name).toString('base64')
    };
}

export function deleteFile(fileName: string)
{
    log('delete file');

    try {
        const f_path = path.resolve( __dirname, '..', '_files' );
        fs.rmSync( path.join( f_path, fileName ) );

        return true;
    } catch (e) {
        throw new InternalServerErrorException({ message: 'Ошибка удаления файла' });
    }
}