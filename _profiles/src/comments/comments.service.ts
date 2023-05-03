
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Comments :`, data, colors.reset);

import * as uuid from 'uuid';
import { ConflictException,
         Injectable,
         NotFoundException,
         ForbiddenException,
         UnauthorizedException,
         Inject,
         forwardRef} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProfilesService } from '../profiles/profiles.service';
import { JwtService } from '@nestjs/jwt';
import { Comment } from './comments.struct';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetPrimaryCommentDto } from './dto/get-primary-comment.dto';
import { QueueNames, RMQ } from '../rabbit.core';

@Injectable()
export class CommentsService {
    constructor(private jwtService: JwtService,
                @InjectModel(Comment) private commentsDB: typeof Comment,
                @Inject(forwardRef(() => ProfilesService)) private profilesService: ProfilesService,
    ) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FC_cmd, QueueNames.FC_data));;
    }

    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        log('createComment');

        const profile = await this.profilesService.getSimpleProfileByUserId(createCommentDto.idUser);

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

        return await this.commentsDB.create({...createCommentDto, idProfile: profile.id});
    }

    async getCommentsByFilm(idFilm: number): Promise<GetPrimaryCommentDto[]> {
        log('getCommentsByFilm');

        const found: any[] = await this.commentsDB.findAll({
            paranoid: false,
            where: {
                [Op.and]: [{ idFilm }, { prevId: null }],
            },
            include: { all: true },
        });

        for (let i = 0; i < found.length; i++) {
            const childrenCount = await this.commentsDB.count({
                paranoid: false,
                where: { prevId: found[i].id },
            });

            if (found[i].dataValues.deletedAt) {
                found[i].dataValues = {
                    id: found[i].dataValues.id,
                    deletedAt: found[i].dataValues.deletedAt,
                };
            } else {
                found[i].dataValues.profile = this.profilesService.setImageAsFile(found[i].dataValues.profile);
            }

            found[i].dataValues.childrenCount = childrenCount;
        }
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
                include: { all: true },
            });
            for (let i = 0; i < found.length; i++)
                found[i] = await placeChildren(found[i]);

            if (!comment.dataValues) {
                return { id: +comment.id, children: found };
            }

            if (comment.dataValues.deletedAt) {
                comment.dataValues = {
                    id: comment.dataValues.id,
                    deletedAt: comment.dataValues.deletedAt,
                };
            } else {
                comment.dataValues.profile = this.profilesService.setImageAsFile(comment.dataValues.profile);
            }
            return { ...comment.dataValues, children: found };
        }

        return await placeChildren(comments);;
    }

    async deleteCommentById(authHeader: string, id: number): Promise<number> {
        log('deleteCommentById');

        const user = (() => { log('jwtVerify');
            const [ token_type, token ] = authHeader.split(' ');
            if (token_type !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'User unauthorized' });
            }
            return this.jwtService.verify(token);
        })();

        const comment = await this.commentsDB.findByPk(id);
        if (!comment) {
            throw new NotFoundException({ message: 'Comment not found' });
        }

        if (user.role.name !== 'ADMIN' && user.id !== comment.idUser) {
            throw new ForbiddenException({ message: 'No access' });
        }

        return await this.commentsDB.destroy({ where: { id } });
    }

    async deleteCommentsByFilmId(idFilm: number): Promise<number> {
        log('deleteCommentsByFilmId');

        return await this.commentsDB.destroy({
            force: true,
            where: {idFilm}
        });
    }

    async deleteCommentsByProfileId(idProfile: number): Promise<number> {
        log('deleteCommentsByProfileId');
        return await this.commentsDB.destroy({ where: {idProfile} });
    }

    private async getCommentById(id: number): Promise<Comment> {
        log('getCommentById');
        return await this.commentsDB.findByPk(id);
    }
}
