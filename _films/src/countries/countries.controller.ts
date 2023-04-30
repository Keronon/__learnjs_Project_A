
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Counties :`, data, colors.reset);

import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse,
         ApiBearerAuth,
         ApiBody,
         ApiConflictResponse,
         ApiCreatedResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse,
         ApiOkResponse,
         ApiOperation,
         ApiParam,
         ApiTags,
         ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from './../_decorators/guards/roles.guard';
import { Country } from './countries.struct';
import { CreateCountryDto } from './dto/create-country.dto';

@ApiTags('Страны')
@Controller('api/countries')
export class CountriesController {
    constructor(private countriesService: CountriesService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Создание страны (ADMIN)' })
    @ApiBody({ type: CreateCountryDto, description: 'Объект с данными для новой страны' })
    @ApiCreatedResponse({ type: Country, description: 'Успех. Ответ - созданная страна' })
    @ApiBadRequestResponse({
        schema: { example: ['nameRU - Must be a string', 'nameEN - Must be a string'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'This country name already exists' } },
        description: 'Страна с данным названием уже существует. Ответ - Error: Conflict',
    })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @ApiForbiddenResponse({
        schema: {
            example: {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden',
            },
        },
        description: 'Доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createCountry(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
        log('createCountry');
        return this.countriesService.createCountry(createCountryDto);
    }

    @ApiOperation({ summary: 'Получение массива всех стран' })
    @ApiOkResponse({ type: [Country], description: 'Успех. Ответ - массив стран' })
    @Get()
    getAllCountries(): Promise<Country[]> {
        log('getAllCountries');
        return this.countriesService.getAllCountries();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление страны (ADMIN)' })
    @ApiParam({ name: 'id', description: 'id страны', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Country not found' } },
        description: 'Страна не найдена. Ответ - Error: Not Found',
    })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @ApiForbiddenResponse({
        schema: {
            example: {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden',
            },
        },
        description: 'Доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteCountryById(@Param('id') id: number): Promise<number> {
        log('deleteCountryById');
        return this.countriesService.deleteCountryById(id);
    }
}
