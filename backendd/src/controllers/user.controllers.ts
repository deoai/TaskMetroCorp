import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entities";

@Controller('user')
export class UserController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    @Get()
    async getAllUsers() {
        return await this.userRepository.find();
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }

    @Post()
    async createUser(@Body() user: User) {
        return await this.userRepository.save(user);
    }

    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() user: User) {
        await this.userRepository.update(id, user);
        return await this.userRepository.findOne({ where: { id } });
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        await this.userRepository.delete(id);
        return { deleted: true };
    }
}