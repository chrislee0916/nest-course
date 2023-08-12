
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    // @Type(() => Number) 因為在 main.ts 使用 transformOptions.enableImplicitConversion = true
    limit: number;

    @IsOptional()
    @IsPositive()
    offset: number;
}

