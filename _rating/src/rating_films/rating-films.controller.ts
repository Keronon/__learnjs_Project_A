
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Rating_films :`, data, colors.reset );

import { Controller } from '@nestjs/common';

@Controller('api/rating-films')
export class RatingFilmsController {}
