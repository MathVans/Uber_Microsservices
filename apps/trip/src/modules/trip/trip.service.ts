import { Injectable } from "@nestjs/common";
import { CreateTripDto } from "./dto/create-trip.dto";
import { UpdateTripDto } from "./dto/update-trip.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Trip, TripDocument } from "./entities/trip.entity";
import { Model } from "mongoose";

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  create(createTripDto: CreateTripDto) {
    return "This action adds a new trip";
  }

  findAll() {
    return `This action returns all trip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
