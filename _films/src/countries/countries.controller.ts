
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { Roles } from './../_decorators/roles-auth.decorator';
import { RolesGuard } from './../_decorators/guards/roles.guard';
import { Country } from './countries.model';
import { CreateCountryDto } from './dto/create-country.dto';

@ApiTags('Страны')
@Controller('api/countries')
export class CountriesController {
    constructor(private countriesService: CountriesService) {}

    @ApiOperation({ summary: 'Получение массива всех стран' })
    @ApiResponse({ status: 200, type: [Country] })
    @Get()
    getAllCountries(): Promise<Country[]> {
        return this.countriesService.getAllCountries();
    }

    @ApiOperation({ summary: 'Создание страны (ADMIN)' })
    @ApiBody({ required: true, type: CreateCountryDto, description: 'Объект с данными для создания страны' })
    @ApiResponse({ status: 200, type: Country })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createCountry(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
        return this.countriesService.createCountry(createCountryDto);
    }

    @ApiOperation({ summary: 'Удаление страны (ADMIN)' })
    @ApiParam({ required: true, name: 'id', description: 'id страны', example: 1 })
    @ApiResponse({ status: 204 })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    @HttpCode(204)
    deleteCountryById(@Param('id') id: number): Promise<number> {
        return this.countriesService.deleteCountryById(id);
    }
}
