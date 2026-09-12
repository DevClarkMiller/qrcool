import { jest } from '@jest/globals';
import { Readable } from 'stream';
import * as Minio from 'minio';
import FileManager from 'src/infrastructure/fileManager';

// Stubs the real Minio.Client so tests never open a network connection.
export const mockMinioClient = {
    getObject: jest.fn<() => Promise<Readable>>().mockResolvedValue(Readable.from([])),
    listBuckets: jest.fn<() => Promise<Minio.BucketItemFromList[]>>().mockResolvedValue([]),
    putObject: jest.fn<(bucket: string, object: string, stream: unknown, size: number, callback: (err: any, info: any) => void) => void>()
        .mockImplementation((_bucket, _object, _stream, _size, callback) => callback(null, {})),
    listObjects: jest.fn<() => Readable>().mockReturnValue(Readable.from([], { objectMode: true })),
    removeObjects: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    removeObject: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    statObject: jest.fn<() => Promise<any>>().mockResolvedValue({ metaData: { 'content-type': 'application/octet-stream' } }),
} as unknown as Minio.Client;

export const mockFileManager = new FileManager(mockMinioClient);
