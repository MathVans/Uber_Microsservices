import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchingService } from './matching.service';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { UpdateMatchingDto } from './dto/update-matching.dto';

@Controller()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @MessagePattern('createMatching')
  create(@Payload() createMatchingDto: CreateMatchingDto) {
    return this.matchingService.create(createMatchingDto);
  }

  @MessagePattern('findAllMatching')
  findAll() {
    return this.matchingService.findAll();
  }

  @MessagePattern('findOneMatching')
  findOne(@Payload() id: number) {
    return this.matchingService.findOne(id);
  }

  @MessagePattern('updateMatching')
  update(@Payload() updateMatchingDto: UpdateMatchingDto) {
    return this.matchingService.update(updateMatchingDto.id, updateMatchingDto);
  }

  @MessagePattern('removeMatching')
  remove(@Payload() id: number) {
    return this.matchingService.remove(id);
  }
}
