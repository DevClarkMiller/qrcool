import loadEnv from '../infrastructure/loadEnv';
import {describe, expect, test} from '@jest/globals';
import CoordsTranslator from '../infrastructure/coordsTranslator';
import { LocationPlace } from 'src/types';

loadEnv();

const coordsTranslator = new CoordsTranslator(process.env.GEOAPIFY_KEY as string);

describe("Gets a location", function(){
    it("should return a LocationPlace", async () =>{
        const res: LocationPlace = await coordsTranslator.processOne({
            Latitude: 42.991616,
            Longitude: -81.3039616
        });
        console.log(res);
        expect(res).toBeDefined();
    });
});

// describe('Gets multiple locations', () => {
//     it("should return at least one LocationPlace", async () =>{
//         const res: LocationPlace[] | null = await coordsTranslator.processMany([{
//             Latitude: 42.991616,
//             Longitude: -81.3039616
//         }]);
//         expect(true).toBeTruthy();
//         // expect(res).toBeDefined();
//     });
// });