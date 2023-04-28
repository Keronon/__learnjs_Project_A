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

    async getCommentsByFilm(idFilm: number): Promise<Comment[]> {
        log('getCommentsByFilm');

        return await this.commentsDB.findAll({
            where: {
                [Op.and]: [{ idFilm }, { prevId: null }],
            },
            include: { all: true },
        });
    }

    async getCommentsByComment(idComment: number): Promise<any> {
        log('getCommentsByComment');

        let comments: any = {id: idComment};

        const placeChildren = async (comment: any) =>
        {
            const found: any = await this.commentsDB.findAll({
                where: { prevId: comment.id }
            });
            for (let i = 0; i < found.length; i++)
                found[i] = await placeChildren(found[i]);

            return {id: comment.id, children: found};
        }
        return await placeChildren(comments);
    }

    // TODO : добавить удаление

    private async getCommentById(id: number): Promise<Comment> {
        log('getCommentById');

        return await this.commentsDB.findByPk(id);
    }
}
