
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comments.struct';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment) private commentsDB: typeof Comment
    ) {}

    async createComment ( dto: CreateCommentDto ): Promise<Comment>
    {
        return await this.commentsDB.create(dto);
    }

    async getCommentsByFilm ( idFilm: number ): Promise<Comment[]>
    {
        return await this.commentsDB.findAll({
            where: { idFilm },
            include: { all: true },
        });
    }

    async getCommentsByComment ( idComment: number ): Promise<Comment[]>
    {
        let comments: Comment[] = [];
        let found: Comment[] | number[] = [idComment];

        while (found.length > 0) {
            found = await this.commentsDB.findAll({
                where: { prevId: found as number[] },
                include: { all: true },
            });

            if (found.length > 0) {
                comments.push(...found);

                found = found.map( (v) => v.id );
            }
        }

        return comments;
    }

    // TODO : добавить удаление
}
