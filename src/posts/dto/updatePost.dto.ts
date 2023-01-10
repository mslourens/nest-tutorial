import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class UpdatePostDto {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsOptional()
  @IsString()
  content: string;
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  category?: string;
}
