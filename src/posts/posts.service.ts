import { Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './post.entity';
import { PostNotFoundException } from 'posts/exception/postNotFund.exception';
import User from 'users/user.entity';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postRepository.find({ relations: ['author'] });
  }

  getPostById(id: number) {
    const post = this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }
  async createPost(post: CreatePostDto, user: User) {
    const newPost = this.postRepository.create({ ...post, author: user });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deletedResponse = await this.postRepository.delete(id);
    if (!deletedResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
