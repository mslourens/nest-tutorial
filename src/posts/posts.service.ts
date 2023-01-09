import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './post.entity';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postRepository.find();
  }

  getPostById(id: number) {
    const post = this.postRepository.findOneBy({ id });
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOneBy({ id });
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
  async createPost(post: CreatePostDto) {
    const newPost = this.postRepository.create(post);
    await this.postRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deletedResponse = await this.postRepository.delete(id);
    if (!deletedResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
