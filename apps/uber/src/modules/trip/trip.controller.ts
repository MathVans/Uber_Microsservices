import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from '@app/common/modules/trip/dto/create-trip.dto';
import { EstimateTripDto } from '@app/common/modules/trip/dto/estimate-trip.dto';
import { GatewayAuthGuard } from '../../shared/guards/gateway.auth.guard';

@UseGuards(GatewayAuthGuard)
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get('/health')
  checkHealth() {
    return this.tripService.checkHealth();
  }

  @Post('/estimate')
  estimate(@Body() estimateTripDto: EstimateTripDto) {
    return this.tripService.estimate(estimateTripDto);
  }

  @Get('/me')
  findByUser(@Req() req) {
    const userId = req.headers['X_User_Id'];

    return this.tripService.findByUser(userId);
  }

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  // @Post('/:id/cancel')
  // cancel(@Param('id') id: string) {
  //   return this.tripService.cancel(id);
  // }

  // @Post('/:id/accept')
  // accept(@Param('id') id: string) {
  //   return this.tripService.accept(id);
  // }

  // @Post('/:id/start')
  // start(@Param('id') id: string) {
  //   return this.tripService.start(id);
  // }

  // @Post('/:id/finish')
  // finish(@Param('id') id: string) {
  //   return this.tripService.finish(id);
  // }
}
