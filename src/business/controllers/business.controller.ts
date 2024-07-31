import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from '../services/business.service';
import { VerificationService } from '../../verification/vertification.services';
import { CreateBusinessDto } from '../dto/create-busin-first.dto';
import { CreateBusinessDtoLevel2 } from '../dto/create-busin-secons.dto';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';

@Controller('business')
@UseGuards(AuthGuard('jwt'))
export class businessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly verificationService: VerificationService,
  ) {}

  @Get(':companyNumber')
  @UseGuards(AuthGuard('jwt'))
  async getBusinessByCompanyNumber(@Param('companyNumber') companyNumber: string) {
    try {
      const response = this.businessService.getBusinessByCompanyNumber(companyNumber);
      if (!response) {
        throw new HttpException('business not found', HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('link/:linkUID')
  @UseGuards(AuthGuard('jwt'))
  async getBusinessByLinkUID(@Param('linkUID') linkUID: string) {
    try {
      const response = await this.businessService.getBusinessByLinkUID(linkUID);
      if (!response) {
        throw new HttpException('business not found', HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':companyNumber')
  @UseGuards(AuthGuard('jwt'))
  deleteBusinessByCompanyNumber(@Param('companyNumber') companyNumber: string) {
    try {
      const response = this.businessService.deleteBusinessByCompanyNumber(companyNumber);
      if (!response) {
        throw new HttpException('business not found', HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async createBusiness(@Body() business: CreateBusinessDto) {
    try {
      const response = this.businessService.createBusiness(business);
      if (!response) {
        throw new HttpException('business not found', HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put(':companyNumber')
  async updateBusinessByCompanyNumber(
    @Param('companyNumber') companyNumber: string,
    @Body() newData: CreateBusinessDtoLevel2,
  ): Promise<CreateBusinessDtoLevel2> {
    console.log('Update route accessed'); // בדוק אם זה נדפס
    console.log(`Company Number: ${companyNumber}`);
    console.log('New Data:', newData);

    try {
      if (newData.logo) {
        console.log('Processing logo'); // הוסף הדפסות לבדוק אם זה עובר
        const filepath = `./logo/company${companyNumber}.png`;
        fs.writeFileSync(filepath, newData.logo, { encoding: 'base64' });
        newData.logo = filepath;
      }

      const updatedBusiness = await this.businessService.updateBusinessByCompanyNumber(
        companyNumber,
        newData,
      );
      console.log('Business updated'); // הוסף הדפסות לבדוק אם זה עובר

      if (!updatedBusiness) {
        throw new HttpException('Business not found', HttpStatus.BAD_REQUEST);
      }
      return updatedBusiness;
    } catch (error) {
      console.error('Update error:', error); // הוסף הדפסות לעקוב אחרי בעיות
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
