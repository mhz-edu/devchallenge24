import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  Res,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Call } from './domain/call';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCallsDto } from './dto/find-all-calls.dto';

@ApiTags('Calls')
@Controller({
  path: 'call',
})
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Call,
  })
  create(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: 422,
      }),
    )
    createCallDto: CreateCallDto,
  ) {
    return this.callsService.create(createCallDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Call),
  })
  async findAll(
    @Query() query: FindAllCallsDto,
  ): Promise<InfinityPaginationResponseDto<Call>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.callsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Call,
  })
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const call = await this.callsService.findOne(id);
    if (!call?.text) {
      res.status(HttpStatus.ACCEPTED).json({});
    } else {
      res.status(HttpStatus.OK).json(call);
    }
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Call,
  })
  async update(@Param('id') id: number, @Body() updateCallDto: UpdateCallDto) {
    const call = await this.callsService.findOne(id);
    if (!call) {
      throw new NotFoundException();
    }
    return this.callsService.update(id, updateCallDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  async remove(@Param('id') id: number) {
    const call = await this.callsService.findOne(id);
    if (!call) {
      throw new NotFoundException();
    }
    return this.callsService.remove(id);
  }
}
