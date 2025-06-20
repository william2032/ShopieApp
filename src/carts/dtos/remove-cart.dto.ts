import { IsInt, IsUUID, Min } from 'class-validator';

export class RemoveFromCartDto {
  @IsUUID()
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
