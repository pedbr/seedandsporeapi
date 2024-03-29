import * as mailClient from '@sendgrid/mail'
import { Response } from 'express'
import { MY_EMAIL, SENDGRID_API_KEY } from '../config/secrets'

mailClient.setApiKey(SENDGRID_API_KEY)

interface ContactEmailRequest {
  body: { from: string; name: string; message: string }
}

const sendContactEmail = async (req: ContactEmailRequest, res: Response) => {
  const { from, name, message } = req.body
  try {
    await mailClient.send({
      to: {
        email: MY_EMAIL,
        name: 'Seed and Spore Contact Form',
      },
      from: {
        email: MY_EMAIL,
        name: name,
      },
      dynamicTemplateData: {
        clientName: name,
        clientEmail: from,
        message,
      },
      templateId: 'd-ff93293216f140069be5b688593219bc',
    })

    res.status(200).send({
      status: 'success',
      message: 'Email sent successfully',
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export { sendContactEmail }
