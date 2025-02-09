import { Injectable, Logger } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { CallRepository } from './infrastructure/persistence/call.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Call } from './domain/call';
import { CallMapper } from './infrastructure/persistence/relational/mappers/call.mapper';

@Injectable()
export class CallsService {
  private readonly logger = new Logger(CallsService.name);
  constructor(private readonly callRepository: CallRepository) {}

  async create(createCallDto: CreateCallDto) {
    const call = await this.callRepository.create(createCallDto);
    const procUrl = `${process.env.PROCESSING_URL}/audio/transcode`;
    this.logger.debug(`Sending POST request to ${procUrl} for call ${call.id}`);
    try {
      const request = new Request(procUrl, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_url: call.audio_url, id: call.id }),
      });
      const responseText = await fetch(request).then((response) =>
        response.text(),
      );
      this.logger.debug(`Proc response ${responseText}`);
      return { id: call.id };
    } catch {
      return { id: call.id };
    }
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.callRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findOne(id: Call['id']) {
    const call = await this.callRepository.findById(id);
    if (call) {
      return CallMapper.toResponse(call);
    }
  }

  async update(id: Call['id'], updateCallDto: UpdateCallDto) {
    this.logger.debug(
      `Recieved patch call request ${JSON.stringify(updateCallDto)}`,
    );
    const updatedCall = await this.callRepository.update(id, {
      ...updateCallDto,
    });
    if (updatedCall) {
      return CallMapper.toResponse(updatedCall);
    }
  }

  remove(id: Call['id']) {
    return this.callRepository.remove(id);
  }
}
