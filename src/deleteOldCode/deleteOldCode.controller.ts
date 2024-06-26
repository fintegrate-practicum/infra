import { Injectable } from "@nestjs/common";

@Injectable()
export class deleteOldCode{
    verificationCodeModel: any;

    async deleteExpireCode(email: string, code: string): Promise<boolean> {
        const verificationCode = await this.verificationCodeModel({ email, code }).exec();
        if (!verificationCode) return false;
        const isExpired = verificationCode.expiresAt < new Date();
        if (isExpired) {
          await this.removeVerificationCode(code);
          return false;
    
        }
        return true;
      }

    

}