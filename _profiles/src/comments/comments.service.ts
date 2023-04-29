import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Comments :`, data, colors.reset);

import * as uuid from 'uuid';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Comment } from './comments.struct';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { QueueNames, RMQ } from './../rabbit.core';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment) private commentsDB: typeof Comment,
        private profilesService: ProfilesService,
    ) {
        RMQ.connect();
    }

    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        log('createComment');

        const profile = await this.profilesService.getProfileByIdWithoutConversion(createCommentDto.idProfile);
        if (!profile) {
            throw new NotFoundException({ message: 'Profile not found' });
        }

        if (createCommentDto.prevId) {
            const prevComment = await this.getCommentById(createCommentDto.prevId);
            if (!prevComment) {
                throw new NotFoundException({ message: 'Previous comment not found' });
            }

            if (createCommentDto.idFilm !== prevComment.idFilm) {
                throw new ConflictException({
                    message: 'IdFilm of the comment and the previous comment do not match',
                });
            }
        } else {
            // ! idFilm -> micro Film -> true/false
            const res = await RMQ.publishReq(QueueNames.CF_cmd, QueueNames.CF_data, {
                id_msg: uuid.v4(),
                cmd: 'checkExistenceFilmById',
                data: createCommentDto.idFilm,
            });
            if (!res) throw new NotFoundException({ message: 'Film not found' });
        }

        return await this.commentsDB.create(createCommentDto);
    }

    async getCommentsByFilm(idFilm: number): Promise<any[]> {
        log('getCommentsByFilm');

        const found: any[] = await this.commentsDB.findAll({
            paranoid: false,
            where: {
                [Op.and]: [{ idFilm }, { prevId: null }],
            },
            include: { all: true },
        });
        for (let i = 0; i < found.length; i++)
            found[i].childrenCount = await this.commentsDB.count({
                paranoid: false,
                where: { prevId: found[i].id }
            });

        return found;
    }

    async getCommentsByComment(idComment: number): Promise<any> {
        log('getCommentsByComment');

        let comments: any = {id: idComment};

        const placeChildren = async (comment: any) =>
        {
            const found: any = await this.commentsDB.findAll({
                paranoid: false,
                where: { prevId: comment.id },
                include: { all: true }
            });
            for (let i = 0; i < found.length; i++)
                found[i] = await placeChildren(found[i]);

            return {id: comment.id, children: found};
        }
        return await placeChildren(comments);
    }

    private async getCommentById(id: number): Promise<Comment> {
        log('getCommentById');

        return await this.commentsDB.findByPk(id);
    }

    async deleteCommentById(id: number): Promise<number> {
        log('deleteCommentById');

        return await this.commentsDB.destroy({
            where: {id}
        });
    }

    async deleteCommentsByIdFilm(idFilm: number): Promise<number> {
        log('deleteCommentsByIdFilm');

        return await this.commentsDB.destroy({
            force: true,
            where: {idFilm}
        });
    }
}
