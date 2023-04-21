
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface MemberCreationAttrs {
}

@Table({ tableName: 'members' })
export class Member extends Model<Member, MemberCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id участвовавшего в фильме' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
}
