import { IsOptional, IsString } from 'class-validator';

export default class CreatePostDto {
  @IsString()
  @IsOptional()
  content: string;
  @IsString()
  @IsOptional()
  title: string;
  @IsOptional()
  @IsString()
  category?: string;
}
