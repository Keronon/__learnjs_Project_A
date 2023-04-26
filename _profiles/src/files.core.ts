
const log = ( data: any ) => console.log( colors.fg.blue, `- - > F-Profiles :`, data, colors.reset );

import * as path from 'path';
import * as fs   from 'fs';
import * as uuid from 'uuid';

import { colors } from './console.colors';
import { InternalServerErrorException, StreamableFile } from '@nestjs/common';

export function addFile(file: any)
{
    log('add file');

    try {
        const file_name: string = file.originalname;
        const f_path = path.resolve( __dirname, '..', '_images' );
        const f_name = uuid.v4() + file_name.substring( file_name.lastIndexOf('.') );

        // если составленного пути нет - создать недостающие папки
        if ( !fs.existsSync(f_path) )
            fs.mkdirSync( f_path, { recursive: true } );

        fs.writeFileSync( path.join( f_path, f_name ), file.buffer );

        return true;
    } catch (e) {
        throw new InternalServerErrorException({ message: 'Ошибка записи файла' });
    }
}

export function getStreamableFile(fileName: string)
{
    log('getStreamableFile');

    const f_path = path.resolve( __dirname, '..', '_images' );
    fileName = path.join(f_path, fileName);

    if (!fs.existsSync(fileName)) return '< ! файл не найден ! >';

    const file = fs.createReadStream(fileName);
    return new StreamableFile(file);
}

export function deleteFile(fileName: string)
{
    log('delete file');

    try {
        const f_path = path.resolve( __dirname, '..', 'loads' );
        fs.rmSync( path.join( f_path, fileName ) );

        return true;
    } catch (e) {
        throw new InternalServerErrorException({ message: 'Ошибка удаления файла' });
    }
}
