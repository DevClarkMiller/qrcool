import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: parseInt(process.env.TRANSPONDER_PORT as string),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export namespace Mail{

}


export class Mailer{
    private trans: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor(transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>){ 
        this.trans = transporter; 
    }

    async send(options: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo>{
        try{
            const info: nodemailer.SentMessageInfo = await this.trans.sendMail(options);
            return info;
        }catch(err: any){
            console.error("Error: Couldn't send mail: " + err.message);
            throw err;
        }
    }

    // async sendTemplate(options: nodemailer.SendMailOptions, template: any): Promise<void>{

    // }
}