
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Counties :`, data, colors.reset );

import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { Roles } from './../_decorators/roles-auth.decorator';
import { RolesGuard } from './../_decorators/guards/roles.guard';
import { Country } from './countries.struct';
import { CreateCountryDto } from './dto/create-country.dto';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';

@ApiTags('Страны')
@Controller('api/countries')
export class CountriesController {
    constructor(private countriesService: CountriesService) {}

    @ApiOperation({ summary: 'Создание страны' })
    @ApiBody({ required: true, type: CreateCountryDto, description: 'Объект с данными для создания страны' })
    @ApiResponse({ status: 200, type: Country })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createCountry(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
        log('createCountry');
        return this.countriesService.createCountry(createCountryDto);
    }

    @ApiOperation({ summary: 'Получение массива всех стран' })
    @ApiResponse({ status: 200, type: [Country] })
    @UseGuards(JwtAuthGuard)
    @Get()
    getAllCountries(): Promise<Country[]> {
        log('getAllCountries');
        return this.countriesService.getAllCountries();
    }

    @ApiOperation({ summary: 'Удаление страны' })
    @ApiParam({ required: true, name: 'id', description: 'id страны', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteCountryById(@Param('id') id: number): Promise<number> {
        log('deleteCountryById');
        return this.countriesService.deleteCountryById(id);
    }
}
