import fetch from 'node-fetch';

export class S3Service {
  private baseUrl: string;
  private bucketName: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.S3_ENDPOINT || '';
    this.bucketName = process.env.S3_BUCKET || 'focuslab-resources';
    this.apiKey = process.env.S3_SECRET_KEY || '';
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const url = `${this.baseUrl}/storage/v1/object/${this.bucketName}/${key}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': file.mimetype,
      },
      body: file.buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir archivo: ${response.status} - ${errorText}`);
    }

    // Retornamos la URL pública
    return `${this.baseUrl}/storage/v1/object/public/${this.bucketName}/${key}`;
  }
}