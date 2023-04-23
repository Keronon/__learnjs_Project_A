
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Rating_films :`, data, colors.reset );

import { Injectable } from '@nestjs/common';

@Injectable()
export class RatingFilmsService {}
